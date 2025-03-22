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

// USER Routes
routerUtilService.post('/user', userController.createUser); // create user
routerUtilService.put('/user/:id', userController.updateUser); // update user
routerUtilService.get('/user', userController.getUsers); // get users
routerUtilService.get('/user/:id', userController.getUserById); // get user by id


module.exports = routerUtilService;