/**
* @name: Co-Space Web App - Mock Auth Repository - API Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { APIHelperService } from '../utilities/api-helper.js';
import { enumService } from '../utilities/enum.js';
import { localStorageService } from '../utilities/localStorage-helper.js';

class AuthRepositoryService {

    async login(email, password) {
        try {
            // prepare the request
            const request = {
                email: email,
                password: password
            }
            
            // call the login endpoint
            const response = await APIHelperService.post(`${enumService.URL}/api/login`, request);
            
            // save the token during login
            localStorageService.reset();

             // prepare the response
             const userData = {
                id: response.userId,
                role: response.userRole,
                token: response.user
            }

            // save to local storage
            localStorageService.saveToLocalStorage(enumService.currentUser, userData);

            // return user data
            return userData;
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error("Invalid credentials.");
        }
    }

    async logout() {
        try {
            
            // call the logout endpoint - clear the current user cookie
            APIHelperService.post(`${enumService.URL}/api/logout`)

            // to remove the user credentials in local storage
            let currentUser = localStorageService.getOne(enumService.currentUser);
            currentUser = null;
            localStorageService.deleteOne(enumService.currentUser);

        } catch (error) {
            console.error("Logout failed:", error);
            throw new Error("Unable to logout.");
        }
    }
}

// export the service
export const authRepository = new AuthRepositoryService();