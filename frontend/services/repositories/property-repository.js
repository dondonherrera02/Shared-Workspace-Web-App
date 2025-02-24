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
            property.city.toLowerCase() === propertyData.city.toLowerCase() &&
            property.postalCode.toLowerCase() === propertyData.postalCode.toLowerCase()
        );

        if(existingProperty){
            throw new Error('Property already registered');
        }

        // set property identifier
        propertyData.id = `${enumService.coSpacePreIdKey}${Date.now().toString()}`;

        // set property owner identifier
        property.ownerId = currentUser.id;

        // add into property list
        propertyList.push(propertyData);

        // save to local storage
        databaseHelperService.saveToLocalStorage(enumService.properties, propertyList);

        return propertyData;
    }

    // get property by id
    getPropertyById(propertyId){

         // get property list
         const propertyList = databaseHelperService.getList(enumService.properties);
        
         // find by id
         const property = propertyList.find(property => property.id === propertyId);

         // validate
         if (!property){
            throw new Error('Property not found');
         }

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
        const currentPropertyIndex = propertyList.findIndex(property => property.Id === propertyId);

        // If property is not found, throw error
        if (currentPropertyIndex === -1) {
            throw new Error("Property not found. Unable to update this property.");
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

}

// export the service (if using modules) or instantiate directly
const propertyRepository = new PropertyRepositoryService();