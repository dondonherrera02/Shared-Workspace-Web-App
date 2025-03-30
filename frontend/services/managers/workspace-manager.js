/**
* @name: Co-Space Web App - Workspace Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { alertifyService } from '../externalservices/alertify.js';
import { routerService } from '../utilities/router.js';
import { workspaceHelperService } from '../utilities/workspace-helper.js';
import { userRepository } from '../repositories/user-repository.js';
import { propertyRepository } from '../repositories/property-repository.js';
import { workspaceRepository } from '../repositories/workspace-repository.js';

$(document).ready(async function () {

    await workspaceFormSubmitHandler();
    await loadWorkspaceCards();
    await workspaceSearchHandler();
});

// set-up workspace form - preparation for save or edit.
// this function globally accessible through window object
window.addWorkspace = function(propertyId) {
    workspaceHelperService.setUpWorkspaceForm(propertyId, null);
}

async function loadWorkspaceCards(){
     // initial load workspace cards
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const urlParams = new URLSearchParams(window.location.search); // get the url params
    const propertyId = urlParams.get('propertyId');

    // If propertyId exists, filter workspaces by it
    if (propertyId) {
        await workspaceHelperService.displayWorkspaceCards(propertyId);
    } else {
        await workspaceHelperService.displayWorkspaceCards();
    }
}

// workspace form submit event handler
async function workspaceFormSubmitHandler() {
    $('#saveWorkspace').on('click', async function (event) {
        event.preventDefault();

        let $workspaceForm = $('#workspaceForm');

        try {
            // set up the workspace data to save
            const workspaceData = {
                propertyId: $('#propertyId').val(), // this foreign key set up during preparation step, should always have value
                roomNumber: $('#roomNum').val(),
                type: $('#type').val(),
                capacity: $('#capacity').val(),
                leaseTerm: $('#leaseTerm').val(),
                availabilityDate: $('#availabilityDate').val(),
                price: $('#price').val()
            };

            // validate the input workspace data
            workspaceHelperService.validateWorkspaceData(workspaceData);

            workspaceData.isSmokingAllowed = $('#smokingPolicy').val() === 'Allowed';
            workspaceData.price = parseInt($('#price').val(), 10) || 0

            if ($workspaceForm.data("workspace-id")) {
                // update workspace
                await workspaceRepository.updateWorkspace($workspaceForm.data("workspace-id"), workspaceData);
            } else {
                // save new workspace
                await workspaceRepository.saveWorkspace(workspaceData);
            }

            // dismiss the modal
            $('#addWorkspaceModal').modal('hide');
            $(workspaceForm).trigger("reset"); // reset the form
            $(workspaceForm).removeData("workspace-id"); // remove stored workspace id value from cache

            // display success message
            alertifyService.success("Workspace saved successfully!");

            // route to wokspace page and load workspace cards
            setTimeout(() => {
                routerService.redirectToWorkspacePage(workspaceData.propertyId, true);
            }, 1000);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

// edit workspace - onclick event
// this function globally accessible through window object
window.editWorkspace = async function(workspaceId) {
    try {
        const workspaceData = await workspaceRepository.getWorkspaceById(workspaceId);
        workspaceHelperService.setUpWorkspaceForm(workspaceData.propertyId, workspaceData);
    } catch (error) {
        alertifyService.error(error.message);
    }
}

// delete property - onclick event
// this function globally accessible through window object
window.deleteWorkspace = async function(workspaceId) {
    alertifyService.confirm("Are you sure you want to delete this workspace?", async function() {
        
        try {

            // delete the workspace
            const workspace = await workspaceRepository.deleteWorkspace(workspaceId);

            setTimeout(() => {
                routerService.redirectToWorkspacePage(workspace.propertyId, true);
            }, 1000);

             // display message
            alertify.success("Workspace deleted successfully!");

        } catch (error) {
            alertify.error(error.message);
        }
    });
}

// view workspace - onclick event
// this function is globally accessible through window object
window.viewWorkspace = async function(workspaceId) {
    try {
        const workspaceData = await workspaceRepository.getWorkspaceById(workspaceId);
        workspaceHelperService.setUpWorkspaceView(workspaceData);
    } catch (error) {
        alertifyService.error(error.message);
    }
}

// view contact - onclick event
// this function is globally accessible through window object
window.viewContact = async function(workspaceId) {
    try {
        const workspaceData = await workspaceRepository.getWorkspaceById(workspaceId);
        workspaceHelperService.setUpContactView(workspaceData);
    } catch (error) {
        alertifyService.error(error.message);
    }
}

// search workspace handler
async function workspaceSearchHandler(){
    $('#searchWorkspaceNow').on('click', async function(event) {
        event.preventDefault();

        // empty the property list during search
        let $propertyList = $('#propertyList');
        $propertyList.empty();

        const searchWorkspaceRequest = {
            city: $('#citySearch').val(),
            state: $('#stateSearch').val(),
            postalCode: $('#postalCodeSearch').val(),
            neighborhood: $('#neighborhoodSearch').val(),
            hasParkingGarage: $('#parkingSearch').val() === 'available' ? true : false,
            squareFeet: $('#squareFeetSearch').val(),
            hasTransportation: $('#transportationSearch').val() === 'available' ? true : false,
            availabilityDate: $('#availabilityDateSearch').val(),
            capacity: $('#capacitySearch').val(),
            leaseTerm: $('#leaseTermSearch').val(),
            price: $('#minPriceSearch').val(),
            isSmokingAllowed: $('#smokingPolicySearch').val() === 'Allowed' ? true : false
        };

        // remove empty values
        Object.keys(searchWorkspaceRequest).forEach(key => {
            // check if the value of the key in searchWorkspaceRequest is falsy (e.g., undefined, null, 0, "") 
            // and not explicitly false, then delete the key from the object
            if (!searchWorkspaceRequest[key] && searchWorkspaceRequest[key] !== false) {
                delete searchWorkspaceRequest[key];
            }
        });

        $('#searchWorkspaceModal').modal('hide'); // hide the modal
        $(searchWorkspaceForm).trigger("reset"); // reset the form

        // search workspace by request
        const results = await workspaceRepository.searchWorkspaces(searchWorkspaceRequest);

        // display message when no ws found
        if (results.length === 0) {
            $propertyList.append('<p>No workspaces found matching your search request.</p>');
            return;
        }

        // append workspace cards
        for (const workspace of results) {
        
            // call the helper to create worker workspace card
            let eachWorkspace = await workspaceHelperService.createWorkerWorkspaceCard(workspace);
        
            // append to dynamic list
            $propertyList.append(eachWorkspace);
        }
    });
}
