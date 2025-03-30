/**
* @name: Co-Space Web App - Auth Controller
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const authManager = require('../managers/authManager');
const user = require('../models/userModel');

const login = async (req, res) => {
    try {
        const userCredentials = await authManager.login(req, res);

        res.status(200).json({
            message: 'User login successfully',
            userId: userCredentials.userId,
            userRole: userCredentials.userRole,
            user: userCredentials.token
        });
    } catch {
    }
};

const logout = async (req, res) => {
    try {

        authManager.logout(req, res);

        res.status(200).json({
            message: 'User logout successfully',
        });
    } catch {
    }
};

module.exports = {
    login,
    logout
};