/**
* @name: Co-Space Web App - Mock Auth Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { databaseHelperService } from '../utilities/database-helper.js';
import { enumService } from '../utilities/enum.js';

class AuthRepositoryService {

    async login(email, password){
        
        // get all registered users
        const userList = await databaseHelperService.getList(enumService.users); // JSON Parsed Array
        
        // get the credentials, find vs. map, find means get the first element based on the condition, map means get list elements..
        // Reference: https://stackoverflow.com/questions/66992214/find-vs-map-in-javascript
        const requestor = userList.find(user => user.email === email && user.password === password);

        // validate if the user is registered
        if(requestor){
            // get and set current user
            let currentUser = await databaseHelperService.getOne(enumService.currentUser);
            currentUser = requestor;
            
            // update the current user
            await databaseHelperService.saveToLocalStorage(enumService.currentUser, currentUser);
            return currentUser;
        }

        throw new Error('Invalid credentials');
    }

    async logout() {
        let currentUser = await databaseHelperService.getOne(enumService.currentUser);
        currentUser = null;
        await databaseHelperService.deleteOne(enumService.currentUser);
    }
}

// export the service
export const authRepository = new AuthRepositoryService();