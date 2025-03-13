/**
* @name: Co-Space Web App - Main JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    toggleSwitchAuthForm();
    $('#formToggle').trigger('change'); // Manually triggers the change event on the toggle switch (#formToggle) when the page loads.
});

function toggleSwitchAuthForm() {
    const $signupForm = $('#signupForm');
    const $loginForm = $('#loginForm');
    const $toggleSwitch = $('#formToggle');
    const $toggleText = $('#toggleText');

    $toggleSwitch.on('change', function() {
        if (this.checked) {
            $signupForm.removeClass('active-form').addClass('d-none');
            $loginForm.removeClass('d-none').addClass('active-form');
            $toggleText.text('Need an account?');
        } else {
            $signupForm.removeClass('d-none').addClass('active-form');
            $loginForm.removeClass('active-form').addClass('d-none');
            $toggleText.text('Already have an account?');
        }
    });
}

