/**
* @name: Co-Space Web App - User Controller
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// References:
// https://lo-victoria.com/build-a-rest-api-with-nodejs-routes-and-controllers
const userManager = require('../managers/userManager');

// COMMAND - POST, PUT

// Create a new user
const createUser = async (req, res) => {
    try {
        const user = await userManager.createUser(req, res);

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                email: user.email,
                role: user.role,
                createdDate: user.createdDate
            }
        });
    } catch {
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {

        const user = await userManager.updateUser(req, res);

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                email: user.email,
                role: user.role,
                updatedDate: user.updatedDate
            }
        });
    } catch {
    }
};

// QUERY - GET

// Get user list
const getUsers = async (req, res) => {
    try {
        const users = await userManager.getUsers(req, res);
        res.status(200).json(users);
    } catch {
    }
};

// Get user by id
const getUserById = async (req, res) => {
    try {
        const user = await userManager.getUser(req, res);
        res.status(200).json(user);
    } catch {
    }
};

module.exports = {
    createUser,
    updateUser,
    getUsers,
    getUserById
};