/**
* @name: Co-Space Web App - Helper Utility - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Generic function
class HelperUtilService {

     // POST to local storage
     saveToLocalStorage(objectName, data) {
        localStorage.setItem(objectName, JSON.stringify(data));
    }

    // GET list from local storage
    getList(objectName){
        try {
            // ensure it defaults to an array []
            const dataList = JSON.parse(localStorage.getItem(objectName)) || [];
            return dataList;
        } catch (error) {
            console.error(`Error: GET List of ${objectName} - JSON parse: `, error);
            return[];
        }
    }

    // GET one data from local storage
    getOne(objectName){
        try {
            // ensure it defaults to null
            const data = JSON.parse(localStorage.getItem(objectName)) || null;
            return data;
        } catch (error) {
            console.error(`Error: GET ${objectName} - JSON parse: `, error);
            return null;
        }
    }

    // DELETE item - local storage
    deleteOne(objectName){
        localStorage.removeItem(objectName);
    }

    // USER regisration validation
    validateUserData(userData) {

        // full name validation
        if(userData.fullname.length < 5){
            throw new Error('Fullname must be atleast 3 characters long');
        }
    
        // email validation
        // i got this idea from: https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(userData.email)){
            throw new Error('Invalid email address.');
        }
    
        // password validation
        // https://www.geeksforgeeks.org/password-validation-form-using-javascript/
        if(userData.password.length < 8){
            throw new Error('Password must be at least 8 characters long')
        }
    
        const upperCasePattern = /[A-Z]/g;
        if(!userData.password.match(upperCasePattern)) {
            throw new Error('Password must be atleast one uppecase letter')
        }
    
        const lowerCasePattern = /[a-z]/g;
        if(!userData.password.match(lowerCasePattern)) {
            throw new Error('Password must be atleast one lowercase letter')
        }
    
        const numbersPattern = /[0-9]/g;
        if(!userData.password.match(numbersPattern)) {
            throw new Error('Password must be atleast one number')
        }
    
        // role validation
        // https://www.w3schools.com/Jsref/jsref_includes.asp
        if(!['co-worker', 'workspace-owner'].includes(userData.role)) {
            throw new Error('Invalid role')
        }
    }
    
    // Format name to Pascal Case
    formatFullName(string) {
        return string
            .split(' ') // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
            .join(''); // Join the words back together without spaces
    }
}


// export the service (if using modules) or instantiate directly
const helperUtilService = new HelperUtilService();