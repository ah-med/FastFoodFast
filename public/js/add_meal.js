/* eslint-env browser */

/* global

  filterValidationError
  displaySuccessAlert,
  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  insertHTML,
  appendDOM,
  reDirect,
  baseUrl,
  token

*/

const confirmAdmin = () => {
  const login = localStorage.getItem('login');
  const userToken = localStorage.getItem('userToken');
  const role = localStorage.getItem('role');
  return (login && userToken && role === 'admin');
};

const processResponse = (response) => {
  if (!response.error) {
    displaySuccessAlert(response.message);
  } else {
    const { error } = response;
    const { description } = error;
    const errorCode = error.status;
    const { fields } = error;
    let errMess;
    let fieldsError;
    insertHTML('error-fields', '');
    switch (errorCode) {
      case 401:
        errMess = `${description}</br> Please Login`;
        break;
      case 403:
        errMess = 'Your login session expired </br> Please Login';
        break;
      case 422:
        fieldsError = filterValidationError(fields);
        appendDOM('error-fields', fieldsError);
        errMess = 'Error';
        break;
      case 409:
        errMess = description;
        break;
      default:
        errMess = 'something unusual happened, pls try later';
        break;
    }
    displayErrorAlert(errMess);
  }
};

const validateResponse = (response) => {
  displayElement('alert', 'none');
  displayElement('loadingModal', 'none');
  processResponse(response);
};

const addMealRequest = (pathToAddMeal, data) => {
  const postData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data)
  };
  fetch(pathToAddMeal, postData)
    .then(readResponseAsJSON)
    .then(validateResponse)
    .catch(() => {
      displayElement('loadingModal', 'none');
      displayErrorAlert('something is not right, check your connection');
    });
};

const processAddMeal = (response) => {
  const pathToAddMeal = `${baseUrl}/api/v1/menu`;
  const imageUrl = response.secure_url;
  const mealData = {
    foodName: document.getElementById('food-name').value,
    price: document.getElementById('price').value,
    category: document.getElementById('category').value,
    imageUrl
  };
  addMealRequest(pathToAddMeal, mealData);
};

const addMeal = (event) => {
  event.preventDefault();
  displayElement('loadingModal', 'block');
  const formElement = document.getElementById('menu-form');
  const formData = new FormData(formElement);
  formData.append('upload_preset', 'zeooiv7x');
  const postData = {
    method: 'POST',
    body: formData
  };
  // fetch request
  fetch('https://api.cloudinary.com/v1_1/ah-med/image/upload', postData)
    .then(readResponseAsJSON)
    .then(processAddMeal)
    .catch(() => {
      displayElement('loadingModal', 'none');
      displayErrorAlert('something is not right, check your internet connection');
    });
};

const displayFile = (input) => {
  if (input.target.files && input.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('uploaded').setAttribute('src', event.target.result);
    };
    reader.readAsDataURL(input.target.files[0]);
  }
};

const isAdmin = confirmAdmin();

if (!isAdmin) {
  reDirect('./login.html');
}

window.addEventListener('load', () => {
  document.getElementById('upload-image').addEventListener('change', displayFile);
  document.getElementById('menu-form').addEventListener('submit', addMeal);
});
