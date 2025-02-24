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
    workerRoute = 'owner-dashboard.html';
    defaultRoute = 'notfound.html';

    // user identifier pre-key
    coSpacePreIdKey = 'co-space-';

    // object names
    currentUser = 'currentUser';
    users = 'users';
    properties = 'properties';
}

// export the service (if using modules) or instantiate directly
const enumService = new EnumService();