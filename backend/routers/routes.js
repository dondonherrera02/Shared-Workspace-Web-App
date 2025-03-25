/**
* @name: Co-Space Web App - Router JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://expressjs.com/en/guide/routing.html

const express = require('express');
const routerUtilService = express.Router();

// NAMESPACE - controllers
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const propertyController = require('../controllers/propertyController');
const workspaceController = require('../controllers/workspaceController');

// MIDDLEWAREs
const { authenticateUser, isOwnerRole } = require('../utilities/middleware/authentication');

// AUTH Routes
routerUtilService.post('/login', authController.login); // login user
routerUtilService.post('/logout', authController.logout); // logout user

// USER Routes
routerUtilService.post('/user', userController.createUser); // create user
routerUtilService.put('/user/:id', authenticateUser, userController.updateUser); // update user
routerUtilService.get('/user', authenticateUser, userController.getUsers); // get users
routerUtilService.get('/user/:id', authenticateUser, userController.getUserById); // get user by id

// PROPERTY Routes
routerUtilService.post('/property', authenticateUser, isOwnerRole, propertyController.createProperty); // create property
routerUtilService.put('/property/:id', authenticateUser, isOwnerRole, propertyController.updateProperty); // update property
routerUtilService.delete('/property/:id', authenticateUser, isOwnerRole, propertyController.deleteProperty); // delete property
routerUtilService.get('/property', authenticateUser, propertyController.getProperties); // get properties
routerUtilService.get('/property/:id', authenticateUser, propertyController.getPropertyById); // get property by id

// WORKSPACE Routes
routerUtilService.post('/workspace/:propertyId', authenticateUser, isOwnerRole, workspaceController.createWorkspace); // create workspace
routerUtilService.put('/workspace/:id', authenticateUser, isOwnerRole, workspaceController.updateWorkspace); // update workspace
routerUtilService.delete('/workspace/:id', authenticateUser, isOwnerRole, workspaceController.deleteWorkspace); // delete workspace
routerUtilService.get('/workspace', authenticateUser, workspaceController.getWorkspaces); // get workspaces
routerUtilService.get('/workspace/:id', authenticateUser, workspaceController.getWorkspaceById); // get workspace by id

module.exports = routerUtilService;