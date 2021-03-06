/* eslint-env browser */

/* global
  filterValidationError,
  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  setCartIcon,
  insertHTML,
  appendDOM,
  baseUrl,
  login,
  cart

*/

const signupUrl = `${baseUrl}/api/v1/auth/signup`;

const processSignup = (obj) => {
  if (obj.data) {
    displayElement('loadingModal', 'none');
    login();
  } else {
    const { status } = obj.error;
    let errMess;
    let fieldsError;
    insertHTML('error-fields', '');
    switch (status) {
      case 422:
        fieldsError = filterValidationError(obj.error.fields);
        appendDOM('error-fields', fieldsError);
        errMess = 'Error';
        break;
      case 409:
        errMess = obj.error.description;
        break;
      default:
        errMess = 'Oops! Something went wrong. Try again later';
    }
    displayErrorAlert(errMess);
  }
};


const signup = (event) => {
  event.preventDefault();
  const userData = {
    firstName: document.getElementById('signup-firstname').value,
    lastName: document.getElementById('signup-lastname').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  const postData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  };

  displayElement('loadingModal', 'block');
  displayElement('alert', 'none');
  // fetch request
  fetch(signupUrl, postData)
    .then(readResponseAsJSON)
    .then(processSignup)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
};


window.addEventListener('load', () => {
  setCartIcon(cart);
  document.getElementById('signup-form').addEventListener('submit', signup);
});
