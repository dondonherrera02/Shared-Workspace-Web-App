/**
* @name: Co-Space Web App - Mock Auth Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    signUp();
    login();
});

// Functions
function signUp(){
    $("#signupForm").on('submit', function(event) {
        event.preventDefault(); // prevents form from submitting

        try {
            
            // store the inputs in an array
            const userData = {
                fullname: helperUtilService.formatFullName($('#fullname').val().trim()),
                email: $('#email').val().trim(),
                password: $('#password').val().trim(),
                role: $('#role').val().trim()
            };
            
            // validate user input data
            helperUtilService.validateUserData(userData);

            // save user
            userRepository.saveUser(userData);

            // login after sign up
            authRepository.login(userData.email, userData.password);

            // redirect to page-role
            helperUtilService.redirectPage(userData.role);

            alertifyService.success(`Welcome to Co-Space, ${userData.fullname}!`);

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
            helperUtilService.redirectPage(currentUser.role);

            // success message
            alertifyService.success(`Welcome back to Co-Space, ${currentUser.fullname}!`);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}