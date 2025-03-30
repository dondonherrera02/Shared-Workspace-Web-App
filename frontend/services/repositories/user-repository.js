/**
* @name: Co-Space Web App - Mock User Repository - API Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

// Import the services
import { APIHelperService } from '../utilities/api-helper.js';
import { localStorageService } from '../utilities/localStorage-helper.js';
import { enumService } from '../utilities/enum.js';

class UserRepositoryService {

    // register new user to the system - 2.0
    async saveUser(userData) {

        try {
            // call to register new user endpoint
            await APIHelperService.post(`${enumService.URL}/api/user`, userData);
        } catch (error) {
            console.error("Save user failed:", error);
            throw new Error(error);
        }
    }

    // get current user - 2.0
    async getCurrentUser() {
        return await localStorageService.getOne(enumService.currentUser);
    }

    // get user info by workspace id
    async getUserById(userId) {
        try {
            // get the current role
            const currentUser = await localStorageService.getOne(enumService.currentUser);
            
            // call get user by id
            const response = await APIHelperService.get(`${enumService.URL}/api/user/${userId}`, currentUser.token);
            return response;
        } catch (error) {
            console.error("Fetch user by id failed:", error);
            throw new Error(error);
        }
    }

    // update user
    async updateUser(modifiedProfile) {

       // Get the current user
       const currentUser = await localStorageService.getOne(enumService.currentUser);

       try {
           // call save property API
           const response = await APIHelperService.put(`${enumService.URL}/api/user/${currentUser.id}`, modifiedProfile, currentUser.token);
           return response.user;
       } catch (error) {
           console.error("Update profile failed:", error);
           throw new Error(error);
       }
    }
}

// export the service
export const userRepository = new UserRepositoryService();