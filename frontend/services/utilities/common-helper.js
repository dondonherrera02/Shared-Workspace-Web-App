/**
* @name: Co-Space Web App - Common Helper Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/
// Generic function
class CommonHelperService {

    // FORMAT name to Pascal Case
    formatTitle(name) {
        return name
            .split(' ') // Split the name into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
            .join(' '); // Join the words back together without spaces
    }

    // FORMAT date string
    // https://www.freecodecamp.org/news/how-to-format-a-date-with-javascript-date-formatting-in-js/
    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
        });
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Manila'
        });
    }
    
}

// export the service
export const commonHelperService = new CommonHelperService();