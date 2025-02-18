/**
* @name: Co-Space Web App - Main JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Landing Page - Sign up and Login Switching
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const toggleSwitch = document.getElementById('formToggle');
const toggleText = document.getElementById('toggleText');

toggleSwitch.addEventListener('change', function() {
    if (this.checked) {
        // hide sign-up form
        signupForm.classList.remove('active-form');
        signupForm.classList.add('d-none');
        // show login form
        loginForm.classList.remove('d-none');
        loginForm.classList.add('active-form');
        toggleText.textContent = 'Need an account?';
    } else {
        // hide login form
        loginForm.classList.remove('active-form');
        loginForm.classList.add('d-none');

        // show sign-up form
        signupForm.classList.remove('d-none');
        signupForm.classList.add('active-form');
        toggleText.textContent = 'Already have an account?';
    }
});
