/**
* @name: Co-Space Web App - Common Helper Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Generic function
class CommonHelperService {

    // USER regisration validation
    validateUserData(userData) {

        // full name validation
        if (userData.fullname.length < 5) {
            throw new Error('Fullname must be atleast 3 characters long');
        }

        // phone number validation
        // https://www.geeksforgeeks.org/how-to-validate-phone-numbers-using-javascript-with-regex/
        const phoneNumberPattern = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
        if (!phoneNumberPattern.test(userData.phone)) {
            throw new Error('Invalid phone number');
        }

        // email validation
        // i got this idea from: https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            throw new Error('Invalid email address.');
        }

        // password validation
        // https://www.geeksforgeeks.org/password-validation-form-using-javascript/
        if (userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long')
        }

        const upperCasePattern = /[A-Z]/g;
        if (!userData.password.match(upperCasePattern)) {
            throw new Error('Password must be atleast one uppecase letter')
        }

        const lowerCasePattern = /[a-z]/g;
        if (!userData.password.match(lowerCasePattern)) {
            throw new Error('Password must be atleast one lowercase letter')
        }

        const numbersPattern = /[0-9]/g;
        if (!userData.password.match(numbersPattern)) {
            throw new Error('Password must be atleast one number')
        }

        // role validation
        // https://www.w3schools.com/Jsref/jsref_includes.asp
        if (![enumService.coWorkerRole, enumService.workspaceOwnerRole].includes(userData.role)) {
            throw new Error('Invalid role')
        }
    }

    // FORMAT name to Pascal Case
    formatTitle(name) {
        return name
            .split(' ') // Split the name into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
            .join(' '); // Join the words back together without spaces
    }


}

// export the service (if using modules) or instantiate directly
const commonHelperService = new CommonHelperService();