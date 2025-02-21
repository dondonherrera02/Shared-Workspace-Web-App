/**
* @name: Co-Space Web App - Auth Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    signUp();
    login();
    logout();
});

// Functions
function signUp(){
    $("#signupForm").on('submit', function(event) {
        event.preventDefault(); // prevents form from submitting

        try {
            
            // store the inputs in an array
            const userData = {
                fullname: $('#fullname').val().trim(),
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
    const currentUser = databaseHelperService.getOne(enumService.currentUserObjectName);

    if(currentUser) {
        $("#btnLogout").on('click', function(event) {
            event.preventDefault();

            authRepository.logout();
            routerService.redirectIndex();
        });
    }
}