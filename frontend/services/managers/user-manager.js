/**
* @name: Co-Space Web App - Mock User Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { alertifyService } from '../externalservices/alertify.js';
import { databaseHelperService } from '../utilities/database-helper.js';
import { enumService } from '../utilities/enum.js';
import { commonHelperService } from '../utilities/common-helper.js';
import { userRepository } from '../repositories/user-repository.js';

$(document).ready(function() {
    getProfile();
    commonHelperService.getEditProfileModal();
});

// Functions
function getProfile(){
    const currentUser = databaseHelperService.getOne(enumService.currentUser);
    const formattedName = commonHelperService.formatTitle(currentUser.fullname);
    const formattedRole = currentUser.role === enumService.coWorker ? enumService.coSpaceWorker: enumService.coSpaceOwner;

    $('#profile-usertitle-name').text(formattedName);
    $('#profile-usertitle-position').text(formattedRole);
}

async function editProfile(){
    // get current user
    const currentUser = databaseHelperService.getOne(enumService.currentUser);

    // get profile form
    let $profileForm = $('#profileForm');

    // set-up edit profile form
    $profileForm.data("id", currentUser.id); // store current id as data attribute
    $('#role').val(currentUser.role);
    $('#fullname').val(currentUser.fullname);
    $('#phone').val(currentUser.phone);
    $('#email').val(currentUser.email);
    $('#password').val(currentUser.password);
}

async function saveProfile() {
    let $profileForm = $('#profileForm');

    const profileData = {
        role: $('#role').val(),
        fullname: $('#fullname').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        password: $('#password').val()
    };

    // Validate profile input data
    commonHelperService.validateUserData(profileData);

    if (!$profileForm.data("id")) {
        alertifyService.error("Unable to update profile!");
        return;
    }

    // Update profile
    await userRepository.updateUser($profileForm.data("id"), profileData);

     // Update the UI dynamically
     $('#profile-usertitle-name').text(profileData.fullname);

    // Dismiss the modal
    $('#editProfileModal').modal('hide');
    $profileForm.trigger("reset"); // Reset form
    $profileForm.removeData("id"); // Remove stored ID

    // Show success message
    alertifyService.success("Profile saved successfully!");
}
