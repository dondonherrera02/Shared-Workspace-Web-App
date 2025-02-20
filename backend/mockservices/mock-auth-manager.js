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
                fullname: formatFullName($('#fullname').val().trim()),
                email: $('#email').val().trim(),
                password: $('#password').val().trim(),
                role: $('#role').val().trim()
            };
            
            // validate user input data
            validateUserData(userData);

            // save user
            userRepository.saveUser(userData);

            alertifyService.success(`Welcome to Co-Space, ${userData.fullname}!`);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}



/* Helper functions */

function validateUserData(userData) {

    // full name validation
    if(userData.fullname.length < 5){
        throw new Error('Fullname must be atleast 3 characters long');
    }

    // email validation
    // i got this idea from: https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(userData.email)){
        throw new Error('Invalid email address.');
    }

    // password validation
    // https://www.geeksforgeeks.org/password-validation-form-using-javascript/
    if(userData.password.length < 8){
        throw new Error('Password must be at least 8 characters long')
    }

    const upperCasePattern = /[A-Z]/g;
    if(!userData.password.match(upperCasePattern)) {
        throw new Error('Password must be atleast one uppecase letter')
    }

    const lowerCasePattern = /[a-z]/g;
    if(!userData.password.match(lowerCasePattern)) {
        throw new Error('Password must be atleast one lowercase letter')
    }

    const numbersPattern = /[0-9]/g;
    if(!userData.password.match(numbersPattern)) {
        throw new Error('Password must be atleast one number')
    }

    // role validation
    // https://www.w3schools.com/Jsref/jsref_includes.asp
    if(!['co-worker', 'workspace-owner'].includes(userData.role)) {
        throw new Error('Invalid role')
    }
}

function formatFullName(string) {
    return string
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
        .join(''); // Join the words back together without spaces
}
