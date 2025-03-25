/**
* @name: Co-Space Web App - Authenticate User
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Middleware - set of tools or helpers that helps in managing the process when your web server gets a request and sends a response.
// Middleware acts like a security checkpoint for incoming requests.
/**
 *  When a request hits your server, it goes through the middleware stack in sequence
 * processing each request during the lifecycle of a web server.
 */
// https://www.geeksforgeeks.org/jwt-authentication-with-node-js/
// https://www.geeksforgeeks.org/how-to-build-middleware-for-node-js-a-complete-guide/

const jwt = require('jsonwebtoken');
const { RoleEnum } = require('../enum');
require('dotenv').config(); // set up global configuration access - .env file
const JWT_SECRET = process.env.JWT_SECRET;

// This middleware is responsible for protecting routes and allowing access only to verified users.
const authenticateUser = (req, res, next) => { // req - request from client, res- response sends back to client, next - tell server to move on to the next task.
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized user.' });
    }

    try {
        const requestorInfoDecoded = jwt.verify(token, JWT_SECRET); // Verify token
        req.user = requestorInfoDecoded; // attach user info to req.user
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
}

// This middleware protects the routes, ensuring they are accessed only by users with a specific role.
const isOwnerRole = (req, res, next) => {
    const currentUser = req.user; // attached user info from req.user

    if(currentUser.role !== RoleEnum.OWNER){
        return res.status(403).json({ message: 'Unauthorized user: Invalid role.' });
    }
    next();
}

// apply this middleware to routes: https://www.geeksforgeeks.org/explain-the-concept-of-middleware-in-nodejs/
module.exports = {
    authenticateUser,
    isOwnerRole
}; 