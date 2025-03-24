/**
* @name: Co-Space Web App - Workspace Repository
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://sequelize.org/docs/v7/category/querying/

const workspaceModel = require('../models/workspaceModel'); // Import the Workspace model
const userModel = require('../models/userModel');
const propertyModel = require('../models/propertyModel');

workspaceModel.belongsTo(userModel, { foreignKey: 'ownerId' });
userModel.hasMany(workspaceModel, { foreignKey: 'ownerId' });

workspaceModel.belongsTo(propertyModel, { foreignKey: 'propertyId' });
propertyModel.hasMany(workspaceModel, { foreignKey: 'propertyId' });

const saveWorkspace = async (workspace) => {
    return await workspaceModel.create(workspace);
}

const deleteWorkspace = async (workspace) => {
    await workspaceModel.destroy(workspace);
}

const getWorkspaceByParam = async (query) => {
    return await workspaceModel.findOne(query);
}

const getWorkspaceById = async (id) => {
    return await workspaceModel.findByPk(id, {
        include: [
            {
                model: userModel
            },
            {
                model: propertyModel
            },
        ],
    });
}

const getWorkspacesByParam = async (query) => {
    return await workspaceModel.findAll(query);
}

module.exports = {
    saveWorkspace,
    getWorkspaceByParam,
    getWorkspaceById,
    getWorkspacesByParam,
    deleteWorkspace
};