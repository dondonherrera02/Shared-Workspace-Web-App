/**
* @name: Co-Space Web App - Mock User Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

// Import the services
import { databaseHelperService } from '../utilities/database-helper.js';
import { enumService } from '../utilities/enum.js';

class UserRepositoryService {

    // save to local storage
    async saveUser(userData) {
        // get users
        const userList = await databaseHelperService.getList(enumService.users);
        
        // find existing account
        const existingUser = userList.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
        
        // check if existing user
        if (existingUser) {
            throw new Error('Email already registered.');
        }

        // set user identifier
        userData.id = `${userData.role}-${Date.now().toString()}`;
        
        // add into array
        userList.push(userData);

        // save to local storage
        await databaseHelperService.saveToLocalStorage(enumService.users, userList);
        
        return userData;
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