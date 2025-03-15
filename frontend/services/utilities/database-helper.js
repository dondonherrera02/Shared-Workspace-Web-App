/**
* @name: Co-Space Web App - Database Helper
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const BASE_URL = "http://localhost:";
const PORT = 8080;
//const URL = `${BASE_URL}${PORT}`; // For Local Testing

const URL = `https://co-space.onrender.com`; // API Base URL - Production Environment using Render Site

class DatabaseHelperService {

    // POST to local storage
    async saveToLocalStorage(objectName, data) {
        try {
            const response = await fetch(`${URL}/data/${objectName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // GET list from local storage
    async getList(objectName) {
        try {
            const response = await fetch(`${URL}/data/${objectName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    // GET one data from local storage
    async getOne(objectName) {
        try {
            const response = await fetch(`${URL}/data/user/${objectName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // POST - to update the current user to null
    async deleteOne(objectName) {
        try {
            const response = await fetch(`${URL}/data/${objectName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}

// export the service
export const databaseHelperService = new DatabaseHelperService();
