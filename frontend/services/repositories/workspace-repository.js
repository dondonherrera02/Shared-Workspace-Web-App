/**
* @name: Co-Space Web App - Workspace Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

import { enumService } from '../utilities/enum.js';
import { propertyRepository } from '../repositories/property-repository.js';
import { localStorageService } from '../utilities/localStorage-helper.js';
import { APIHelperService } from '../utilities/api-helper.js';

class WorkspaceRepositoryService {

    // save to local storage
    async saveWorkspace(workspaceData) {
        // get the current role
        const currentUser = await localStorageService.getOne(enumService.currentUser);

        // validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner) throw new Error('Only property owners are allowed to add workspaces');

        // validate property id existence
        const propertyData = await propertyRepository.getPropertyById(workspaceData.propertyId);

        if (!propertyData || propertyData.ownerId !== currentUser.id) throw new Error('Unauthorized property owner');

        try {
            // call save workspace API
            const response = await APIHelperService.post(`${enumService.URL}/api/workspace/${propertyData.id}`, workspaceData, currentUser.token);
            return response.property;
        } catch (error) {
            console.error("Save workspace failed:", error);
            throw new Error(error);
        }
    }

    // get workspace list
    async getWorkspaceList({ ownerId = null, propertyId = null, city = null, state = null } = {}) {
        // get the current role
        const currentUser = await localStorageService.getOne(enumService.currentUser);

        try {
            // construct query parameters dynamically
            const queryParams = new URLSearchParams();

            if (ownerId) queryParams.append("ownerId", ownerId);
            if (propertyId) queryParams.append("propertyId", propertyId);
            if (city) queryParams.append("city", city);
            if (state) queryParams.append("state", state);

            // build the complete URL
            const url = `${enumService.URL}/api/workspace?${queryParams.toString()}`;

            // call API
            const response = await APIHelperService.get(url, currentUser.token);
            return response;
        } catch (error) {
            console.error("Fetch workspace list failed:", error);
            throw new Error(error);
        }
    }

    // get workspace by id
    async getWorkspaceById(workspaceId) {
        try {
            // get the current role
            const currentUser = await localStorageService.getOne(enumService.currentUser);

            // call get workspace by id
            const response = await APIHelperService.get(`${enumService.URL}/api/workspace/${workspaceId}`, currentUser.token);
            return response;
        } catch (error) {
            console.error("Fetch workspace by id failed:", error);
            throw new Error(error);
        }
    }
  
    // update workspace to local storage
    async updateWorkspace(workspaceId, modifiedWorkspace) {
        // Get the current user
        const currentUser = await localStorageService.getOne(enumService.currentUser);

        // Validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner) {
            throw new Error('Only property owners are allowed to edit workspaces');
        }

        try {
            // call update workspace API
            const response = await APIHelperService.put(`${enumService.URL}/api/workspace/${workspaceId}`, modifiedWorkspace, currentUser.token);
            return response.property;
        } catch (error) {
            console.error("Update workspace failed:", error);
            throw new Error(error);
        }
    }

    // delete workspace
    async deleteWorkspace(workspaceId) {
        try {
            // get the current role
            const currentUser = await localStorageService.getOne(enumService.currentUser);

            // call get property by id
            const response = await APIHelperService.delete(`${enumService.URL}/api/workspace/${workspaceId}`, currentUser.token);
            return response;
        } catch (error) {
            console.error("Delete workspace failed:", error);
            throw new Error(error);
        }
    }

    // search for workspaces that match the search workspace request
    async searchWorkspaces(searchWorkspaceRequest) {
        // get the current role
        const currentUser = await localStorageService.getOne(enumService.currentUser);

        try {
            // construct query parameters dynamically
            const queryParams = new URLSearchParams();

            if (searchWorkspaceRequest.city) queryParams.append("city", searchWorkspaceRequest.city);
            if (searchWorkspaceRequest.state) queryParams.append("state", searchWorkspaceRequest.state);
            if (searchWorkspaceRequest.postalCode) queryParams.append("postalCode", searchWorkspaceRequest.postalCode);
            if (searchWorkspaceRequest.neighborhood) queryParams.append("neighborhood", searchWorkspaceRequest.neighborhood);
            if (searchWorkspaceRequest.squareFeet) queryParams.append("squareFeet", searchWorkspaceRequest.squareFeet);
            if (searchWorkspaceRequest.availabilityDate) queryParams.append("availabilityDate", searchWorkspaceRequest.availabilityDate);
            if (searchWorkspaceRequest.capacity) queryParams.append("capacity", searchWorkspaceRequest.capacity);
            if (searchWorkspaceRequest.leaseTerm) queryParams.append("leaseTerm", searchWorkspaceRequest.leaseTerm);
            if (searchWorkspaceRequest.price) queryParams.append("price", searchWorkspaceRequest.price);

            if (searchWorkspaceRequest.hasTransportation !== undefined) {
                queryParams.append("hasTransportation", searchWorkspaceRequest.hasTransportation === 'available' ? 1 : 0);
            }

            if (searchWorkspaceRequest.hasParkingGarage !== undefined) {
                queryParams.append("hasParkingGarage", searchWorkspaceRequest.hasParkingGarage === 'available' ? 1 : 0);
            }

            if (searchWorkspaceRequest.isSmokingAllowed !== undefined) {
                queryParams.append("isSmokingAllowed", searchWorkspaceRequest.isSmokingAllowed === 'Allowed' ? 1 : 0);
            }

            // build the complete URL
            const url = `${enumService.URL}/api/workspace?${queryParams.toString()}`;

            // call API
            const response = await APIHelperService.get(url, currentUser.token);
            return response;
        } catch (error) {
            console.error("Search workspace list failed:", error);
            throw new Error(error);
        }
    }
}

// export the service
export const workspaceRepository = new WorkspaceRepositoryService();