/**
* @name: Co-Space Web App - User Controller
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// References:
// https://lo-victoria.com/build-a-rest-api-with-nodejs-routes-and-controllers
// https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/
// https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/

const userModel = require('../models/userModel'); // Import the User model
const userManager = require('../managers/userManager');
const bcrypt = require('bcrypt');

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
                createdDate: user.createdDate,
            }
        });

    } catch {
        // doesn't contain any logic to handle the error explicitly
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, email, password } = req.body;

        if (!id) return res.status(400).json({ message: "User ID is required." });

        // Get existing user
        const currentUser = await userModel.findByPk(id);
        if (!currentUser) return res.status(404).json({ message: "User not found." });

        // Update only provided fields
        if (fullName) currentUser.fullName = fullName;
        if (phone) currentUser.phone = phone;
        if (email) currentUser.email = email;

        // Hash password if provided
        if (password) {
            currentUser.password = await bcrypt.hash(password, 10);
        }

        currentUser.updatedDate = new Date().toISOString();
        await currentUser.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: currentUser.id,
                fullName: currentUser.fullName,
                phone: currentUser.phone,
                email: currentUser.email,
                role: currentUser.role,
                updatedDate: currentUser.updatedDate,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// QUERY - GET

// Get user list
const getUsers = async (req, res) => {
    try {
        const users = await userModel.findAll({
            attributes: ["id", "fullName", "phone", "email", "role", "createdDate", "updatedDate"]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByPk(id, {
            attributes: ["id", "fullName", "phone", "email", "role", "createdDate", "updatedDate"]
        });
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    createUser,
    updateUser,
    getUsers,
    getUserById
};