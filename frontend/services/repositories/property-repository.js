/**
* @name: Co-Space Web App - Property Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

class PropertyRepositoryService {

    // save to local storage
    saveProperty(propertyData){
        // get the current role
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner){
            throw new Error('Only workspace owners are allowed to add properties');
        }

        // get the current property list
        const propertyList = databaseHelperService.getList(enumService.properties);
        
        // check if existing property by city and postal code
        const existingProperty = propertyList.find(property => 
            property.pName.toLowerCase() === propertyData.pName.toLowerCase() &&
            property.postalCode.toLowerCase() === propertyData.postalCode.toLowerCase()
        );

        if(existingProperty){
            throw new Error('Property already registered');
        }

        // set property identifier
        propertyData.id = `${enumService.propertyPreIdKey}${Date.now().toString()}`;

        // set property owner identifier
        propertyData.ownerId = currentUser.id;

        // add into property list
        propertyList.push(propertyData);

        // save to local storage
        databaseHelperService.saveToLocalStorage(enumService.properties, propertyList);

        return propertyData;
    }

    // get property list
    getPropertyList = () => databaseHelperService.getList(enumService.properties);

    // get property by id
    getPropertyById(propertyId){

         // get property list
         const propertyList = databaseHelperService.getList(enumService.properties);
        
         // find by id
         const property = propertyList.find(property => property.id === propertyId);

         return property;
    }

    // update property to local storage
    updateProperty(propertyId, modifiedProperty) {
        // Get the current user
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // Validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner) {
            throw new Error('Only workspace owners are allowed to edit properties');
        }

        // Get property list
        const propertyList = databaseHelperService.getList(enumService.properties);

        // Find the property and its index
        const currentPropertyIndex = propertyList.findIndex(property => property.id === propertyId);

        // If property is not found, throw error
        if (currentPropertyIndex === -1) {
            throw new Error("Property not found. Unable to update property.");
        }

        const currentProperty = propertyList[currentPropertyIndex];

        // Check if the user is authorized to update the property
        if (currentProperty.ownerId !== currentUser.id) {
            throw new Error("Unauthorized user. Unable to update this property.");
        }

        // Update current property with modified property
        propertyList[currentPropertyIndex] = { ...currentProperty, ...modifiedProperty };

        // Save updated property list to local storage
        databaseHelperService.saveToLocalStorage(enumService.properties, propertyList);

        // Return the updated property
        return propertyList[currentPropertyIndex];
    }

    // get property list by current user id
    getPropertyListByCurrentUser() {
         // get the current
         const currentUser = databaseHelperService.getOne(enumService.currentUser);

         // get property list
        const propertyList = databaseHelperService.getList(enumService.properties);

        // filter by current user id, returns an array of all properties by current user id
        const propertiesByCurrentUser = propertyList.filter(property => property.ownerId === currentUser.id);

        return propertiesByCurrentUser;
    }

    // delete property and all assoc workspaces
    deleteProperty(propertyId) {

        // get property to delete
        const propertyToDelete = this.getPropertyById(propertyId);

        // check if this 
        if(!propertyToDelete) throw new Error('Property not found.');

        // get the current user
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // check if the user is allowed to delete
        if(propertyToDelete.ownerId !== currentUser.id) throw new Error('Unauthorized to delete this property.');

        // remove associated workspaces and save it back to local storage
        let currentWorkspaces = workspaceRepository.getWorkspaceList();
        currentWorkspaces = currentWorkspaces.filter(w => w.propertyId !== propertyId);
        databaseHelperService.saveToLocalStorage(enumService.workspaces, currentWorkspaces);

        // remove property and save it back
        let currentProperties = this.getPropertyList();
        currentProperties = currentProperties.filter(p => p.id !== propertyId);
        databaseHelperService.saveToLocalStorage(enumService.properties, currentProperties);
    }

}

// export the service (if using modules) or instantiate directly
const propertyRepository = new PropertyRepositoryService();