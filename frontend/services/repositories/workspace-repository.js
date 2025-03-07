/**
* @name: Co-Space Web App - Workspace Repository - Database Layer
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.w3schools.com/jsref/prop_win_localstorage.asp 
// https://openjavascript.info/2022/06/29/save-data-to-the-browser-with-localstorage-and-sessionstorage/

class WorkspaceRepositoryService {

    // save to local storage
    saveWorkspace(workspaceData) {
        // get the current role
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner) throw new Error('Only property owners are allowed to add workspaces');

        // validate property id existence
        const propertyData = propertyRepository.getPropertyById(workspaceData.propertyId);

        if (!propertyData || propertyData.ownerId !== currentUser.id) throw new Error('Unauthorized property owner');
   
        // get the current workspace list by property id
        const workspaceList = databaseHelperService.getList(enumService.workspaces);

        // check if existing workspace by property id, type and lease term
        const existingWorkspace = workspaceList.find(workspace =>
            workspace.propertyId === workspaceData.propertyId &&
            workspace.roomNum === workspaceData.roomNum);

        if (existingWorkspace) throw new Error('Workspace already exists.');

        // set workspace identifier
        workspaceData.id = `${enumService.workspacePreIdKey}${Date.now().toString()}`;

        // set property owner identifier
        workspaceData.ownerId = currentUser.id;

        // add into workspaces list
        workspaceList.push(workspaceData);

        // save to local storage
        databaseHelperService.saveToLocalStorage(enumService.workspaces, workspaceList);

        return workspaceData;
    }

    // get all workspaces
    getWorkspaceList = () => databaseHelperService.getList(enumService.workspaces);

    // get workspace by id
    getWorkspaceById(workspaceId) {

        // get workspace list
        const workspaceList = databaseHelperService.getList(enumService.workspaces);

        // find by id
        const workspace = workspaceList.find(workspace => workspace.id === workspaceId);

        // validate
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        return workspace;
    }

    // get Workspace List by propertyId and current user id
    getWorkspaceListByPropertyId(propertyId) {

        // get the current
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // Get workspace list
        const workspaceList = databaseHelperService.getList(enumService.workspaces);

        // Find workspaces by propertyId
        const workspaces = workspaceList.filter(workspace => workspace.propertyId === propertyId && workspace.ownerId === currentUser.id);

        return workspaces;
    }

    // update workspace to local storage
    updateWorkspace(workspaceId, modifiedWorkspace) {
        // Get the current user
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // Validate if the current role is owner
        if (!currentUser || currentUser.role !== enumService.workspaceOwner) {
            throw new Error('Only property owners are allowed to edit workspaces');
        }

        // Get workspace list
        const workspaceList = databaseHelperService.getList(enumService.workspaces);

        if (!workspaceList) {
            throw new Error('Workspace list not found.');
        }

        // Find the workspace and its index
        const currentWorkspaceIndex = workspaceList.findIndex(workspace => workspace.id === workspaceId);

        // If workspace is not found, throw error
        if (currentWorkspaceIndex === -1) {
            throw new Error("Workspace not found. Unable to update workspace.");
        }

        const currentWorkspace = workspaceList[currentWorkspaceIndex];

        // Check if the user is authorized to update the workspace
        if (currentWorkspace.ownerId !== currentUser.id) {
            throw new Error("Unauthorized user. Unable to update this workspace.");
        }

        // Update current workspace with modified workspace
        workspaceList[currentWorkspaceIndex] = { ...currentWorkspace, ...modifiedWorkspace };

        // Save updated workspace list to local storage
        databaseHelperService.saveToLocalStorage(enumService.workspaces, workspaceList);

        // Return the updated workspace
        return workspaceList[currentWorkspaceIndex];
    }

    // get workspace list by current user id
    getWorkspacesByUserId(userId) {

        // get workspace list
        const workspaceList = databaseHelperService.getList(enumService.workspaces);

        // filter by current user id, returns an array of all workspaces by current user id
        const userWorkspaces = workspaceList.filter(workspace => workspace.ownerId === userId);

        return userWorkspaces;
    }

    // delete workspace
    deleteWorkspace(workspaceId) {

        // get workspace to delete
        const workspaceToDelete = this.getWorkspaceById(workspaceId);

        // get the current user
        const currentUser = databaseHelperService.getOne(enumService.currentUser);

        // check if the user is allowed to delete
        if (workspaceToDelete.ownerId !== currentUser.id) throw new Error('Unauthorized to delete this workspace.');

        // remove workspace and save it back
        let currentWorkspaces = workspaceRepository.getWorkspaceList();
        currentWorkspaces = currentWorkspaces.filter(w => w.id !== workspaceId);
        databaseHelperService.saveToLocalStorage(enumService.workspaces, currentWorkspaces);

        return workspaceToDelete;
    }

}

// export the service (if using modules) or instantiate directly
const workspaceRepository = new WorkspaceRepositoryService();