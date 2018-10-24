/* eslint-env browser */

/* global

  filterValidationError,
  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  insertHTML,
  appendDOM,
  reDirect,
  parseJwt,
  baseUrl,

*/


const loginUrl = `${baseUrl}/api/v1/auth/login`;

const reDirectLogin = role => (
  (role === 'user')
    ? reDirect('./user_food_items.html')
    : reDirect('./add_meal.html')
);

const setUserData = (token) => {
  localStorage.setItem('userToken', token);
  localStorage.setItem('login', true);
  const { role, userId } = parseJwt(token);
  localStorage.setItem('role', role);
  localStorage.setItem('userId', userId);
};

const processLogin = (obj) => {
  displayElement('alert', 'none');
  displayElement('loadingModal', 'none');
  if (obj.data) {
    setUserData(obj.data.token);
    const { role } = parseJwt(obj.data.token);
    reDirectLogin(role);
  } else {
    // get status
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
      case 404:
      case 400:
        errMess = obj.error.description;
        break;
      default:
        errMess = 'Oops! Something went wrong. Try again later';
    }
    displayErrorAlert(errMess);
  }
};

const login = (event) => { // eslint-disable-line no-unused-vars
  if (event) { event.preventDefault(); }
  // get user data
  const userData = {
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
  fetch(loginUrl, postData)
    .then(readResponseAsJSON)
    .then(processLogin)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
};
