/**
* @name: Co-Space Web App - Property Repository
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://sequelize.org/docs/v7/category/querying/

const propertyModel = require('../models/propertyModel'); // Import the Property model

const saveProperty = async (property) => {
    return await propertyModel.create(property);
}

const deleteProperty = async (property) => {
    await propertyModel.destroy(property);
}

const deletePropertyByParams = async (query) => {
    await propertyModel.destroy({where: query});
}

const getPropertyByParam = async (query) => {
    return await propertyModel.findOne(query);
}

const getPropertyById = async (id, query) => {
    return await propertyModel.findByPk(id, query);
}

const getPropertiesByParam = async (query) => {
    return await propertyModel.findAll(query);
}

module.exports = {
    saveProperty,
    getPropertyByParam,
    getPropertyById,
    getPropertiesByParam,
    deleteProperty,
    deletePropertyByParams
};