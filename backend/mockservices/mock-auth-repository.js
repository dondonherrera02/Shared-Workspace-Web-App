/**
* @name: Co-Space Web App - Mock Auth Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

class AuthRepositoryService {

    // instance properties - shared values across all instances
    currentUserObjectName = 'currentUser';
    usersObjectName = 'users';

    login(email, password){
        // get all registered users
        const userList = helperUtilService.getList(this.usersObjectName); // JSON Parsed Array
        
        // get the credentials
        const requestor = userList.find(user => user.email === email && user.password === password);

        // validate if the user is registered
        if(requestor){
            // get and set current user
            let currentUser = helperUtilService.getOne(this.currentUserObjectName);
            currentUser = requestor;
            
            // update the current user
            helperUtilService.saveToLocalStorage(this.currentUserObjectName, currentUser);
            return currentUser;
        }

        throw new Error('Invalid credentials');
    }

    logout() {
        const currentUser = helperUtilService.getOne(this.currentUserObjectName);
        currentUser = null;
        helperUtilService.deleteOne(this.currentUserObjectName);
    }
}

// export the service (if using modules) or instantiate directly
const authRepository = new AuthRepositoryService();