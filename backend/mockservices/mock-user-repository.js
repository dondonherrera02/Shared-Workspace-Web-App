/**
* @name: Co-Space Web App - Mock User Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

class UserRepositoryService {
    // instance properties - shared values across all instances
    usersObjectName = 'users';
    userIdKey = 'co-space-';

    // POST save to local storage
    saveUser(userData){
        // get users
        const userList =  helperUtilService.getList(this.usersObjectName); // JSON Parsed Array
        
        // find existing account
        const existingUser = userList.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
        
        // check if existing user
        if(existingUser){
            throw new Error('Email already registered.');
        }

        // set user identifier
        // ref:https://rahmanfadhil.com/javascript-unique-id/
        userData.id = `${this.userIdKey}${Date.now().toString()}`;
        
        // add into array
        userList.push(userData);

        // save to local storage
        helperUtilService.saveToLocalStorage(this.usersObjectName, userList);
        
        return userData;
    }
}

// export the service (if using modules) or instantiate directly
const userRepository = new UserRepositoryService();