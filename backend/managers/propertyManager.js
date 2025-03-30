/**
* @name: Co-Space Web App - Property Manager
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const propertyRepository = require('../repositories/propertyRepository');
const workspaceRepository = require('../repositories/workspaceRepository');
const { ValidateRequiredField } = require('../utilities/validator');
const { Op } = require('sequelize');

const createProperty = async (req, res) => {
    try {
        const { name, street, city, state, postalCode, neighborhood, squareFeet, hasParkingGarage, hasTransportation } = req.body;

        // Validate required fields
        const validations = [
            { field: name, name: "Property Name" },
            { field: street, name: "Street" },
            { field: city, name: "City" },
            { field: state, name: "State" },
            { field: postalCode, name: "Postal Code" },
            { field: neighborhood, name: "Neighborhood" },
            { field: squareFeet, name: "Square Feet" }
        ];

        for (const { field, name } of validations) {
            const validationError = ValidateRequiredField(field, name);
            if (validationError) return res.status(400).json({ message: validationError });
        }

        // Check if the property already exists
        const existingProperty = await propertyRepository.getPropertyByParam({
            where: {
                [Op.and]: [{ name }, { city }]
            }
        });

        if (existingProperty) {
            return res.status(400).json({ message: `Property '${name}' already exists.` });
        }
        
        // Prepare the property object
        const requestProperty = {
            name, 
            street, 
            city, 
            state, 
            postalCode, 
            neighborhood, 
            squareFeet, 
            hasParkingGarage, 
            hasTransportation,
            ownerId: req.user?.id ?? '', // this is from middleware
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
        };

        // Save the property
        const createdProperty = await propertyRepository.saveProperty(requestProperty);

        return createdProperty;

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        // Request Body
        const { id } = req.params;
        const { name, street, city, state, postalCode, neighborhood, squareFeet, hasParkingGarage, hasTransportation } = req.body;

        // validate if property passed
        if (!id) return res.status(400).json({ message: "Property ID is required." });

        // get existing property
        const currentProperty = await propertyRepository.getPropertyById(id);
        if (!currentProperty) return res.status(404).json({ message: "Property not found." });

        // check if this user is allowed to update this property
        const currentUserId = req.user?.id // this is from middleware
        if(currentUserId !== currentProperty.ownerId) return res.status(401).json({ message: "Unauthorized to update this property." });

        // Update only provided fields
        if (name) currentProperty.name = name;
        if (street) currentProperty.street = street;
        if (city) currentProperty.city = city;
        if (state) currentProperty.state = state;
        if (postalCode) currentProperty.postalCode = postalCode;
        if (neighborhood) currentProperty.neighborhood = neighborhood;
        if (squareFeet) currentProperty.squareFeet = squareFeet;
        if (hasParkingGarage) currentProperty.hasParkingGarage = hasParkingGarage;
        if (hasTransportation) currentProperty.hasTransportation = hasTransportation;
        
        // Updates updated date
        currentProperty.updatedDate = new Date().toISOString();

        // Save the modified property
        const updatedProperty = await currentProperty.save();
        return updatedProperty;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const deleteProperty = async (req, res) => {
    try {
        // Request Body
        const { id } = req.params;

        // validate if property passed
        if (!id) return res.status(400).json({ message: "Property ID is required." });

        // get existing property
        const currentProperty = await propertyRepository.getPropertyById(id);
        if (!currentProperty) return res.status(404).json({ message: "Property not found." });

        // check if this user is allowed to delete this property
        const currentUserId = req.user?.id // this is from middleware
        if(currentUserId !== currentProperty.ownerId) return res.status(401).json({ message: "Unauthorized to delete this property." });

        // delete related workspaces here
        await workspaceRepository.deleteWorkspaceByParams({ propertyId: id });

        // delete property
        await propertyRepository.deletePropertyByParams({id: id});

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getProperties = async (req, res) => {
    try {
        // Request optional params
        const { name, city, state, ownerId } = req.query;

        // Set params as filters
        const filter = {};
        if (name) filter.name = name;
        if (city) filter.city = city;
        if (state) filter.state = state;
        if (ownerId) filter.ownerId = ownerId;

        // Get properties with optional filters 
        const properties = await propertyRepository.getPropertiesByParam({
            attributes: ["id", "name", "street", "city", "state", "postalCode", "neighborhood", "squareFeet", "hasParkingGarage", "hasTransportation", "ownerId", "createdDate", "updatedDate"],
            where: filter,
            order: [["createdDate", "DESC"]]
        });

        return res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await propertyRepository.getPropertyById(id, {
            attributes: ["id", "name", "street", "city", "state", "postalCode", "neighborhood", "squareFeet", "hasParkingGarage", "hasTransportation", "ownerId", "createdDate", "updatedDate"]
        });
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createProperty,
    updateProperty,
    getProperties,
    getProperty,
    deleteProperty
};