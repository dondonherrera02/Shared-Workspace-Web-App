/**
* @name: Co-Space Web App - Enums
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const RoleEnum = Object.freeze({
    WORKER: 'co-worker',
    OWNER: 'workspace-owner',
    
    isValidRole(role) {
        return Object.values(this).includes(role);
    }
});


module.exports = {
    RoleEnum
};