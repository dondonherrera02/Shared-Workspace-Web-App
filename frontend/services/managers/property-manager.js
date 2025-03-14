/**
* @name: Co-Space Web App - Property Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { alertifyService } from '../externalservices/alertify.js';
import { routerService } from '../utilities/router.js';
import { commonHelperService } from '../utilities/common-helper.js';
import { propertyRepository } from '../repositories/property-repository.js';


$(document).ready(async function() {
    addProperty();
    await propertyFormSubmitHandler();

    // initial load property cards
    await commonHelperService.displayPropertyCards();

    try {
        // populate city and state in selection
        commonHelperService.getCityState();
    } catch (error) {
        alertifyService.error(error.message);
    }
});

// set-up property form - preparation for save or edit.
function addProperty(){
   $('#addPropertyBtn').on('click', () => commonHelperService.setUpPropertyForm());
}

// get all workspaces and redirected to new page
async function getPropertyWorkspaces(propertyId){
    await commonHelperService.displayWorkspaceCards(propertyId);
    routerService.redirectToOwnerWorkspacePage(propertyId);
 }

// property form submit event handler
async function propertyFormSubmitHandler() {
    
    $('#saveProperty').on('click', async function(event) {
        event.preventDefault();

        let $propertyForm = $('#propertyForm');

        try {
            // set up the property data to save
            const propertyData = {
                pName:  $('#pName').val(),
                street: $('#street').val(),
                city: $('#city').val(),
                state: $('#state').val(),
                postalCode: $('#postalCode').val().replace(/\s+/g, ''), // remove spaces
                neighborhood: $('#neighborhood').val(),
                squareFeet: $('#squareFeet').val(),
                parkingGarage: $('#parkingGarage').val(),
                transportation: $('#transportation').val()
            };

            // validate the input property data
            commonHelperService.validatePropertyData(propertyData);

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
             await commonHelperService.displayPropertyCards();

             // display success message
             alertifyService.success("Property saved successfully!");

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

// edit property - onclick event
async function editProperty(propertyId) {
    // get current property
    const propertyData = await propertyRepository.getPropertyById(propertyId);

    if (propertyData) {
        // prepare the property form
        commonHelperService.setUpPropertyForm(propertyData);
    }
}

// delete property - onclick event
async function deleteProperty(propertyId) {
    alertifyService.confirm("Are you sure you want to delete this property? Please note that this will also remove all the workspaces connected to it.", async function() {
        
        try {

            // delete property and assoc workspaces
            await propertyRepository.deleteProperty(propertyId);

             // load property cards
             await commonHelperService.displayPropertyCards();

             // display message
            alertify.success("Property deleted successfully!");

        } catch (error) {
            alertify.error(error.message);
        }
    });
}