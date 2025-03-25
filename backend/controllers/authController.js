/**
* @name: Co-Space Web App - Auth Controller
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const authManager = require('../managers/authManager');

const login = async (req, res) => {
    try {
        const token = await authManager.login(req, res);

        res.status(200).json({
            message: 'User login successfully',
            user: token
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