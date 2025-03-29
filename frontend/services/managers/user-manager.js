/**
* @name: Co-Space Web App - Mock User Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { alertifyService } from '../externalservices/alertify.js';
import { enumService } from '../utilities/enum.js';
import { commonHelperService } from '../utilities/common-helper.js';
import { userHelperService } from '../utilities/user-helper.js';
import { userRepository } from '../repositories/user-repository.js';

$(document).ready(async function() {
    await getProfile();
    userHelperService.getEditProfileModal();
});

// Functions
async function getProfile(){
    const currentUser = await userRepository.getCurrentUser();
    const userInfo = await userRepository.getUserById(currentUser.id);

    const formattedName = commonHelperService.formatTitle(userInfo.fullName);
    const formattedRole = userInfo.role === enumService.coWorker ? enumService.coSpaceWorker: enumService.coSpaceOwner;

    $('#profile-usertitle-name').text(formattedName);
    $('#profile-usertitle-position').text(formattedRole);
}

// edit profile - onclick event
// this function is globally accessible through window object
window.editProfile = async function(){
    // get current user
    const currentUser = await userRepository.getCurrentUser();

    // get profile form
    let $profileForm = $('#profileForm');

    // set-up edit profile form
    $profileForm.data("id", currentUser.id); // store current id as data attribute
    $('#role').val(currentUser.role);
    $('#fullname').val(currentUser.fullName);
    $('#phone').val(currentUser.phone);
    $('#email').val(currentUser.email);
    $('#password').val(currentUser.password);
}

// save profile - onclick event
// this function is globally accessible through window object
window.saveProfile = async function() {
    let $profileForm = $('#profileForm');

    const profileData = {
        role: $('#role').val(),
        fullName: $('#fullname').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        password: $('#password').val()
    };

    // Validate profile input data
    userHelperService.validateUserData(profileData);

    if (!$profileForm.data("id")) {
        alertifyService.error("Unable to update profile!");
        return;
    }

    // Update profile
    await userRepository.updateUser($profileForm.data("id"), profileData);

     // Update the UI dynamically
     $('#profile-usertitle-name').text(profileData.fullName);

    // Dismiss the modal
    $('#editProfileModal').modal('hide');
    $profileForm.trigger("reset"); // Reset form
    $profileForm.removeData("id"); // Remove stored ID

    // Show success message
    alertifyService.success("Profile saved successfully!");
}
