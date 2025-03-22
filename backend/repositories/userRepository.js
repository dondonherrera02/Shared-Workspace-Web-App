/**
* @name: Co-Space Web App - User Repository
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const userModel = require('../models/userModel'); // Import the User model

const saveUser = async (user) => {
    await userModel.create(user);
}

const getUser = async (query) => {
    return await userModel.findOne(query);
}

module.exports = {
    saveUser,
    getUser
};