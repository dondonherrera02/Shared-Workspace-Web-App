/**
* @name: Co-Space Web App - Workspace Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { alertifyService } from '../externalservices/alertify.js';
import { routerService } from '../utilities/router.js';
import { commonHelperService } from '../utilities/common-helper.js';
import { userRepository } from '../repositories/user-repository.js';
import { propertyRepository } from '../repositories/property-repository.js';
import { workspaceRepository } from '../repositories/workspace-repository.js';

$(document).ready(function () {

    workspaceFormSubmitHandler();
    loadWorkspaceCards();
    workspaceSearchHandler();
});

// set-up workspace form - preparation for save or edit.
function addWorkspace(propertyId) {
    commonHelperService.setUpWorkspaceForm(propertyId, null);
}

function loadWorkspaceCards(){
     // initial load workspace cards
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const urlParams = new URLSearchParams(window.location.search); // get the url params
    const propertyId = urlParams.get('propertyId');

    // If propertyId exists, filter workspaces by it
    if (propertyId) {
        commonHelperService.displayWorkspaceCards(propertyId);
    } else {
        commonHelperService.displayWorkspaceCards();
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
                roomNum: $('#roomNum').val(),
                type: $('#type').val(),
                capacity: $('#capacity').val(),
                leaseTerm: $('#leaseTerm').val(),
                availabilityDate: $('#availabilityDate').val(),
                smokingPolicy: $('#smokingPolicy').val(),
                price: $('#price').val()
            };

            // validate the input workspace data
            commonHelperService.validateWorkspaceData(workspaceData);

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
                routerService.redirectToOwnerWorkspacePage(workspaceData.propertyId);
            }, 1000);

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

// edit workspace - onclick event
async function editWorkspace(workspaceId) {
    try {
        const workspaceData = await workspaceRepository.getWorkspaceById(workspaceId);
        commonHelperService.setUpWorkspaceForm(workspaceData.propertyId, workspaceData);
    } catch (error) {
        alertifyService.error(error.message);
    }
}

// delete property - onclick event
async function deleteWorkspace(workspaceId) {
    alertifyService.confirm("Are you sure you want to delete this workspace?", function() {
        
        try {

            // delete the workspace
            const workspace = workspaceRepository.deleteWorkspace(workspaceId);

            setTimeout(() => {
                routerService.redirectToOwnerWorkspacePage(workspace.propertyId);
            }, 1000);

             // display message
            alertify.success("Workspace deleted successfully!");

        } catch (error) {
            alertify.error(error.message);
        }
    });
}

// view workspace - onclick event
async function viewWorkspace(workspaceId) {
    try {
        const workspaceData = await workspaceRepository.getWorkspaceById(workspaceId);
        const propertyData = await propertyRepository.getPropertyById(workspaceData.propertyId);
        commonHelperService.setUpWorkspaceView(propertyData, workspaceData);
    } catch (error) {
        alertifyService.error(error.message);
    }
}

// view contact - onclick event
async function viewContact(workspaceId) {
    try {
        const workspaceData = await workspaceRepository.getWorkspaceById(workspaceId);
        const userData = await userRepository.getUserInfo(workspaceData.ownerId);
        const propertyData = await propertyRepository.getPropertyById(workspaceData.propertyId);
        commonHelperService.setUpContactView(propertyData, userData, workspaceData);
    } catch (error) {
        alertifyService.error(error.message);
    }
}

// search workspace handler
async function workspaceSearchHandler(){
    $('#searchWorkspaceNow').on('click', async function(event) {
        event.preventDefault();

        const searchWorkspaceRequest = {
            city: $('#citySearch').val(),
            state: $('#stateSearch').val(),
            postalCode: $('#postalCodeSearch').val(),
            neighborhood: $('#neighborhoodSearch').val(),
            parkingGarage: $('#parkingSearch').val(),
            squareFeet: $('#squareFeetSearch').val(),
            transportation: $('#transportationSearch').val(),
            availabilityDate: $('#availabilityDateSearch').val(),
            capacity: $('#capacitySearch').val(),
            leaseTerm: $('#leaseTermSearch').val(),
            price: $('#minPriceSearch').val(),
            smokingPolicy: $('#smokingPolicySearch').val()
        };

        // remove empty values
        Object.keys(searchWorkspaceRequest).forEach(key => {
            // check if the value of the key in searchWorkspaceRequest is falsy (e.g., undefined, null, 0, "") 
            // and not explicitly false, then delete the key from the object
            if (!searchWorkspaceRequest[key] && searchWorkspaceRequest[key] !== false) {
                delete searchWorkspaceRequest[key];
            }
        });

        const $workspaceList = $('#workspaceList'); // get the workspace list
        $workspaceList.empty(); // reset the list
        $('#searchWorkspaceModal').modal('hide'); // hide the modal
        $(searchWorkspaceForm).trigger("reset"); // reset the form

        // search workspace by request
        const results = await workspaceRepository.searchWorkspaces(searchWorkspaceRequest);

        // display message when no ws found
        if (results.length === 0) {
            $workspaceList.append('<p>No workspaces found matching your search request.</p>');
            return;
        }

        // append workspace cards
        results.forEach((workspace) => {
            // get property linked to ws
            const workspaceProperty = propertyRepository.getPropertyById(workspace.propertyId);

            // call the helper to create worker workspace card
            let eachWorkspace = commonHelperService.createWorkerWorkspaceCard(workspace, workspaceProperty);

            // append to dynamic list
            $workspaceList.append(eachWorkspace);
        });
      
    });
}