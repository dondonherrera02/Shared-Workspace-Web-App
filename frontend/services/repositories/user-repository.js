/**
* @name: Co-Space Web App - Mock User Repository - API Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

// Import the services
import { databaseHelperService } from '../utilities/database-helper.js';
import { APIHelperService } from '../utilities/api-helper.js';
import { enumService } from '../utilities/enum.js';

class UserRepositoryService {

    // register new user to the system
    async saveUser(userData) {
       
        try {
            // call to register new user endpoint
            await APIHelperService.post(`${enumService.URL}/api/user`, userData);
        } catch (error) {
            console.error("Save user failed:", error);
        }
    }

    // get user info by workspace id
    async getUserInfo(userId) {
        // get workspace list
        const users = await databaseHelperService.getList(enumService.users);

        // find by id
        const user = users.find(user => user.id === userId);

        // validate
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    // get current user
    async getCurrentUser(){
        return await databaseHelperService.getOne(enumService.currentUser);
    }

    // update user to local storage
    async updateUser(id, modifiedProfile) {
        // get users
        const users = await databaseHelperService.getList(enumService.users);

        if (!users) {
            throw new Error('Unable to upload profile.');
        }

        // find the user and its index
        const currentUserIndex = users.findIndex(u => u.id === id);

        // if user not found, throw error
        if (currentUserIndex === -1) {
            throw new Error("User not found. Unable to update workspace.");
        }

        const userToUpdate = users[currentUserIndex];

         // get the current user
         const currentUser = await this.getCurrentUser();

        // check if the user is authorized to update
        if (userToUpdate.id !== currentUser.id) {
            throw new Error("Unauthorized user. Unable to update this profile.");
        }

        // update with latest update
        users[currentUserIndex] = { ...userToUpdate, ...modifiedProfile };

        // Save updated user list to local storage
        await databaseHelperService.saveToLocalStorage(enumService.users, users);

        // update the current user
        await databaseHelperService.saveToLocalStorage(enumService.currentUser, users[currentUserIndex]);

        // Return the updated user
        return users[currentUserIndex];
    }
}

// export the service
export const userRepository = new UserRepositoryService();