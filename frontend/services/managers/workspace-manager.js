/**
* @name: Co-Space Web App - Workspace Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function () {

    workspaceFormSubmitHandler();
    loadWorkspaceCards();
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

// property form submit event handler
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

            // Dismiss the modal
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