/**
* @name: Co-Space Web App - Mock User Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    getProfile();
});

// Functions
function getProfile(){
    const currentUser = databaseHelperService.getOne(enumService.currentUser);
    const formattedName = commonHelperService.formatTitle(currentUser.fullname);
    const formattedRole = currentUser.role === enumService.coWorkerRole ? enumService.coSpaceWorker: enumService.coSpaceOwner;

    $('#profile-usertitle-name').text(formattedName);
    $('#profile-usertitle-position').text(formattedRole);
}