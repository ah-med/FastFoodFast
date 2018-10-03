/* eslint-env browser */

/* global

  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  reDirect,
  setCartIcon,
  baseUrl,
  cart

*/

const loginUrl = `${baseUrl}/api/v1/auth/login`;

const reDirectLogin = role => (
  (role === 'user')
    ? reDirect('./user_food_items.html')
    : reDirect('./add_meal.html')
);

const processLogin = (obj) => {
  let fields;
  displayElement('alert', 'none');
  displayElement('loadingModal', 'none');
  if (obj.data) {
    localStorage.setItem('userToken', obj.data.token);
    localStorage.setItem('login', true);
    localStorage.setItem('role', obj.data.role);
    reDirectLogin(obj.data.role);
  } else {
    // get status
    const { status } = obj.error;
    let errMess;
    switch (status) {
      case 422:
        fields = `${JSON.stringify(obj.error.fields).replace(/[{}]/g, '')}</br>`;
        errMess = `${obj.error.description} </br> ${fields.replace(/[,]/g, ' </br> ')}`;
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

const login = (event) => {
  event.preventDefault();
  // get user data
  const userData = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
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

window.addEventListener('load', () => {
  setCartIcon(cart);
  document.getElementById('login-form').addEventListener('submit', login);
});
