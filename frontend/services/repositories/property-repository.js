/**
* @name: Co-Space Web App - Property Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

import { enumService } from '../utilities/enum.js';
import { localStorageService } from '../utilities/localStorage-helper.js';
import { APIHelperService } from '../utilities/api-helper.js';

class PropertyRepositoryService {

    // save property information
    async saveProperty(propertyData) {
        // get the current role
        const currentUser = await localStorageService.getOne(enumService.currentUser);

        // validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner) {
            throw new Error('Only workspace owners are allowed to add properties');
        }

        try {
            // call save property API
            const response = await APIHelperService.post(`${enumService.URL}/api/property`, propertyData, currentUser.token);
            return response.property;
        } catch (error) {
            console.error("Save property failed:", error);
            throw new Error(error);
        }
    }

    // get property list
    async getPropertyList({ ownerId = null, city = null, state = null } = {}) {
        // get the current role
        const currentUser = await localStorageService.getOne(enumService.currentUser);

        try {
            // construct query parameters dynamically
            const queryParams = new URLSearchParams();

            if (ownerId) queryParams.append("ownerId", ownerId);
            if (city) queryParams.append("city", city);
            if (state) queryParams.append("state", state);

            // build the complete URL
            const url = `${enumService.URL}/api/property?${queryParams.toString()}`;

            // call API
            const response = await APIHelperService.get(url, currentUser.token);
            return response;
        } catch (error) {
            console.error("Fetch property list failed:", error);
            throw new Error(error);
        }
    }
   
    // get property by id
    async getPropertyById(propertyId) {
        try {
            // get the current role
            const currentUser = await localStorageService.getOne(enumService.currentUser);
            
            // call get property by id
            const response = await APIHelperService.get(`${enumService.URL}/api/property/${propertyId}`, currentUser.token);
            return response;
        } catch (error) {
            console.error("Fetch property by id failed:", error);
            throw new Error(error);
        }
    }

    // update property
    async updateProperty(propertyId, modifiedProperty) {
        // Get the current user
        const currentUser = await localStorageService.getOne(enumService.currentUser);

        // Validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner) {
            throw new Error('Only workspace owners are allowed to edit properties');
        }

        try {
            // call save property API
            const response = await APIHelperService.put(`${enumService.URL}/api/property/${propertyId}`, modifiedProperty, currentUser.token);
            return response.property;
        } catch (error) {
            console.error("Update property failed:", error);
            throw new Error(error);
        }
    }

    // delete property and all assoc workspaces
    async deleteProperty(propertyId) {
        try {
            // get the current role
            const currentUser = await localStorageService.getOne(enumService.currentUser);
            
            // call get property by id
            const response = await APIHelperService.delete(`${enumService.URL}/api/property/${propertyId}`, currentUser.token);
            return response;
        } catch (error) {
            console.error("Delete property and associated workspaces failed:", error);
            throw new Error(error);
        }
    }
}

// export the service
export const propertyRepository = new PropertyRepositoryService();