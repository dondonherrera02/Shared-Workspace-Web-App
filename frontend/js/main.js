/**
* @name: Co-Space Web App - Main JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    toggleSwitchAuthForm();
});

// Toggle the switch behavior in the Auth form by adding and removing the CSS class.
function toggleSwitchAuthForm(){
    const $signupForm = $('#signupForm');
    const $loginForm = $('#loginForm');
    const $toggleSwitch = $('#formToggle');
    const $toggleText = $('toggleText');

    $toggleSwitch.on('change', function() {
        if(this.checked){
            $signupForm.removeClass('active-form').addClass('d-none');
            $loginForm.removeClass('d-none').addClass('active-form');
            $toggleText.text('Need an account?');
        }else{
            $signupForm.removeClass('d-none').addClass('active-form');
            $loginForm.removeClass('active-form').addClass('d-none');
            $toggleText.text('Already have an account?');
        }
    });
}
