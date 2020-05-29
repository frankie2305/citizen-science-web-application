export { observationFormSubmit, showErrors, scrollToErrorAlert };

// observationFormSubmit - when user submits the observation form, 
//  all empty fields are removed before the model 
// `submits the remaining form data to the server
// after that all input and select fields are cleared
// e - the CustomEvent object whose detail is the model
const observationFormSubmit = e => {
    const observationForm = document.querySelector('#observation-form');
    observationForm.addEventListener('submit', event => {
        // prevent the default behavior of form submission
        event.preventDefault();

        // create a FormData instance of observationForm
        let formData = new FormData(observationForm);

        // make hidden fields in the observation form writable
        const hiddenFields = observationForm.querySelectorAll('input[type="hidden"]');
        hiddenFields.forEach(hiddenField => hiddenField.removeAttribute('readonly'));

        // remove empty fields from formData
        let emptyFields = [];
        for (let key of formData.keys()) {
            if (!formData.get(key)) {
                emptyFields.push(key);
            }
        }
        emptyFields.forEach(emptyField => formData.delete(emptyField));

        // make the 'height' & 'girth' fields positive
        //  if they are non-empty and negative
        if (formData.get('height'))
            formData.set('height', Math.abs(formData.get('height')));
        if (formData.get('girth'))
            formData.set('girth', Math.abs(formData.get('girth')));

        // let the model handle formData using add_observation()
        e.detail.add_observation(formData);
    });
}

// showErrors - shows the errors below the missing fields
//  errors - an array of errors to show
const showErrors = errors => {
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(errorField => {
        errorField.innerText = '';
    });
    errors.forEach(error => {
        const missingField = error.split(': ')[1];
        const errorField = document.querySelector(`#missing_${missingField}`);
        errorField.innerText = error;
    });
}

// scrollToErrorAlert - scrolls the error alert
//  into the user's view
const scrollToErrorAlert = () => {
    const errorAlert = document.querySelector('#error-alert');
    errorAlert.scrollIntoView();
}
