/**
* @name: Co-Space Web App - Alertiy Service JS 
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://alertifyjs.com/alert.html

// to display the alert at top-right
alertify.set('notifier', 'position', 'top-right');

class AlertifyService {
    confirm(message, okCallback) {
      alertify.confirm(message, function(e) {
        if (e) {
          okCallback(); // execute the callback if OK is pressed
        } else {
        }
      });
    }
  
    success(message) {
      alertify.success(message);
    }
  
    error(message) {
      alertify.error(message);
    }
  
    warning(message) {
      alertify.warning(message);
    }
  
    message(message) {
      alertify.message(message);
    }
  }
  
  // export the service (if using modules) or instantiate directly
  const alertifyService = new AlertifyService();
  