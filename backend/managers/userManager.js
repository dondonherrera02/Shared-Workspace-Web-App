/**
* @name: Co-Space Web App - User Manager
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const userRepository = require('../repositories/userRepository');
const { ValidateEmail, ValidatePhone, ValidateRequiredField } = require('../utilities/validator');
const { HashPassword } = require('../utilities/commonHelper');
const { RoleEnum } = require('../utilities/enum');
const { Op } = require('sequelize');

const createUser = async (req, res) => {
    try {
        const { fullName, phone, email, password, role } = req.body;

        // Array of fields to validate
        const validations = [
            { field: fullName, name: "Name" },
            { field: phone, name: "Phone" },
            { field: email, name: "Email" },
            { field: password, name: "Password" },
            { field: role, name: "Role" }
        ];

        // Check if required fields are present
        for (const { field, name } of validations) {
            const validationError = ValidateRequiredField(field, name);
            if (validationError) return res.status(400).json(validationError);
        }

        // Validate phone number and email format
        if (!ValidatePhone(phone)) {
            return res.status(400).json({ message: "Invalid Phone number" });
        }

        if (!ValidateEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        // Validate role
        if (!RoleEnum.isValidRole(role)) {
            return res.status(400).json({ message: "Invalid role." });
        }

        // Check if the email or phone already exists
        const existingUser = await userRepository.getUserByParam({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });

        if (existingUser) {
            const message = existingUser.email === email
                ? "Email already exists"
                : "Phone number already exists";
            return res.status(400).json({ message });
        }

        // Hash the password before storing
        const hashedPassword = await HashPassword(password);

        // Prepare the new user object
        const requestUser = {
            fullName,
            phone,
            email,
            password: hashedPassword,
            role,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
        };

        // Save the new user
        const createdUser = await userRepository.saveUser(requestUser);

        return res.status(201).json({
            message: 'User created successfully',
            user: createdUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, email, password } = req.body;

        if (!id) return res.status(400).json({ message: "User ID is required." });

        // get existing user
        const currentUser = await userRepository.getUserById(id);
        if (!currentUser) return res.status(404).json({ message: "User not found." });

         // check if this user is allowed to update this user
         const currentUserId = req.user?.id // this is from middleware
         if(currentUserId !== currentUser.ownerId) return res.status(401).json({ message: "Unauthorized to update this profile." });

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
            currentUser.password = HashPassword(password);
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