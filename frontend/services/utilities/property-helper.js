/**
* @name: Co-Space Web App - Property Helper Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { enumService } from '../utilities/enum.js';
import { propertyRepository } from '../repositories/property-repository.js';
import { workspaceRepository } from '../repositories/workspace-repository.js';
import { commonHelperService } from '../utilities/common-helper.js';

// Generic function
class PropertyHelperService {

    // *********PROPERTY FORM***********

    // SET-UP property form
    setUpPropertyForm(property = null) {
        let $propertyForm = $('#propertyForm');

        if (property) {
            // Update property set-up
            $propertyForm.data("property-id", property.id);  // store property ID as data attribute
            $('#pName').val(property.name);
            $('#street').val(property.street);
            $('#state').val(property.state).trigger('change'); // triggers change event if state selection loads cities
            setTimeout(function () { $('#city').val(property.city); }, 500);
            $('#postalCode').val(property.postalCode.replace(/-/g, '')); // remove hypens during edits
            $('#neighborhood').val(property.neighborhood);
            $('#squareFeet').val(property.squareFeet);
            $('#parkingGarage').val(property.hasParkingGarage ? 'available' : 'not available');
            $('#transportation').val(property.hasTransportation ? 'available' : 'not available')
        } else {
            // Save property set-up
            $(propertyForm).trigger("reset"); // reset the form
            $(propertyForm).removeData("property-id"); // remove stored property id value from cache
        }
    }

    // PROPERTY registration validation
    validatePropertyData(propertyData) {

        // check for empty fields
        const fieldMapping = {
            name: 'Property name',
            postalCode: 'Postal Code',
            squareFeet: 'Square Feet',
            hasParkingGarage: 'Parking Garage Policy',
            hasTransportation: 'Transportation Accessibility'
        };

        // Check for empty fields
        for (let key in propertyData) {
            if (!propertyData[key]) {
                const fieldName = fieldMapping[key] || key; // use custom name if available, otherwise fall back to the key
                throw new Error(`${commonHelperService.formatTitle(fieldName)} is required.`);
            }
        }

        // postal code for Canada - Validation
        if (propertyData.postalCode.length !== 6) {
            throw new Error('Postal code must be 6 characters long.');
        } else {
            propertyData.postalCode = propertyData.postalCode.slice(0, 3).toUpperCase() + '-' + propertyData.postalCode.slice(3).toUpperCase();
        }

        // validate square feet (must be numbers)
        let sqFeetPattern = /^[0-9]+$/;
        if (!propertyData.squareFeet.match(sqFeetPattern)) {
            throw new Error('Square Feet must be a positive number.');
        }
    }

    // display property cards
    async displayPropertyCards(currentUser = null) {

        const role = currentUser?.role;

        let $propertyList = $('#propertyList');
        $propertyList.empty();

        let propertyList = await propertyRepository.getPropertyList(
            role === enumService.workspaceOwner ? { ownerId: currentUser.id } : {}
        );

        if (propertyList.length === 0) {
            $propertyList.append('<p>No properties listed yet. Click "Add Property" to get started.</p>');
            return;
        }

        // sort properties by property name in ascending order
        propertyList.sort((a, b) => a.name.localeCompare(b.name));

        // loop through each property
        propertyList.forEach(async (property) => {

            const workspaces = await workspaceRepository.getWorkspaceList(
                role === enumService.workspaceOwner
                    ? { ownerId: currentUser.id, propertyId: property.id }
                    : { propertyId: property.id }
            );

            // format the property details
            const pName = `${commonHelperService.formatTitle(property.name)}`;
            const cityState = `${commonHelperService.formatTitle(property.city)}, ${commonHelperService.formatTitle(property.state)}, ${property.postalCode}`;
            const address = `${commonHelperService.formatTitle(property.street)}`;
            const neighborhood = `${commonHelperService.formatTitle(property.neighborhood)}`;
            const parkingGarage = `${commonHelperService.formatTitle(property.hasParkingGarage ? 'available' : 'not available')}`;
            const transportation = `${commonHelperService.formatTitle(property.hasTransportation ? 'available' : 'not available')}`;

            let eachProperty = $(`
            <div class="col-md-6 col-lg-4">
                <div class="property-card">
                    <div class="property-header d-flex justify-content-between align-items-center">
                        <h5 class="property-name mb-0">${pName}</h5>
                        <div class="property-actions">
                            <i class="fas fa-trash-alt deleteProperty" data-bs-toggle="tooltip" title="Delete Property" onclick="deleteProperty('${property.id}')"></i>
                        </div>
                    </div>

                    <div class="property-state mb-4">${cityState}</div>

                    <div class="property-details mb-4">
                        <p class="mb-1"><strong>Street:</strong> ${address}</p>
                        <p class="mb-1"><strong>Neighborhood:</strong> ${neighborhood}</p>
                        <p class="mb-1"><strong>Square Feet:</strong> ${property.squareFeet} sqm</p>
                        <p class="mb-1"><strong>Parking Garage:</strong> ${parkingGarage}</p>
                        <p class="mb-1"><strong>Public Transportation:</strong> ${transportation}</p>
                        <p class="mb-1"><strong>No. Workspace:</strong> ${workspaces.length}</p>
                    </div>

                    <div class="property-actions d-flex justify-content-between align-items-center gap-2">
                       <button class="btn-view w-100" onclick="getPropertyWorkspaces('${property.id}', '${role}')">View Workspaces</button>
                        <button class="btn-edit w-100 editProperty" data-bs-toggle="offcanvas" title="Edit Property" data-bs-target="#addPropertyModal" onclick="editProperty('${property.id}')">Edit Property</button>
                    </div>
                </div>
            </div>
        `);

            // Append property to list
            $propertyList.append(eachProperty);

            // Hide buttons for co-workers immediately after appending
            if (role === enumService.coWorker) {
                eachProperty.find(".editProperty, .deleteProperty").hide();
            }
        });
    }

    // Function to populate the dropdowns
    // Ref: https://github.com/aosimeon/canadian-cities-provinces/blob/main/canadian_provinces.json
    // https://menyhartmedia.com/2022/08/01/create-country-state-city-zip-code-drop-down-list-using-javascript/
    getCityState() {
        // load state and cities
        $.getJSON("/assets/metadata/canadian_provinces.json", function (data) {
            let $state = $("#state");
            let $city = $("#city");

            // get and sort states
            let sortedStates = Object.keys(data).sort();

            // append sorted states
            $.each(sortedStates, function (index, state) {
                $state.append($("<option>", {
                    value: state,
                    text: state
                }));
            });

            // when state is selected, update cities
            $state.change(function () {
                $city.empty().append('<option value="">Select a city</option>');

                let selectedState = $(this).val();

                if (selectedState) {
                    // Sort the cities
                    let sortedCities = data[selectedState].sort();

                    $.each(sortedCities, function (index, city) {
                        $city.append($("<option>", {
                            value: city,
                            text: city
                        }));
                    });
                }
            });
        })
            .fail(function () {
                throw new Error('Could not locations data.');
            });
    }
}

// export the service
export const propertyHelperService = new PropertyHelperService();