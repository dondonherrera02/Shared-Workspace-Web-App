/**
* @name: Co-Space Web App - Router Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { enumService } from '../utilities/enum.js';

class RouterUtilService {

    redirectIndex(){
        window.location.assign('/index.html');
    }

    redirectToWorkspacePage(propertyId, isOwner) {
        const page = isOwner ? "owner-ws-dashboard" : "co-worker-space";
        if (propertyId) {
            window.location.assign(`/pages/${page}.html?propertyId=${propertyId}`);
        }else{
            window.location.assign(`/pages/${page}.html`);
        }
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

// export the service
export const routerService = new RouterUtilService();