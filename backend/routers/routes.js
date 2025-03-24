/**
* @name: Co-Space Web App - Router JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://expressjs.com/en/guide/routing.html

const express = require('express');
const routerUtilService = express.Router();

// namespaces - controllers
const userController = require('../controllers/userController');
const propertyController = require('../controllers/propertyController');
const workspaceController = require('../controllers/workspaceController');

// USER Routes
routerUtilService.post('/user', userController.createUser); // create user
routerUtilService.put('/user/:id', userController.updateUser); // update user
routerUtilService.get('/user', userController.getUsers); // get users
routerUtilService.get('/user/:id', userController.getUserById); // get user by id

// PROPERTY Routes
routerUtilService.post('/property', propertyController.createProperty); // create property
routerUtilService.put('/property/:id', propertyController.updateProperty); // update property
routerUtilService.delete('/property/:id', propertyController.deleteProperty); // delete property
routerUtilService.get('/property', propertyController.getProperties); // get properties
routerUtilService.get('/property/:id', propertyController.getPropertyById); // get property by id

// WORKSPACE Routes
routerUtilService.post('/workspace/:propertyId', workspaceController.createWorkspace); // create workspace
routerUtilService.put('/workspace/:id', workspaceController.updateWorkspace); // update workspace
routerUtilService.delete('/workspace/:id', workspaceController.deleteWorkspace); // delete workspace
routerUtilService.get('/workspace', workspaceController.getWorkspaces); // get workspaces
routerUtilService.get('/workspace/:id', workspaceController.getWorkspaceById); // get workspace by id

module.exports = routerUtilService;