/**
* @name: Co-Space Web App - File System
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const fs = require("fs");
const path = require("path");

// directory to store the data files
const dataDirectory = path.join(__dirname, '..', "data"); 

// ensure data directory exists
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
}

// save data to a file
function saveToFile(objectName, data) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// get a list (array) from the file
function getList(objectName) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    
    try {
        // read and parse the file content
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error: GET List of ${objectName} - JSON parse: `, error);
        return [];
    }
}

// get a single data from the file
function getOne(objectName) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error: GET ${objectName} - JSON parse: `, error);
        return null;
    }
}

// delete a file
function deleteOne(objectName) {
    const filePath = path.join(dataDirectory, `${objectName}.json`);
    
    try {
        fs.writeFileSync(filePath, null, 'utf8');
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