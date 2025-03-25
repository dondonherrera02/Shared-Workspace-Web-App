/**
* @name: Co-Space Web App - User Repository
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://sequelize.org/docs/v7/category/querying/

const userModel = require('../models/userModel'); // Import the User model

const saveUser = async (user) => {
    return await userModel.create(user);
}

const getUserByParam = async (query) => {
    return await userModel.findOne(query);
}

const getUserById = async (id, query) => {
    return await userModel.findByPk(id, query);
}

const getUsersByParam = async (query) => {
    return await userModel.findAll(query);
}

module.exports = {
    saveUser,
    getUserByParam,
    getUserById,
    getUsersByParam
};