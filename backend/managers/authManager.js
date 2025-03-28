/**
* @name: Co-Space Web App - Auth Manager
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const userRepository = require('../repositories/userRepository');
const { VerifyPassword, GenerateToken } = require('../utilities/commonHelper');

// Login user
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Check if email already exists
        const existingUser = await userRepository.getUserByParam({
            where: { email: email }
        });

        if (!existingUser) {
            const message = "Invalid email."
            return res.status(400).json({ message });
        }

        // Check if password is valid
        const isPasswordValid = VerifyPassword(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generates token
        const token = GenerateToken(existingUser);
        return { 
            token, 
            userId: existingUser.id,
            userRole: existingUser.role
         };

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Logout - clear cookie
const logout =  (req, res) => {
    // https://www.geeksforgeeks.org/express-js-res-clearcookie-function/
    res.clearCookie('currentUser'); // frontend set 'currentUser' name in local storage.
};

module.exports = {
    login, 
    logout
};