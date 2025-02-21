/**
* @name: Co-Space Web App - Mock Auth Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

class AuthRepositoryService {

    login(email, password){
        
        // get all registered users
        const userList = databaseHelperService.getList(enumService.usersObjectName); // JSON Parsed Array
        
        // get the credentials
        const requestor = userList.find(user => user.email === email && user.password === password);

        // validate if the user is registered
        if(requestor){
            // get and set current user
            let currentUser = databaseHelperService.getOne(enumService.currentUserObjectName);
            currentUser = requestor;
            
            // update the current user
            databaseHelperService.saveToLocalStorage(enumService.currentUserObjectName, currentUser);
            return currentUser;
        }

        throw new Error('Invalid credentials');
    }

    logout() {
        let currentUser = databaseHelperService.getOne(enumService.currentUserObjectName);
        currentUser = null;
        databaseHelperService.deleteOne(enumService.currentUserObjectName);
    }
}

// export the service (if using modules) or instantiate directly
const authRepository = new AuthRepositoryService();