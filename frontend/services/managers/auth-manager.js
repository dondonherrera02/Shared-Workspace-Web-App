/**
* @name: Co-Space Web App - Auth Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/
import { alertifyService } from '../externalservices/alertify.js';
import { databaseHelperService } from '../utilities/database-helper.js';
import { enumService } from '../utilities/enum.js';
import { routerService } from '../utilities/router.js';
import { commonHelperService } from '../utilities/common-helper.js';
import { userRepository } from '../repositories/user-repository.js';
import { authRepository } from '../repositories/auth-repository.js';

$(document).ready(function() {
    signUp();
    login();
    logout();
    checkUserAuthentication();
});

// Functions
function signUp(){
    $("#signupForm").on('submit', function(event) {
        event.preventDefault(); // prevents form from submitting

        try {
            
            // store the inputs in an array
            const userData = {
                fullname: $('#fullname').val().trim(),
                phone: $('#phone').val().trim(),
                email: $('#email').val().trim(),
                password: $('#password').val().trim(),
                role: $('#role').val().trim()
            };
            
            // validate user input data
            commonHelperService.validateUserData(userData);

            // save user
            userRepository.saveUser(userData);

            // login after sign up
            authRepository.login(userData.email, userData.password);

            // redirect to page-role
            routerService.redirectPage(userData);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

function login(){
    $("#loginForm").on('submit', function(event) {
        event.preventDefault(); // prevents form from submitting

        try {
            
            const email = $('#login-email').val().trim();
            const password = $('#login-password').val();

            // Validate inputs
            if (!email || !password) {
                throw new Error('Please fill in all required fields');
            }

            // login
            const currentUser = authRepository.login(email, password);

            // redirect to page-role
            routerService.redirectPage(currentUser);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

function logout(){
    const currentUser = databaseHelperService.getOne(enumService.currentUser);

    if(currentUser) {
        $("#btnLogout").on('click', function(event) {
            event.preventDefault();

            authRepository.logout();
            routerService.redirectIndex();
        });
    }
}

function checkUserAuthentication(){
    // list all public pages
    const publicPages = ['/', '/index.html']

    // get the current path
    // https://www.w3schools.com/jsref/prop_loc_pathname.asp
    const currentPath = window.location.pathname;

    // get the current user
    const currentUser = databaseHelperService.getOne(enumService.currentUser);

    // validate if current path includes in the public pages, if not return to index.html
    if(!publicPages.includes(currentPath) && !currentUser) {
        window.location.href = '/index.html'
    }

    // redirect if user tries to direct access via url unauthorized pages
    // if worker tries to change the url to owner url, fallback to worker-dashboard
    if (currentPath.includes('owner-dashboard') && currentUser.role !== enumService.workspaceOwner){
        window.location.href = 'co-worker-dashboard.html';
    }
    // if owner tries to change the url to worker url, fallback to owner-dashboard
    else if (currentPath.includes('co-worker-dashboard') && currentUser.role !== enumService.coWorker){
        window.location.href = 'owner-dashboard.html';
    }
}