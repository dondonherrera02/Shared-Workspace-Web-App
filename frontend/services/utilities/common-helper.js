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
            $propertyForm.data("property-id", property.id);  // store property ID as data attribute
            $('#pName').val(property.pName);
            $('#street').val(property.street);
            $('#state').val(property.state).trigger('change'); // triggers change event if state selection loads cities
            setTimeout(function () { $('#city').val(property.city); }, 500);
            $('#postalCode').val(property.postalCode.replace(/-/g, '')); // remove hypens during edits
            $('#neighborhood').val(property.neighborhood);
            $('#squareFeet').val(property.squareFeet);
            $('#parkingGarage').val(property.parkingGarage);
            $('#transportation').val(property.transportation);
        } else {
            $(propertyForm).trigger("reset"); // reset the form
            $(propertyForm).removeData("property-id"); // remove stored property id value from cache
        }
    }

    // PROPERTY registration validation
    validatePropertyData(propertyData) {

        // check for empty fields
        for (let key in propertyData) {
            if (!propertyData[key]) {
                throw new Error(`${this.formatTitle(key)} is required.`);
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

            const workspaces = workspaceRepository.getWorkspaceListByPropertyId(property.id);

            const pName = `${commonHelperService.formatTitle(property.pName)}`;
            const cityState = `${commonHelperService.formatTitle(property.city)}, ${commonHelperService.formatTitle(property.state)},  ${property.postalCode}`;
            const address = `${commonHelperService.formatTitle(property.street)}`;
            const neighborhood = `${commonHelperService.formatTitle(property.neighborhood)}`;
            const parkingGarage = `${commonHelperService.formatTitle(property.parkingGarage)}`;
            const transportation = `${commonHelperService.formatTitle(property.transportation)}`;

            let eachProperty = $(
                `
                 <div class="col-md-6 col-lg-4">
                    <div class="property-card">
                        <div class="property-header d-flex justify-content-between align-items-center">
                            <h5 class="property-name mb-0">${pName}</h5>
                            <div class="property-actions">
                                <i class="fas fa-trash-alt" data-bs-toggle="tooltip" title="Delete Property" onclick="deleteProperty('${property.id}')"></i>
                            </div>
                        </div>
        
                        <div class="property-state mb-4">${cityState}</div>
        
                        <div class="property-details mb-4" >
                            <p class="mb-1"><strong>Street:</strong> ${address}</p>
                            <p class="mb-1"><strong>Neighborhood:</strong> ${neighborhood}</p>
                            <p class="mb-1"><strong>Square Feet:</strong> ${property.squareFeet} sqm</p>
                            <p class="mb-1"><strong>Parking Garage:</strong> ${parkingGarage}</p>
                            <p class="mb-1"><strong>Public Transportation:</strong> ${transportation}</p>
                            <p class="mb-1"><strong>No. Workspace:</strong> ${workspaces.length}</p>
                        </div>

                        <div class="property-actions d-flex justify-content-between align-items-center gap-2">
                            <button class="btn-view w-100" onclick="getPropertyWorkspaces('${property.id}')">View Workspaces</button>
                            <button class="btn-edit w-100" data-bs-toggle="offcanvas" title="Edit Property" data-bs-target="#addPropertyModal" onclick="editProperty('${property.id}')">Edit Property</button>
                        </div>
                    </div>
                </div>
            `);

            $propertyList.append(eachProperty);
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

    // *********WORKSPACE FORM***********
    setUpWorkspaceForm(propertyId, workspace = null) {

        $('#propertyId').val(propertyId); // set the current property id

        let $workspaceForm = $('#workspaceForm');

        if (workspace) {
            // Update workspace set-up
            $workspaceForm.data("workspace-id", workspace.id); // store workspace ID as data attribute
            $('#roomNum').val(workspace.roomNum);
            $('#type').val(workspace.type);
            $('#capacity').val(workspace.capacity);
            $('#leaseTerm').val(workspace.leaseTerm);
            $('#availabilityDate').val(workspace.availabilityDate);
            $('#smokingPolicy').val(workspace.smokingPolicy);
            $('#price').val(workspace.price);
        } else {
            $(workspaceForm).trigger("reset"); // reset the form
            $(workspaceForm).removeData("workspace-id"); // remove stored workspace id value from cache
        }
    }

    setUpWorkspaceView(property = null, workspace = null) {
        
        if (property) {
            $('#propertyNameView').text(property.pName); 
            $('#propertyAddressView').text(`Room No. ${workspace.roomNum}, ${property.street}, ${property.city}, ${property.state}, ${property.postalCode} `); 
        }
    
        if (workspace) {
            $('#typeView').text(`${workspace.type}`);
            $('#availabilityDateView').text(workspace.availabilityDate);
            $('#leaseTermView').text(workspace.leaseTerm);
            $('#priceView').text(`$${workspace.price}/${workspace.leaseTerm}`);
            $('#seatingView').text(workspace.capacity);
            $('#smokingView').text(workspace.smokingPolicy);
            $('#parkingView').text(workspace.parkingGarage);
            $('#transportationView').text(workspace.transportation);
        }
    }
    

    validateWorkspaceData(workspaceData) {

        // Check for empty fields
        for (let key in workspaceData) {
            if (!workspaceData[key]) {
                throw new Error(`${this.formatTitle(key)} is required.`);
            }
        }

        let numberPattern = /^[0-9]+$/;

        // Room number - positive number
        if (!workspaceData.roomNum.match(numberPattern)) {
            throw new Error('Room number must be a positive number.');
        }

        // Seating capacity - positive number
        if (!workspaceData.capacity.match(numberPattern)) {
            throw new Error('Seating capacity must be a positive number.');
        }

        // Ensure workspaceData.capacity is an integer before comparison
        let capacity = parseInt(workspaceData.capacity);

        // Set the seating capacity with workspace type
        if (capacity > 100 && workspaceData.type === enumService.meetingRoom) {
            throw new Error(`Seating capacity cannot exceed 100 for ${workspaceData.type}`);
        } else if (capacity > 50 && workspaceData.type === enumService.privateOffice) {
            throw new Error(`Seating capacity cannot exceed 50 for ${workspaceData.type}`);
        } else if (capacity > 2 && workspaceData.type === enumService.desk) {
            throw new Error(`Seating capacity cannot exceed 2 for ${workspaceData.type}`);
        }

        // Price - positive number and set the length
        if (!workspaceData.price.match(numberPattern)) {
            throw new Error('Price must be a positive number.');
        }

        if (workspaceData.price.length > 7) {
            throw new Error('Please input a valid price.');
        }

        // Availability date - future dates only
        if (new Date(workspaceData.availabilityDate) < new Date()) {
            throw new Error('Availability date must be a future date.');
        }
    }

    // display and create workspace cards
    displayWorkspaceCards(propertyId = null) {
        const $workspaceList = $('#workspaceList');
        $workspaceList.empty();

        let workspaces = [];

        // get user data role and id
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        if (propertyId) {
            // get workspaces by current user and property id
            workspaces = workspaceRepository.getWorkspaceListByPropertyId(propertyId);
            const workspaceProperty = propertyRepository.getPropertyById(propertyId);

            if (workspaceProperty) {
                $('#workspaceHeader').text(`Workspaces for ${commonHelperService.formatTitle(workspaceProperty.pName)}`)
                    .on('click', function () {
                        window.location.href = enumService.ownerRoute;
                    });

                var button = $('<button>')
                    .addClass('btn btn-primary')
                    .attr('data-bs-toggle', 'modal')
                    .attr('data-bs-target', '#addWorkspaceModal')
                    .attr('onclick', `addWorkspace('${propertyId}')`)
                    .html('<i class="fas fa-plus me-2"></i>Add Workspace');

                // append the button inside the "workspaceHeader"
                $('#workspaceHeader').closest('.d-flex').append(button);
            }
        } else {

            // get all workspaces when the role is worker
            if (currentUser.role === enumService.coWorker) {
                workspaces = workspaceRepository.getWorkspaceList();
                workspaces = workspaces.filter(w => new Date(w.availabilityDate) >= new Date());
            } else {
                // get workspaces by user id when the role is owner
                workspaces = workspaceRepository.getWorkspacesByUserId(currentUser.id);
            }

            if (workspaces.length === 0) {
                $workspaceList.append('<p>No workspaces listed yet.</p>');
                return;
            }

            // sort workspaces by propertyId in ascending order
            workspaces.sort((a, b) => {
                const numA = parseInt(a.propertyId.replace('property-', ''), 10);
                const numB = parseInt(b.propertyId.replace('property-', ''), 10);
                return numA - numB;
            });
        }

        // append workspace cards
        workspaces.forEach((workspace) => {
            const workspaceProperty = propertyRepository.getPropertyById(workspace.propertyId);

            let eachWorkspace = '';

            if (currentUser.role === enumService.coWorker) {
                eachWorkspace = this.createWorkerWorkspaceCard(workspace, workspaceProperty);
            } else {
                eachWorkspace = this.createPropertyOwnerWorkspaceCard(workspace, workspaceProperty);
            }

            $workspaceList.append(eachWorkspace);
        });
    }

    createPropertyOwnerWorkspaceCard(workspace, workspaceProperty) {

        const workspaceAddress = `${commonHelperService.formatTitle(workspaceProperty.street)},
                            ${commonHelperService.formatTitle(workspaceProperty.city)},
                            ${workspaceProperty.state}`;

        const workspaceType = `${commonHelperService.formatTitle(workspace.type)}`;

        const isExpired = new Date(workspace.availabilityDate) < new Date();
        const availabilityClass = isExpired ? 'expired' : '';

        return $(`
            <div class="col-md-6 col-lg-4">
                <div class="property-card">
                    <div class="property-header d-flex justify-content-between align-items-center">
                        <h5 class="property-name mb-0"> Room Number ${workspace.roomNum} </h5>
                        <div class="property-actions">
                            <i class="fas fa-edit" data-bs-toggle="modal" title="Edit Workspace" data-bs-target="#addWorkspaceModal" onclick="editWorkspace('${workspace.id}')"></i>
                            <i class="fas fa-trash-alt" data-bs-toggle="tooltip" title="Delete Workspace" onclick="deleteWorkspace('${workspace.id}')"></i>
                        </div>
                    </div>
    
                    <div class="property-state mb-4">${workspaceType}</div>
                    <div class="property-details">
                        <p class="mb-1"><strong>Address:</strong> ${workspaceAddress}</p>
                        <p class="mb-1"><strong>Capacity:</strong> ${workspace.capacity}</p>
                        <p class="mb-1"><strong>Lease Term:</strong> ${workspace.leaseTerm}</p>
                        <p class="mb-1" ${availabilityClass}><strong>Availability Date:</strong> ${workspace.availabilityDate}</p>
                        <p class="mb-1"><strong>Smoking Policy:</strong> ${workspace.smokingPolicy}</p>
                        <p class="mb-1"><strong>Price:</strong> $${workspace.price}/${workspace.leaseTerm} </p>
                    </div>
                </div>
            </div>
        `);
    }

    createWorkerWorkspaceCard(workspace, workspaceProperty) {

        const workspaceAddress = `${commonHelperService.formatTitle(workspaceProperty.street)},
                            ${commonHelperService.formatTitle(workspaceProperty.city)},
                            ${workspaceProperty.state}`;

        const workspaceType = `${commonHelperService.formatTitle(workspace.type)}`;

        return $(`
            <div class="col-md-6 col-lg-4">
                <div class="property-card">
                    <div class="property-header d-flex justify-content-between align-items-center">
                        <h5 class="property-name mb-0"> ${workspaceProperty.pName} </h5>
                    </div>
    
                    <div class="property-state mb-4">${workspaceAddress}</div>

                    <div class="property-details mb-3">
                        <p class="mb-1"><strong>Room Number:</strong> ${workspace.roomNum}</p>
                        <p class="mb-1"><strong>Type:</strong> ${workspaceType}</p>
                        <p class="mb-1"><strong>Availability Date:</strong> ${workspace.availabilityDate}</p>
                        <p class="mb-1"><strong>Lease Term:</strong> ${workspace.leaseTerm}</p>
                        <p class="mb-1"><strong>Price:</strong> $${workspace.price}/${workspace.leaseTerm} </p>
                    </div>

                     <div class="property-actions d-flex justify-content-between align-items-center gap-2">
                        <button class="btn-view w-100" data-bs-toggle="modal" title="Workspace" data-bs-target="#viewWorkspaceModal" onclick="viewWorkspace('${workspace.id}')">View</button>
                        <button class="btn-edit w-100">Contact</button>
                    </div>
                </div>
            </div>
        `);
    }
}

// export the service (if using modules) or instantiate directly
const commonHelperService = new CommonHelperService();