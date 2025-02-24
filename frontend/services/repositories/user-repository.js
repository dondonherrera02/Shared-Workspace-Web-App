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
        userData.id = `${enumService.coSpacePreIdKey}${Date.now().toString()}`;
        
        // add into array
        userList.push(userData);

        // save to local storage
        databaseHelperService.saveToLocalStorage(enumService.users, userList);
        
        return userData;
    }
}

// export the service (if using modules) or instantiate directly
const userRepository = new UserRepositoryService();