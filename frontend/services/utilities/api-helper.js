/**
* @name: Co-Space Web App - Mock Auth Repository - API Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// This API Service is a reusable component to handle POST, GET, PUT, DELETE requests.
class APIService {
    async request(url, method = "GET", data = null, token = null) {
        try {
            const headers = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const options = {
                method,
                headers
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API request error:", error);
            throw error;
        }
    }

    // GET
    async get(url, token) {
        return await this.request(url, "GET", null, token);
    }

    // POST
    async post(url, data, token) {
        return await this.request(url, "POST", data, token);
    }

    // PUT
    async put(url, data, token) {
        return await this.request(url, "PUT", data, token);
    }

    // DELETE
    async delete(url, token) {
        return await this.request(url, "DELETE", null, token);
    }
};

// export the service
export const APIHelperService = new APIService();
