/**
* @name: Co-Space Web App - Common Helper Utility
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

import { enumService } from '../utilities/enum.js';

// Generic function
class UserHelperService {

    // USER regisration validation
    validateUserData(userData) {

        // full name validation
        if (userData.fullName.length < 5) {
            throw new Error('Fullname must be atleast 5 characters long');
        }

        // phone number validation
        // https://www.geeksforgeeks.org/how-to-validate-phone-numbers-using-javascript-with-regex/
        const phoneNumberPattern = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
        if (!phoneNumberPattern.test(userData.phone)) {
            throw new Error('Invalid phone number');
        }

        // email validation
        // i got this idea from: https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            throw new Error('Invalid email address.');
        }

        // password validation
        // https://www.geeksforgeeks.org/password-validation-form-using-javascript/
        if (userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long')
        }

        const upperCasePattern = /[A-Z]/g;
        if (!userData.password.match(upperCasePattern)) {
            throw new Error('Password must be atleast one uppecase letter')
        }

        const lowerCasePattern = /[a-z]/g;
        if (!userData.password.match(lowerCasePattern)) {
            throw new Error('Password must be atleast one lowercase letter')
        }

        const numbersPattern = /[0-9]/g;
        if (!userData.password.match(numbersPattern)) {
            throw new Error('Password must be atleast one number')
        }

        // role validation
        // https://www.w3schools.com/Jsref/jsref_includes.asp
        if (![enumService.coWorker, enumService.workspaceOwner].includes(userData.role)) {
            throw new Error('Invalid role')
        }
    }

    getEditProfileModal() {
        // check if the modal already exists to prevent duplicate modals
        if ($('#editProfileModal').length === 0) {
            const editProfileModalHTML = `
                <!-- Edit Profile Info Modal -->
                <div class="modal fade" id="editProfileModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Co-Space Profile</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="profileForm">
                                    <input type="hidden" id="role" name="role">
                                    <div class="mb-3">
                                        <label class="form-label">Full name:</label>
                                        <input type="text" class="form-control" placeholder="Full Name" id="fullname" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Phone number:</label>
                                        <input type="phone" class="form-control" placeholder="Phone number" id="phone" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email:</label>
                                        <input type="email" class="form-control" placeholder="Email" id="email" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password:</label>
                                        <input type="password" class="form-control" placeholder="Password" id="password" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary" id="saveProfile" onclick="saveProfile()">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // append the modal HTML to the body
            $('body').append(editProfileModalHTML);
        }
    }

}

// export the service
export const userHelperService = new UserHelperService();