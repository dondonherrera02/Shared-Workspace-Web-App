/**
* @name: Co-Space Web App - Workspace Helper Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { commonHelperService } from '../utilities/common-helper.js';
import { enumService } from '../utilities/enum.js';
import { propertyRepository } from '../repositories/property-repository.js';
import { workspaceRepository } from '../repositories/workspace-repository.js';
import { userRepository } from '../repositories/user-repository.js';

// Generic function
class WorkspaceHelperService {

    // *********WORKSPACE FORM***********
    setUpWorkspaceForm(propertyId, workspace = null) {

        $('#propertyId').val(propertyId); // set the current property id

        let $workspaceForm = $('#workspaceForm');

        if (workspace) {
            // Update workspace set-up
            $workspaceForm.data("workspace-id", workspace.id); // store workspace ID as data attribute
            $('#roomNum').val(workspace.roomNumber);
            $('#type').val(workspace.type);
            $('#capacity').val(workspace.capacity);
            $('#leaseTerm').val(workspace.leaseTerm);
            $('#availabilityDate').val(workspace.availabilityDate);
            $('#smokingPolicy').val(workspace.isSmokingAllowed ? 'Allowed' : 'Not Allowed');
            $('#price').val(workspace.price);
        } else {
            $(workspaceForm).trigger("reset"); // reset the form
            $(workspaceForm).removeData("workspace-id"); // remove stored workspace id value from cache
        }
    }

    setUpWorkspaceView(workspace = null) {

        const property = workspace.Property;

        if (property) {
            $('#propertyNameView').text(property.name);
            $('#propertyAddressView').text(`Room No. ${workspace.roomNumber}, ${property.street}, ${property.city}, ${property.state}, ${property.postalCode} `);
        }

        if (workspace) {
            $('#typeView').text(`${workspace.type}`);
            $('#availabilityDateView').text(commonHelperService.formatDate(workspace.availabilityDate));
            $('#leaseTermView').text(workspace.leaseTerm);
            $('#priceView').text(`$${workspace.price}/${workspace.leaseTerm}`);
            $('#seatingView').text(workspace.capacity);
            $('#smokingView').text(workspace.isSmokingAllowed);
            $('#parkingView').text(workspace.hasParkingGarage);
            $('#transportationView').text(workspace.hasTransportation);
        }
    }

    setUpContactView(workspace = null) {
        const property = workspace.Property;
        const userData = workspace.User;

        if (property) {
            $('#propertyContactView').text(property.name);
            $('#propertyAddressContactView').text(`Room No. ${workspace.roomNumber}, ${property.street}, ${property.city}, ${property.state}, ${property.postalCode} `);
        }

        if (userData) {
            $('#ownerView').text(userData.fullName);
            $('#emailView').text(userData.email);
            $('#phoneView').text(userData.phone);
        }
    }

    validateWorkspaceData(workspaceData) {

        // check for empty fields
        const fieldMapping = {
            roomNumber: 'Room number',
            type: 'Workspace type',
            leaseTerm: 'Lease Term',
            availabilityDate: 'Availability Date',
            isSmokingAllowed: 'Smoking Policy'
        };

        // Check for empty fields
        for (let key in workspaceData) {
            if (!workspaceData[key]) {
                const fieldName = fieldMapping[key] || key; // use custom name if available, otherwise fall back to the key
                throw new Error(`${commonHelperService.formatTitle(fieldName)} is required.`);
            }
        }

        let numberPattern = /^[0-9]+$/;

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

        // REF: https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/
        const today = new Date().toISOString();
        const availabilityDate = new Date(workspaceData.availabilityDate + "T00:00:00Z").toISOString();

        // Compare using UTC values
        if (availabilityDate <= today) {
            throw new Error("Availability date must be in the future.");
        }
    }

    // display and create workspace cards = trigger by users using view workspaces or view workspace in a property
    async displayWorkspaceCards(propertyId = null) {
        const $workspaceList = $('#workspaceList');
        $workspaceList.empty();

         // get user data role and id
         const currentUser = await userRepository.getCurrentUser();

         // enable the header and button for owner
         if (propertyId) {

            // We need to check if the request property id exists
            const propertyInfo = await propertyRepository.getPropertyById(propertyId);

            // if property found
            if (propertyInfo) {

                // change the header text
                $('#workspaceHeader').text(`Workspaces for ${commonHelperService.formatTitle(propertyInfo.name)}`)
                    .on('click', function () {
                        window.location.href = enumService.ownerRoute;
                    });

                if (currentUser.role === enumService.workspaceOwner) {
                    // create add workspace button
                    var addWorkspaceBtn = $(`
                    <button class="btn btn-primary addWorkspace" data-bs-toggle="modal" data-bs-target="#addWorkspaceModal" onclick="addWorkspace('${propertyId}')">
                        <i class="fas fa-plus me-2"></i>Add Workspace
                    </button>`
                    );

                    // append the button inside the "workspaceHeader"
                    $('#workspaceHeader').closest('.d-flex').append(addWorkspaceBtn);
                }
            }
        }

        let workspaces = [];

        if (currentUser.role === enumService.coWorker) {
            // get all workspaces when the role is worker
            workspaces = await workspaceRepository.getWorkspaceList(propertyId ? { propertyId } : {});
            // filter all available dates to workers
            workspaces = workspaces.filter(w => new Date(w.availabilityDate) >= new Date());
        } else {
            // get workspaces by owner and property id
            workspaces = await workspaceRepository.getWorkspaceList({ ownerId: currentUser.id, propertyId: propertyId });
        }

        if (workspaces.length === 0) {
            $workspaceList.append('<p>No available workspaces have been listed yet.</p>');
            return;
        }

        // sort by type
        workspaces.sort((a, b) => {
            // sort by type alphabetically
            let typeComparison = a.type.localeCompare(b.type);
            if (typeComparison !== 0) return typeComparison;

            // if types are the same, sort by roomNum numerically
            return parseInt(a.roomNum) - parseInt(b.roomNum);
        });

        // append workspace cards
        workspaces.forEach(async (workspace) => {
            const workspaceProperty = await propertyRepository.getPropertyById(workspace.propertyId);

            let eachWorkspace = this.createPropertyOwnerWorkspaceCard(workspace, workspaceProperty);;
            $workspaceList.append(eachWorkspace);

            // Hide buttons immediately after appending
            if (currentUser.role === enumService.coWorker) {
                eachWorkspace.find(".editWorkspace, .deleteWorkspace, .addWorkspace").hide();
            }
            else if (currentUser.role === enumService.workspaceOwner) {
                eachWorkspace.find(".viewWorkspace, .viewContact").hide();
            }
        });
    }

    createPropertyOwnerWorkspaceCard(workspace, workspaceProperty) {

        const workspaceAddress = `${commonHelperService.formatTitle(workspaceProperty.street)},
                            ${commonHelperService.formatTitle(workspaceProperty.city)},
                            ${workspaceProperty.state}`;

        const workspaceType = `${commonHelperService.formatTitle(workspace.type)}`;

        const isExpired = new Date(workspace.availabilityDate) < new Date();
        const availabilityClass = isExpired ? 'expired' : 'available';

        return $(`
            <div class="col-md-6 col-lg-4">
                <div class="property-card">
                    <div class="property-header d-flex justify-content-between align-items-center">
                        <h5 class="property-name mb-0"> Room Number ${workspace.roomNumber} </h5>
                        <div class="property-actions">
                            <i class="fas fa-edit editWorkspace" data-bs-toggle="modal" title="Edit Workspace" data-bs-target="#addWorkspaceModal" onclick="editWorkspace('${workspace.id}')"></i>
                            <i class="fas fa-trash-alt deleteWorkspace" data-bs-toggle="tooltip" title="Delete Workspace" onclick="deleteWorkspace('${workspace.id}')"></i>
                        </div>
                    </div>
    
                    <div class="property-state mb-4">${workspaceType}</div>
                    <div class="property-details mb-4">
                        <p class="mb-1"><strong>Address:</strong> ${workspaceAddress}</p>
                        <p class="mb-1"><strong>Capacity:</strong> ${workspace.capacity}</p>
                        <p class="mb-1"><strong>Lease Term:</strong> ${workspace.leaseTerm}</p>
                        <p class="mb-1 ${availabilityClass}" ><strong>Availability Date:</strong> ${commonHelperService.formatDate(workspace.availabilityDate)} (${commonHelperService.formatTitle(availabilityClass)})</p>
                        <p class="mb-1"><strong>Smoking Policy:</strong> ${workspace.isSmokingAllowed ? "Allowed" : "Not Allowed"}</p>
                        <p class="mb-1"><strong>Price:</strong> $${workspace.price}/${workspace.leaseTerm} </p>
                    </div>

                    <div class="property-actions d-flex justify-content-between align-items-center gap-2">
                        <button class="btn-view w-100 viewWorkspace" data-bs-toggle="modal" title="Workspace Details" data-bs-target="#viewWorkspaceModal" onclick="viewWorkspace('${workspace.id}')">View</button>
                        <button class="btn-edit w-100 viewContact" data-bs-toggle="modal" title="Contact Details" data-bs-target="#viewContactModal" onclick="viewContact('${workspace.id}')">Contact</button>
                    </div>
                </div>
            </div>
        `);
    }

    createWorkerWorkspaceCard(workspace) {

        const workspaceProperty = workspace.Property;

        const workspaceAddress = `${commonHelperService.formatTitle(workspaceProperty.street)},
                            ${commonHelperService.formatTitle(workspaceProperty.city)},
                            ${workspaceProperty.state}`;

        const workspaceType = `${commonHelperService.formatTitle(workspace.type)}`;

        return $(`
            <div class="col-md-6 col-lg-4">
                <div class="property-card">
                    <div class="property-header d-flex justify-content-between align-items-center">
                        <h5 class="property-name mb-0"> ${workspaceProperty.name} </h5>
                    </div>
    
                    <div class="property-state mb-4">${workspaceAddress}</div>

                    <div class="property-details mb-3">
                        <p class="mb-1"><strong>Room Number:</strong> ${workspace.roomNumber}</p>
                        <p class="mb-1"><strong>Type:</strong> ${workspaceType}</p>
                        <p class="mb-1"><strong>Availability Date:</strong>  ${commonHelperService.formatDate(workspace.availabilityDate)}</p>
                        <p class="mb-1"><strong>Lease Term:</strong> ${workspace.leaseTerm}</p>
                        <p class="mb-1"><strong>Price:</strong> $${workspace.price}/${workspace.leaseTerm} </p>
                    </div>

                     <div class="property-actions d-flex justify-content-between align-items-center gap-2">
                        <button class="btn-view w-100" data-bs-toggle="modal" title="Workspace Details" data-bs-target="#viewWorkspaceModal" onclick="viewWorkspace('${workspace.id}')">View</button>
                        <button class="btn-edit w-100" data-bs-toggle="modal" title="Contact Details" data-bs-target="#viewContactModal" onclick="viewContact('${workspace.id}')">Contact</button>
                    </div>
                </div>
            </div>
        `);
    }
}

// export the service
export const workspaceHelperService = new WorkspaceHelperService();