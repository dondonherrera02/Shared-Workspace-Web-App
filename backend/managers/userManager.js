/**
* @name: Co-Space Web App - User Manager
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const userRepository = require('../repositories/userRepository');
const { ValidateEmail, ValidatePhone } = require('../utilities/validator');
const { RoleEnum } = require('../utilities/enum');
const bcrypt = require('bcrypt');
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
        const existingUser = await userRepository.getUser(
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

module.exports = {
    createUser
};