/**
* @name: Co-Space Web App - Mock User Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

class UserRepositoryService {

    // save to local storage
    saveUser(userData){
        // get users
        const userList =  databaseHelperService.getList(enumService.users); // JSON Parsed Array
        
        // find existing account
        const existingUser = userList.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
        
        // check if existing user
        if(existingUser){
            throw new Error('Email already registered.');
        }

        // set user identifier
        // ref:https://rahmanfadhil.com/javascript-unique-id/
        userData.id = `${userData.role}-${Date.now().toString()}`;
        
        // add into array
        userList.push(userData);

        // save to local storage
        databaseHelperService.saveToLocalStorage(enumService.users, userList);
        
        return userData;
    }

     // get user info by workspace id
    getUserInfo(userId) {

        // get workspace list
        const users = databaseHelperService.getList(enumService.users);

        // find by id
        const user = users.find(user => user.id === userId);

        // validate
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

     // update user to local storage
     updateUser(id, modifiedProfile) {
        // get the current user
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // get users
        const users = databaseHelperService.getList(enumService.users);

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

        // check if the user is authorized to update
        if (userToUpdate.id !== currentUser.id) {
            throw new Error("Unauthorized user. Unable to update this profile.");
        }

        // update with latest update
        users[currentUserIndex] = { ...userToUpdate, ...modifiedProfile };

        // Save updated user list to local storage
        databaseHelperService.saveToLocalStorage(enumService.users, users);

        // update the current user
        databaseHelperService.saveToLocalStorage(enumService.currentUser, users[currentUserIndex]);

        // Return the updated user
        return userToUpdate;
    }

}

// export the service (if using modules) or instantiate directly
const userRepository = new UserRepositoryService();