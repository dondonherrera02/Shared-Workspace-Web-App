/**
* @name: Co-Space Web App - User Manager
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const { ValidateEmail, ValidatePhone } = require('../utilities/validator');
const { RoleEnum } = require('../utilities/enum');
const { Op } = require('sequelize');

const createUser = async (req, res) => {
    try {

        const { fullName, phone, email, password, role } = req.body;

        // validate fullname
        if (!fullName) {
            return res.status(400).json({ message: "Name is required." });
        }

        //validate phone
        if (!phone) {
            return res.status(400).json({ message: "Phone is required." });
        }

        if(!ValidatePhone(phone)) {
            return res.status(400).json({ message: "Invalid Phone number" });
        }

        //validate email
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        if(!ValidateEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        // validate password
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        // validate role
        if (!role) {
            return res.status(400).json({ message: "Role is required." });
        }

        if (!RoleEnum.isValidRole(role)) {
            return res.status(400).json({ message: "Invalid role." });
        }

        // Check if the email or phone already exists
        // https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/
        const existingUser = await userRepository.getUserByParam(
            {
                where: {
                    [Op.or]: [
                        { email: email },
                        { phone: phone }
                    ]
                }
            }
        );

        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email
                    ? "Email already exists"
                    : "Phone number already exists"
            });
        }

        // hash the password before storing
        // https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
        const hashedPassword = await bcrypt.hash(password, 10);

        const requestUser = {
            fullName,
            phone,
            email,
            password: hashedPassword,
            role,
            createdDate: new Date().toISOString(), // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
            updatedDate: new Date().toISOString()
        };

        const createdUser = await userRepository.saveUser(requestUser);

        return createdUser;
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, email, password } = req.body;

        if (!id) return res.status(400).json({ message: "User ID is required." });

        // get existing user
        const currentUser = await userRepository.getUserById(id);
        if (!currentUser) return res.status(404).json({ message: "User not found." });

        // Update only provided fields
        if (fullName) currentUser.fullName = fullName;

        if (phone){
            // validate phone
            if(!ValidatePhone(phone)) {
                return res.status(400).json({ message: "Invalid Phone number" });
            }
    
            currentUser.phone = phone;
        }
        if (email){
            // validate email
            if(!ValidateEmail(email)) {
                return res.status(400).json({ message: "Invalid Email" });
            }

            currentUser.email = email;
        }

        // Hash password if provided
        if (password) {
            currentUser.password = await bcrypt.hash(password, 10);
        }

        currentUser.updatedDate = new Date().toISOString();
        const updatedUser = await currentUser.save();
        return updatedUser;

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const { email, phone, role } = req.query;
        
        const filter = {};
        if (email) filter.email = email;
        if (phone) filter.phone = phone;
        if (role) filter.role = role;

        const users = await userRepository.getUsersByParam({
            attributes: ["id", "fullName", "phone", "email", "role", "createdDate", "updatedDate"],
            where: filter
        });

        return res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.getUserById(id, {
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
    getUser
};