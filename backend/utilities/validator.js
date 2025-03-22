/**
* @name: Co-Space Web App - Validator
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://stackoverflow.com/questions/60737672/email-regex-pattern-in-nodejs, https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript

const ValidateEmail = (email) => {
    // email regex pattern
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

const ValidatePhone = (phone) => {
    // phone number regex pattern (e.g., +1-123-456-7890 or (123) 456-7890)
    const phoneRegex = /^(\+?\d{1,4}[\s\-]?)?(\(?\d{1,4}\)?[\s\-]?)?(\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4})$/;
    return phoneRegex.test(phone);
};

const ValidateRequiredField = (field, fieldName) => {
    if (!field) {
        return { message: `${fieldName} is required.` };
    }
    return null;
};

module.exports = {
    ValidateEmail, 
    ValidatePhone,
    ValidateRequiredField
};
