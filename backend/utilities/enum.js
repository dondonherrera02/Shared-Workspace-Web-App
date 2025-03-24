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

const WorkspaceTypeEnum = Object.freeze({
    MEETINGROOM: 'Meeting Room',
    PRIVATEOFFICE: 'Private Office',
    DESK: 'Desk',
    
    isValidType(type) {
        return Object.values(this).includes(type);
    }
});

const WorkspaceLeaseTermEnum = Object.freeze({
    DAY: 'Day',
    WEEK: 'Week',
    MONTH: 'Month',
    
    isValidTerm(term) {
        return Object.values(this).includes(term);
    }
});


module.exports = {
    RoleEnum,
    WorkspaceTypeEnum,
    WorkspaceLeaseTermEnum
};