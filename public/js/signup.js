/* eslint-env browser */

/* global

  displaySuccessAlert,
  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  loadCart
  baseUrl
  cart

*/

const signupUrl = `${baseUrl}/api/v1/auth/signup`;


const processSignup = (obj) => {
  if (obj.data) {
    displayElement('loadingModal', 'none');
    displaySuccessAlert('Account created, kindly login');
  } else {
    const { status } = obj.error;
    let errMess;
    let fields;
    switch (status) {
      case 422:
        fields = `${JSON.stringify(obj.error.fields).replace(/[{}]/g, '')}</br>`;
        errMess = `${obj.error.description} </br> ${fields.replace(/[,]/g, ' </br>')}`;
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
    email: document.getElementById('signup-email').value,
    password: document.getElementById('signup-password').value
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