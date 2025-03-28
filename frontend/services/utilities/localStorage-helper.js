/**
* @name: Co-Space Web App - Local Storage Helper
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

class LocalStorageHelperService {

    // save to local Storage
    saveToLocalStorage(objectName, data) {
        localStorage.setItem(objectName, JSON.stringify(data));
    }

    // GET list from local storage
    getList(objectName) {
        try {
            // ensure it defaults to an array []
            const dataList = JSON.parse(localStorage.getItem(objectName)) || [];
            return dataList;
        } catch (error) {
            console.error(`Error: GET List of ${objectName} - JSON parse: `, error);
            return [];
        }
    }

    // GET one data from local storage
    getOne(objectName) {
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
    deleteOne(objectName) {
        localStorage.removeItem(objectName);
    }

    // RESET item - local storage
    reset() {
        localStorage.clear();
    }
}

// export the service
export const localStorageService = new LocalStorageHelperService();