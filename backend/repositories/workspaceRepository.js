/**
* @name: Co-Space Web App - Workspace Repository
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const { MakeCaseInsensitiveFilters } = require('../utilities/commonHelper');
const workspaceModel = require('../models/workspaceModel'); // Import the Workspace model
const userModel = require('../models/userModel');
const propertyModel = require('../models/propertyModel');


// Ref: https://sequelize.org/docs/v7/category/querying/
const saveWorkspace = async (workspace) => {
    return await workspaceModel.create(workspace);
}

const deleteWorkspace = async (workspace) => {
    await workspaceModel.destroy(workspace);
}

const getWorkspaceByParam = async (query) => {
    return await workspaceModel.findOne(query);
}

// https://sequelize.org/docs/v6/core-concepts/assocs/
workspaceModel.belongsTo(userModel, { foreignKey: 'ownerId' });
userModel.hasMany(workspaceModel, { foreignKey: 'ownerId' });

workspaceModel.belongsTo(propertyModel, { foreignKey: 'propertyId' });
propertyModel.hasMany(workspaceModel, { foreignKey: 'propertyId' });

const getWorkspaceById = async (id) => {
    return await workspaceModel.findByPk(id, {
        // https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
        include: [
            {
                model: userModel,
                as: 'User'
            },
            {
                model: propertyModel,
                as: 'Property'
            },
        ],
    });
}

const getWorkspacesByParam = async ({ workspaceFilters, propertyFilters }) => {
    return await workspaceModel.findAll({
        where: MakeCaseInsensitiveFilters(workspaceFilters),
        // https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
        include: [
            {
                model: propertyModel,
                as: 'Property',
                where: MakeCaseInsensitiveFilters(propertyFilters),
                required: true, // workspaces with matching properties will be returned
                attributes: ["id", "name", "street", "city", "state", "postalCode", "neighborhood", "squareFeet", "hasParkingGarage", "hasTransportation"],
            },
        ],
    });
};


module.exports = {
    saveWorkspace,
    getWorkspaceByParam,
    getWorkspaceById,
    getWorkspacesByParam,
    deleteWorkspace
};