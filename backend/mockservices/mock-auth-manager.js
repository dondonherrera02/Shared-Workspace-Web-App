/**
* @name: Co-Space Web App - Mock Auth Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    signUp();
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

            // redirect to dashboard by setting the windows location.
            if (userData.role ==='workspace-owner') {
                window.location.href = 'pages/owner-dashboard.html'
            }else{
                 window.location.href = 'pages/notfound.html'
            }

            alertifyService.success(`Welcome to Co-Space, ${userData.fullname}!`);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}