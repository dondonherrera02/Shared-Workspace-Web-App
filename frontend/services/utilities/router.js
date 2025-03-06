/**
* @name: Co-Space Web App - Router Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

class RouterUtilService {

    redirectIndex(){
        window.location.assign('/index.html');
    }

    redirectToOwnerWorkspacePage(propertyId){
        window.location.assign(`/pages/owner-ws-dashboard.html?propertyId=${propertyId}`);
    }

    // REDIRECT page
    redirectPage(userData) {
        const baseUrl = '/pages/';

        // define the routes
        const routes = {
            'workspace-owner': enumService.ownerRoute,
            'co-worker': enumService.workerRoute,
            'default': enumService.defaultRoute // fallback route for unrecognized roles
        }

        // choose the correct route based on userRole
        const targetPage = routes[userData.role] || routes['default'];

        // redirect to the target page using window.location.assign
        window.location.assign(baseUrl + targetPage);       
    }
}

// export the service (if using modules) or instantiate directly
const routerService = new RouterUtilService();