/**
* @name: Co-Space Web App - Common Helper Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Generic function
class CommonHelperService {

    // *********SIGN-UP FORM***********

    // USER regisration validation
    validateUserData(userData) {

        // full name validation
        if (userData.fullname.length < 5) {
            throw new Error('Fullname must be atleast 3 characters long');
        }

        // phone number validation
        // https://www.geeksforgeeks.org/how-to-validate-phone-numbers-using-javascript-with-regex/
        const phoneNumberPattern = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
        if (!phoneNumberPattern.test(userData.phone)) {
            throw new Error('Invalid phone number');
        }

        // email validation
        // i got this idea from: https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            throw new Error('Invalid email address.');
        }

        // password validation
        // https://www.geeksforgeeks.org/password-validation-form-using-javascript/
        if (userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long')
        }

        const upperCasePattern = /[A-Z]/g;
        if (!userData.password.match(upperCasePattern)) {
            throw new Error('Password must be atleast one uppecase letter')
        }

        const lowerCasePattern = /[a-z]/g;
        if (!userData.password.match(lowerCasePattern)) {
            throw new Error('Password must be atleast one lowercase letter')
        }

        const numbersPattern = /[0-9]/g;
        if (!userData.password.match(numbersPattern)) {
            throw new Error('Password must be atleast one number')
        }

        // role validation
        // https://www.w3schools.com/Jsref/jsref_includes.asp
        if (![enumService.coWorker, enumService.workspaceOwner].includes(userData.role)) {
            throw new Error('Invalid role')
        }
    }

    // FORMAT name to Pascal Case
    formatTitle(name) {
        return name
            .split(' ') // Split the name into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
            .join(' '); // Join the words back together without spaces
    }

    // *********PROPERTY FORM***********

    // SET-UP property form
    setUpPropertyForm(property = null) {
        let $propertyForm = $('#propertyForm');
    
        if (property) {
            // Update property set-up
            $propertyForm.data("property-id", property.id); // set custom metadata in HTML eg. data-property-id
            $('street').val() = property.street;
            $('city').val() = property.city;
            $('state').val() = property.state;
            $('postalCode').val() = property.postalCode;
            $('neighborhood').val() = property.neighborhood;
            $('squareFeet').val() = property.squareFeet;
            $('parkingGarage').val() = property.parkingGarage;
            $('transportation').val() = property.transportation;
    
        }else {
            $(propertyForm).trigger("reset"); // reset the form
            $(propertyForm).removeData("property-id"); // remove stored property id value from cache
        }
    }

    // PROPERTY registration validation
    validatePropertyData(propertyData) {
        
        // Check for empty fields
        for (let key in propertyData) {
            if (!propertyData[key]) {
                throw new Error(`${key} is required.`);
            }
        }

        // Validate square feet (must be numbers)
        let sqFeetPattern = /^[0-9]+$/;
        if (!propertyData.squareFeet.match(sqFeetPattern)) {
            throw new Error('Square Feet must be a number.');
        }
    }

    // display property cards
    displayPropertyCards() {

        // get property list - html element
        let $propertyList = $('#propertyList');

        // get properties by current user
        const propertyList = propertyRepository.getPropertyListByCurrentUser();

        if (propertyList.length === 0) {
            $propertyList.append('<p>No properties listed yet. Click "Add Property" to get started.</p>');
            return;
        }

        $propertyList.empty();

        propertyList.forEach((property) => {

            const cityState = `${commonHelperService.formatTitle(property.city)}, ${commonHelperService.formatTitle(property.state)}`;
            const address = `${commonHelperService.formatTitle(property.street)}, ${property.postalCode}`;
            const neighborhood = `${commonHelperService.formatTitle(property.neighborhood)}`;
            const parkingGarage = `${commonHelperService.formatTitle(property.parkingGarage)}`;
            const transportation = `${commonHelperService.formatTitle(property.transportation)}`;

            let eachProperty = $(
                `
                <div class="col-md-6 col-lg-4">
                    <div class="property-card">
                        <div class="property-header d-flex justify-content-between align-items-center">
                           <h5 class="property-state mb-0"> ${cityState} </h5>
                            <div class="property-actions">
                                <i class="fas fa-add" data-bs-toggle="tooltip" title="Add Workspace"></i>
                                <i class="fas fa-edit" data-bs-toggle="offcanvas" title="Edit Property" data-bs-target="#addPropertyModal"></i>
                                <i class="fas fa-trash-alt" data-bs-toggle="tooltip" title="Delete Property"></i>
                            </div>
                        </div>
                        
                        <div class="property-address mb-4">${address}</div>
                        <div class="property-details">
                            <p class="mb-1"><strong>Neighborhood:</strong> ${neighborhood}</p>
                            <p class="mb-1"><strong>Square Feet:</strong> ${property.squareFeet} sqm</p>
                            <p class="mb-1"><strong>Parking Garage:</strong> ${parkingGarage}</p>
                            <p class="mb-1"><strong>Public Transportation:</strong> ${transportation} </p>
                            <p class="mb-1"><strong>No. Workspace:</strong> 0 </p>
                        </div>
                    </div>
                </div>
            `);

            $propertyList.append(eachProperty);
        });
    }
}

// export the service (if using modules) or instantiate directly
const commonHelperService = new CommonHelperService();