/**
* @name: Co-Space Web App - Workspace Controller
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// References:
// https://lo-victoria.com/build-a-rest-api-with-nodejs-routes-and-controllers
const workspaceManager = require('../managers/workspaceManager');

// COMMAND - POST, PUT, DELETE

// Create a new workspace
const createWorkspace = async (req, res) => {
    try {
        const workspace = await workspaceManager.createWorkspace(req, res);

        res.status(201).json({
            message: 'Workspace created successfully',
            workspace: {
                id: workspace.id,
                roomNumber: workspace.roomNumber,
                type: workspace.type,
                capacity: workspace.capacity,
                leaseTerm: workspace.leaseTerm,
                availabilityDate: workspace.availabilityDate,
                isSmokingAllowed: workspace.isSmokingAllowed,
                price: workspace.price,
                createdDate: workspace.createdDate,
                ownerId: workspace.ownerId,
                propertyId: workspace.propertyId
            }
        });
    } catch {
    }
};

// Update a workspace
const updateWorkspace = async (req, res) => {
    try {

        const workspace = await workspaceManager.updateWorkspace(req, res);

        res.status(200).json({
            message: 'Property updated successfully',
            workspace: {
                id: workspace.id,
                roomNumber: workspace.roomNumber,
                type: workspace.type,
                capacity: workspace.capacity,
                leaseTerm: workspace.leaseTerm,
                availabilityDate: workspace.availabilityDate,
                isSmokingAllowed: workspace.isSmokingAllowed,
                price: workspace.price,
                createdDate: workspace.createdDate,
                ownerId: workspace.ownerId,
                propertyId: workspace.propertyId
            }
        });
    } catch {
    }
};

// Delete workspace
const deleteWorkspace = async (req, res) => {
    try {
        await workspaceManager.deleteWorkspace(req, res);
        res.status(200).json({ message: 'Workspace deleted successfully'});
    } catch {
    }
};

// QUERY - GET

// Get workspace list
const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await workspaceManager.getWorkspaces(req, res);
        res.status(200).json(workspaces);
    } catch {
    }
};

// Get workspace by id
const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await workspaceManager.getWorkspace(req, res);
        res.status(200).json(workspace);
    } catch {
    }
};

module.exports = {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaces,
    getWorkspaceById
};