/**
* @name: Co-Space Web App - Owner JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// enabled and disabled save property button in property form
const propertyForm = document.getElementById('propertyForm');
const savePropertyButton = document.getElementById('saveProperty');

propertyForm.addEventListener('input', () => {
  // check if all required fields are filled
  const allFieldsFilled = Array.from(propertyForm.elements)
    .every(input => input.required ? input.value.trim() !== '' : true);
  
  // enable or disable the save button based on field validation
  savePropertyButton.disabled = !allFieldsFilled;

  // add or remove the 'ready-to-save' class based on form validation
  if (allFieldsFilled) {
    savePropertyButton.classList.add('btn-primary');
  } else {
    savePropertyButton.classList.remove('btn-primary');
  }
});
