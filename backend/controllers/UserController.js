/**
* @name: Co-Space Web App - User Controller
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const User = require('../models/UserModel'); // Import the User model
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

// COMMAND - POST, PUT, DELETE

// Create a new user
const createUser = async (req, res) => {
    try {
        const { FullName, Phone, Email, Password, Role } = req.body;

        if (!FullName || !Phone || !Email || !Password || !Role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the email or phone already exists
        const existingUser = await User.findOne({
            where: Sequelize.or(
                { Email: Email }, // check if the email exists
                { Phone: Phone } // check if the phone exists
            ),
        });

        if (existingUser) {
            if (existingUser.Email === Email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (existingUser.Phone === Phone) {
                return res.status(400).json({ message: "Phone number already exists" });
            }
        }
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new user
        const user = await User.create({
            FullName,
            Phone,
            Email,
            Password: hashedPassword,
            Role,
            CreatedDate: new Date().toISOString(),
            UpdatedDate: new Date().toISOString()
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                Id: user.Id,
                FullName: user.FullName,
                Phone: user.Phone,
                Email: user.Email,
                Role: user.Role,
                CreatedDate: user.CreatedDate,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { FullName, Phone, Email, Password, Role } = req.body;

        // get existing user
        const currentUser = await User.findByPk(id);
        if(!currentUser)  return res.status(404).json({ message: "Unknown user" });

        if (!FullName || !Phone || !Email || !Password || !Role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // update each properties
        if(FullName) currentUser.FullName = FullName;
        if(Phone) currentUser.Phone = Phone;
        if(Email) currentUser.Email = Email;
        if(Role) currentUser.Role = Role;
        if(Password) {
             // Hash the password before storing
            const hashedPassword = await bcrypt.hash(Password, 10);
            currentUser.Password = hashedPassword;
        }
        currentUser.UpdatedDate = new Date().toISOString()
        await currentUser.save();

        res.status(201).json({
            message: 'User updated successfully',
            user: {
                Id: currentUser.Id,
                FullName: currentUser.FullName,
                Phone: currentUser.Phone,
                Email: currentUser.Email,
                Role: currentUser.Role,
                UpdatedDate: currentUser.UpdatedDate,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// QUERY - GET

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["Id", "FullName", "Phone", "Email", "Role", "CreatedDate", "UpdatedDate"]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ["Id", "FullName", "Phone", "Email", "Role", "CreatedDate", "UpdatedDate"]
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