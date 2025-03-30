/**
* @name: Co-Space Web App - Property Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { alertifyService } from '../externalservices/alertify.js';
import { routerService } from '../utilities/router.js';
import { propertyRepository } from '../repositories/property-repository.js';
import { userRepository } from '../repositories/user-repository.js';
import { enumService } from '../utilities/enum.js';
import { propertyHelperService } from '../utilities/property-helper.js';
import { workspaceHelperService } from '../utilities/workspace-helper.js';

$(document).ready(async function () {
    addProperty();
    await propertyFormSubmitHandler();

    // initial load property card
    const currentUser = await userRepository.getCurrentUser();
    await propertyHelperService.displayPropertyCards(currentUser);

    try {
        // populate city and state in selection
        propertyHelperService.getCityState();
    } catch (error) {
        alertifyService.error(error.message);
    }
});

// set-up property form - preparation for save or edit.
function addProperty() {
    $('#addPropertyBtn').on('click', () => propertyHelperService.setUpPropertyForm());
}

// property form submit event handler
async function propertyFormSubmitHandler() {

    $('#saveProperty').on('click', async function (event) {
        event.preventDefault();

        let $propertyForm = $('#propertyForm');

        try {
            // set up the property data to save
            const propertyData = {
                name: $('#pName').val().trim(), // property name
                street: $('#street').val().trim(),
                city: $('#city').val().trim(),
                state: $('#state').val().trim(),
                postalCode: $('#postalCode').val().replace(/\s+/g, ''), // remove spaces
                neighborhood: $('#neighborhood').val().trim(),
                squareFeet: $('#squareFeet').val()
            };

            // Validate only the necessary fields
            propertyHelperService.validatePropertyData(propertyData);

            // Add extra fields after validation
            propertyData.hasParkingGarage = $('#parkingGarage').val() === 'available';
            propertyData.hasTransportation = $('#transportation').val() === 'available';
            propertyData.squareFeet = parseInt($('#squareFeet').val(), 10) || 0

            if ($propertyForm.data("property-id")) {
                // update property
                await propertyRepository.updateProperty($propertyForm.data("property-id"), propertyData);
            } else {
                // save new property
                await propertyRepository.saveProperty(propertyData);
            }

            // dismiss the offcanvas
            $('#addPropertyModal').offcanvas('hide');
            $(propertyForm).trigger("reset"); // reset the form
            $(propertyForm).removeData("property-id"); // remove stored property id value from cache

            // load property cards
            const currentUser = await userRepository.getCurrentUser();
            await propertyHelperService.displayPropertyCards(currentUser);

            // display success message
            alertifyService.success("Property saved successfully!");

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

// get all workspaces and redirected to new page
// this function is globally accessible through window object
window.getPropertyWorkspaces = async function (propertyId, role) {

    // get workspaces by property id
    await workspaceHelperService.displayWorkspaceCards(propertyId);

    const isOwner = role === enumService.workspaceOwner;
    routerService.redirectToWorkspacePage(propertyId, isOwner);
}

// edit property - onclick event
// this function is globally accessible through window object
window.editProperty = async function (propertyId) {
    // get current property
    const propertyData = await propertyRepository.getPropertyById(propertyId);

    if (propertyData) {
        // prepare the property form
        propertyHelperService.setUpPropertyForm(propertyData);
    }
}

// delete property - onclick event
// this function is globally accessible through window object
window.deleteProperty = async function (propertyId) {
    alertifyService.confirm("Are you sure you want to delete this property? Please note that this will also remove all the workspaces connected to it.", async function () {

        try {

            // delete property and assoc workspaces
            await propertyRepository.deleteProperty(propertyId);

            // load property cards
            const currentUser = await userRepository.getCurrentUser();
            await propertyHelperService.displayPropertyCards(currentUser);

            // display message
            alertify.success("Property deleted successfully!");

        } catch (error) {
            alertify.error(error.message);
        }
    });
}
