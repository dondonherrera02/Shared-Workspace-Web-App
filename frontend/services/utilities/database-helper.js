/**
* @name: Co-Space Web App - Database Helper
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

class DatabaseHelperService {

    // POST to local storage
    async saveToLocalStorage(objectName, data) {
        try {
            const response = await fetch(`http://localhost:8081/data/${objectName}`, {
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
            const response = await fetch(`http://localhost:8081/data/${objectName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                console.warn(`HTTP error getting ${objectName}! Status: ${response.status}`);
                return [];
            }

            const data = await response.json();

            // check if this is an array and return empty array if not
            if (!Array.isArray(data)) {
                console.warn(`Expected array for ${objectName}, but got:`, typeof data);
                return [];
            }

            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    // GET one data from local storage
    async getOne(objectName) {
        try {
            const response = await fetch(`http://localhost:8081/data/user/${objectName}`, {
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

    // DELETE item - local storage
    async deleteOne(objectName) {
        try {
            const response = await fetch(`http://localhost:8081/data/${objectName}`, {
                method: "DELETE",
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
}

// export the service
export const databaseHelperService = new DatabaseHelperService();
