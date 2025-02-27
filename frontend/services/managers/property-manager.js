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
});

// save property
function addProperty(){
   $('#addPropertyBtn').on('click', () => commonHelperService.setUpPropertyForm());
}

// property form submit event handler
async function propertyFormSubmitHandler() {
    $('#saveProperty').on('click', async function(event) {
        event.preventDefault();

        let $propertyForm = $('#propertyForm');

        try {
            // set up the property data to save
            const propertyData = {
                street: $('#street').val().trim(),
                city: $('#city').val().trim(),
                state: $('#state').val().trim(),
                postalCode: $('#postalCode').val().trim().replace(/\s+/g, ''), // remove spaces
                neighborhood: $('#neighborhood').val().trim(),
                squareFeet: $('#squareFeet').val().trim(),
                parkingGarage: $('#parkingGarage').val().trim(),
                transportation: $('#transportation').val().trim(),
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