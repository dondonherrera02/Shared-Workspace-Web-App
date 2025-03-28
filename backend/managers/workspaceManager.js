/**
* @name: Co-Space Web App - Property Manager
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const workspaceRepository = require('../repositories/workspaceRepository');
const propertyRepository = require('../repositories/propertyRepository');
const { ValidateRequiredField } = require('../utilities/validator');
const { WorkspaceTypeEnum, WorkspaceLeaseTermEnum } = require('../utilities/enum');
const { Op } = require('sequelize');

// Create workspace
const createWorkspace = async (req, res) => {
    try {
        // Request Body
        const { propertyId } = req.params;
        const { roomNumber, type, capacity, leaseTerm, availabilityDate, isSmokingAllowed, price } = req.body;

        // Array of fields to validate
        const validations = [
            { field: roomNumber, name: "Room Number" },
            { field: type, name: "Workspace Type" },
            { field: capacity, name: "Capacity" },
            { field: leaseTerm, name: "Lease Term" },
            { field: availabilityDate, name: "Availability Date" },
            { field: price, name: "Price" },
            { field: propertyId, name: "Property" }
        ];

        // Check if required fields are present
        for (const { field, name } of validations) {
            const validationError = ValidateRequiredField(field, name);
            if (validationError) return res.status(400).json(validationError);
        }

        // Validate workspace type
        if (!WorkspaceTypeEnum.isValidType(type)) {
            return res.status(400).json({ message: "Invalid workspace type." });
        }

        // Validate lease term
        if (!WorkspaceLeaseTermEnum.isValidTerm(leaseTerm)) {
            return res.status(400).json({ message: "Invalid lease term." });
        }

        // Check if property id exists
        const existingProperty = await propertyRepository.getPropertyById(propertyId);

        if (!existingProperty) {
            return res.status(400).json({ message: `Cannot create workspace because property '${propertyId}' not found.` });
        }

        // Check if this property belongs to current user
        const currentUserId = req.user?.id // this is from middleware
        if(existingProperty.ownerId !== currentUserId) {
            return res.status(400).json({ message: `You can’t create a workspace for property '${existingProperty.name}' because it doesn’t belong to you.` });
        }

        // Check if the workspace exists
        const existingWorkspace = await workspaceRepository.getWorkspaceByParam({
            where: {
                [Op.and]: [{ roomNumber }, { type }, { propertyId }]
            }
        });

        if (existingWorkspace) {
            return res.status(400).json({ message: `Workspace with room '${roomNumber} - ${type}' already exists.` });
        }

        // Prepare the workspace object to save
        const requestWorkspace = {
            roomNumber,
            type,
            capacity,
            leaseTerm,
            availabilityDate,
            isSmokingAllowed,
            price,
            ownerId: req.user?.id ?? '', // this is from middleware
            propertyId,
            createdDate: new Date().toISOString(), // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
            updatedDate: new Date().toISOString()
        };

        // Save workspace
        const createdWorkspace = await workspaceRepository.saveWorkspace(requestWorkspace);

        return createdWorkspace;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Update workspace
const updateWorkspace = async (req, res) => {
    try {
        // Request Body
        const { id } = req.params;
        const { roomNumber, type, capacity, leaseTerm, availabilityDate, isSmokingAllowed, price } = req.body;

        // validate if workspace passed properly
        if (!id) return res.status(400).json({ message: "Workspace ID is required." });

        // get existing workspace
        const currentWorkspace = await workspaceRepository.getWorkspaceById(id);
        if (!currentWorkspace) return res.status(404).json({ message: "Workspace not found." });

        // check if this user is allowed to update this workspace
        const currentUserId = req.user?.id // this is from middleware
        if (currentUserId !== currentWorkspace.ownerId) return res.status(401).json({ message: "Unauthorized to update this workspace." });

        // Update only provided fields
        if (roomNumber) currentWorkspace.roomNumber = roomNumber;
        if (type) {
            // Validate workspace type
            if (!WorkspaceTypeEnum.isValidType(type)) {
                return res.status(400).json({ message: "Invalid workspace type." });
            }
            currentWorkspace.type = type;
        }
        if (capacity) currentWorkspace.capacity = capacity;
        if (leaseTerm) {
            // Validate lease term
            if (!WorkspaceLeaseTermEnum.isValidTerm(leaseTerm)) {
                return res.status(400).json({ message: "Invalid lease term." });
            }
            currentWorkspace.leaseTerm = leaseTerm;
        }
        if (availabilityDate) currentWorkspace.availabilityDate = availabilityDate;
        if (isSmokingAllowed) currentWorkspace.isSmokingAllowed = isSmokingAllowed;
        if (price) currentWorkspace.price = price;

        // Updates updated date
        currentWorkspace.updatedDate = new Date().toISOString();

        // Save the modified workspace
        const updatedWorkspace = await currentWorkspace.save();
        return updatedWorkspace;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Delete workspace
const deleteWorkspace = async (req, res) => {
    try {
        // Request Body
        const { id } = req.params;

        // validate if workspace passed properly
        if (!id) return res.status(400).json({ message: "Workspace ID is required." });

        // get existing workspace
        const currentWorkspace = await workspaceRepository.getWorkspaceById(id);
        if (!currentWorkspace) return res.status(404).json({ message: "Workspace not found." });

        // check if this user is allowed to delete this workspace
        const currentUserId = req.user?.id // this is from middleware
        if (currentUserId !== currentWorkspace.ownerId) return res.status(401).json({ message: "Unauthorized to delete this workspace." });

        // delete workspace
        await workspaceRepository.deleteWorkspace(currentWorkspace);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Get workspaces
const getWorkspaces = async (req, res) => {
    try {
        // Request optional params
        const {
            ownerId, propertyId, type, availabilityDate, capacity, leaseTerm, price, isSmokingAllowed,
            city, state, postalCode, neighborhood, squareFeet, hasParkingGarage, hasTransportation
        } = req.query;

        // Set params as filters
        const workspaceFilters = {};
        const propertyFilters = {};

        // Workspace filters
        if (ownerId) workspaceFilters.ownerId = ownerId;
        if (propertyId) workspaceFilters.propertyId = propertyId;

        // Property filters
        if (city) propertyFilters.city = city;
        if (state) propertyFilters.state = state;
        if (postalCode) propertyFilters.postalCode = postalCode;
        if (neighborhood) propertyFilters.neighborhood = neighborhood;
        if (squareFeet) propertyFilters.squareFeet = squareFeet;
        if (hasParkingGarage) propertyFilters.hasParkingGarage = hasParkingGarage;
        if (hasTransportation) propertyFilters.hasTransportation = hasTransportation;

        // Workspace filters
        if (type) propertyFilters.type = type;
        if (leaseTerm) propertyFilters.leaseTerm = leaseTerm;
        if (availabilityDate) propertyFilters.availabilityDate = availabilityDate;
        if (isSmokingAllowed) propertyFilters.isSmokingAllowed = isSmokingAllowed;
        if (capacity) propertyFilters.capacity = capacity;
        if (price) propertyFilters.price = price;

        const workspaces = await workspaceRepository.getWorkspacesByParam({
            workspaceFilters,
            propertyFilters
        });

        return res.json(workspaces);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get workspace
const getWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const workspace = await workspaceRepository.getWorkspaceById(id);
        res.status(200).json(workspace);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaces,
    getWorkspace
};