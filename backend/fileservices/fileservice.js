/**
* @name: Co-Space Web App - File System
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const fs = require("fs");
const path = require("path");

// Directory to store the data files
const dataDirectory = path.join(__dirname, '..', "data"); 

// Ensure data directory exists
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
}

// Save data to a file (similar to saving to localStorage)
function saveToFile(objectName, data) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

// Get a list (array) from the file (similar to getting a list from localStorage)
function getList(objectName) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    
    try {
        // Read and parse the file content
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error: GET List of ${objectName} - JSON parse: `, error);
        return []; // Return an empty array if the file doesn't exist or if there's a parsing error
    }
}

// Get a single data from the file (similar to getting a single item from localStorage)
function getOne(objectName) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    
    try {
        // Read and parse the file content
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error: GET ${objectName} - JSON parse: `, error);
        return null; // Return null if there's an error or file doesn't exist
    }
}

// Delete a file (similar to deleting an item from localStorage)
function deleteOne(objectName) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    
    try {
        fs.unlinkSync(filePath); // Delete the file
    } catch (error) {
        console.error(`Error: DELETE ${objectName} - `, error);
    }
}

module.exports = {
    saveToFile,
    getList,
    getOne,
    deleteOne
};
