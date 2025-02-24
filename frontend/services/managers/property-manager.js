/**
* @name: Co-Space Web App - Property Manager - Business Logic Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

$(document).ready(function() {
    addProperty();
    propertyFormSubmitHandler();
});

// save property
function addProperty(){
   // Set-up the property form by clearing the property id and reset the form
   $("#addPropertyBtn").on('click', () => commonHelperService.setUpPropertyForm());
};

// property form submit event handler
function propertyFormSubmitHandler() {
    let $propertyForm = $('#propertyForm');

     // applies both create and update property
     $propertyForm.on('submit', async function(event) {
        event.preventDefault();

        try {

            // set up the property data to save
            const propertyData = {
                street:  $('#street').val().trim(),
                city:  $('#city').val().trim(),
                state:  $('#state').val().trim(),
                postalCode: $('#postalCode').val().trim().replace(/\s+/g, ''), //  remove spaces
                neighborhood:  $('#neighborhood').val().trim(),
                squareFeet:  $('#squareFeet').val().trim(),
                parkingGarage:  $('#parkingGarage').val().trim(),
                transportation:  $('#transportation').val().trim(),
            };

            // validate the input property data
            commonHelperService.validatePropertyData(propertyData);

            // if property id is present through set-up property form then call update property function otherwise, save function
            if ($propertyForm.data("property-id") !== undefined && $propertyForm.data("property-id") !== null) {
                // update property
                await propertyRepository.updateProperty($propertyForm.data("property-id"), propertyData);
            }else{
                // save new property in the database
                await propertyRepository.saveProperty(propertyData);
            }

            // display success message
            alertifyService.error("Property saved successfully!");
        } catch (error) {
            alertifyService.error(error.message);
        }
    });
}

// edit property - onclick event
function editProperty(propertyId) {
    
    try {
        // get property by property id
        const propertyData = propertyRepository.getPropertyById(propertyId);

        // set up edit property form
        commonHelperService.setUpPropertyForm(propertyData)
    } catch (error) {
        alertifyService.error(error.message);
    }
}

