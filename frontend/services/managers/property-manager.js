/**
* @name: Co-Space Web App - Property Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    addProperty();
    propertyFormSubmitHandler();

    // initial load property cards
    commonHelperService.displayPropertyCards();

    try {
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
function getPropertyWorkspaces(propertyId){
    commonHelperService.displayWorkspaceCards(propertyId);
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

            // Dismiss the offcanvas
            $('#addPropertyModal').offcanvas('hide');
            $(propertyForm).trigger("reset"); // reset the form
            $(propertyForm).removeData("property-id"); // remove stored property id value from cache

             // display success message
             alertifyService.success("Property saved successfully!");
            
             // load property cards
             commonHelperService.displayPropertyCards();

        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

// edit property - onclick event
async function editProperty(propertyId) {
    try {
        const propertyData = await propertyRepository.getPropertyById(propertyId);
        commonHelperService.setUpPropertyForm(propertyData);
    } catch (error) {
        alertifyService.error(error.message);
    }
}