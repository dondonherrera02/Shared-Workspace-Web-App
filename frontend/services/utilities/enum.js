/**
* @name: Co-Space Web App - Enums Helper
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

class EnumService {

    // customize positon
    coSpaceOwner = 'Co-Space Owner';
    coSpaceWorker = 'Co-Space Worker';

    // common helper
    workspaceOwner = 'workspace-owner';
    coWorker = 'co-worker';

    // router
    ownerRoute = 'owner-dashboard.html';
    workerRoute = 'co-worker-dashboard.html';
    defaultRoute = 'notfound.html';

    // identifier pre-key
    propertyPreIdKey = 'property-';
    workspacePreIdKey = 'workspace-';

    // object names
    currentUser = 'currentUser';
    users = 'users';
    properties = 'properties';
    workspaces = 'workspaces';

    // Workspace Types
    meetingRoom = 'Meeting Room';
    privateOffice = 'Private Office';
    desk = 'Desk';
}

// export the service (if using modules) or instantiate directly
const enumService = new EnumService();