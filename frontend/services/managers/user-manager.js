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
    const currentUser = databaseHelperService.getOne(enumService.currentUserObjectName);
    const formattedName = commonHelperService.formatTitle(currentUser.fullname);
    const formattedRole = currentUser.role === enumService.coWorkerRole ? 'Co-Space Worker' : 'Co-Space Owner';

    $('#profile-usertitle-name').text(formattedName);
    $('#profile-usertitle-position').text(formattedRole);
}