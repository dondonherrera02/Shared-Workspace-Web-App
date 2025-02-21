/**
* @name: Co-Space Web App - Enums Helper
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

class EnumService {
    // common helper
    workspaceOwnerRole = 'workspace-owner';
    coWorkerRole = 'co-worker';

    // router
    ownerRoute = 'owner-dashboard.html';
    workerRoute = 'owner-dashboard.html';
    defaultRoute = 'notfound.html';

    // user identifier pre-key
    userIdKey = 'co-space-';

    // object names
    currentUserObjectName = 'currentUser';
    usersObjectName = 'users';
}

// export the service (if using modules) or instantiate directly
const enumService = new EnumService();