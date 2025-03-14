/**
* @name: Co-Space Web App - Owner JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { routerService } from '../services/utilities/router.js';
import { commonHelperService } from '../services/utilities/common-helper.js';



// onclick event handlers
function getPropertyWorkspaces(propertyId){
    alert(propertyId);
    commonHelperService.displayWorkspaceCards(propertyId);
    routerService.redirectToOwnerWorkspacePage(propertyId);
 }