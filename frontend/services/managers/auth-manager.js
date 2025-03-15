/**
* @name: Co-Space Web App - Auth Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma Program
* @author: Dondon Herrera
*/

import { alertifyService } from '../externalservices/alertify.js';
import { databaseHelperService } from '../utilities/database-helper.js';
import { enumService } from '../utilities/enum.js';
import { routerService } from '../utilities/router.js';
import { commonHelperService } from '../utilities/common-helper.js';
import { userRepository } from '../repositories/user-repository.js';
import { authRepository } from '../repositories/auth-repository.js';

$(document).ready(async function() {
    signUp();
    login();
    logout();
    await checkUserAuthentication();
});

// Functions
function signUp() {
    $("#signupForm").on('submit', async function(event) {
        event.preventDefault(); // Prevents form from submitting

        try {
            // Store user input data
            const userData = {
                fullname: $('#fullname').val().trim(),
                phone: $('#phone').val().trim(),
                email: $('#email').val().trim(),
                password: $('#password').val().trim(),
                role: $('#role').val().trim()
            };

            // Validate user input data
            commonHelperService.validateUserData(userData);

            // Save user
            await userRepository.saveUser(userData);

            // Login after sign up
            await authRepository.login(userData.email, userData.password);

            // Redirect to role-specific page
            routerService.redirectPage(userData);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

function login() {
    $("#loginForm").on('submit', async function(event) {
        event.preventDefault(); // Prevents form from submitting

        try {
            const email = $('#login-email').val().trim();
            const password = $('#login-password').val().trim();

            // Validate inputs
            if (!email || !password) {
                throw new Error('Please fill in all required fields.');
            }

            // Login
            const currentUser = await authRepository.login(email, password);

            // Redirect to role-specific page
            routerService.redirectPage(currentUser);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

function logout() {
    $("#btnLogout").off('click').on('click', async function(event) {
        event.preventDefault();

        await authRepository.logout();
        routerService.redirectIndex();
    });
}

async function checkUserAuthentication(){
    // list all public pages
    const publicPages = ['/', '/index.html']

    // get the current path
    // https://www.w3schools.com/jsref/prop_loc_pathname.asp
    const currentPath = window.location.pathname;

    // get the current user
    const currentUser = await databaseHelperService.getOne(enumService.currentUser);

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
