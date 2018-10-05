/*

[]check if you are logged in and that you are a normal user
[]if you are not a normal user user or your token expires
            []you are redirected back to login page
[]fetch the history of that user
            []renderOrderHistory

*/

const isUser = confirmUser();

if (!isUser) {
  reDirect('./login.html');
}

const renderUserOrders = (data) => {
  data.forEach((element) => {
    const order = createOrderItems(element, role);
    appendDOM('user_orders', order);
  });
};

const processUserOrdersResponse = (response) => {
  if (!response.error) {
    renderUserOrders(response.data);
  } else {
    const { error } = response;
    const { description } = error;
    const errorCode = error.status;
    let errMess;
    switch (errorCode) {
      case 401:
        errMess = `${description}</br> Please Login`;
        break;
      case 403:
        errMess = 'Your login session expired </br> Please Login';
        break;
      case 422:
        errMess = description;
        break;
      default:
        errMess = 'something unusual happened, pls try later';
        break;
    }
    displayErrorAlert(errMess);
  }
};

window.addEventListener('load', () => {
  displayElement('loadingModal', 'block');
  const userId = localStorage.getItem('userId');
  const pathToResource = `${baseUrl}/api/v1/users/${userId}/order`;
  fetch(pathToResource, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(readResponseAsJSON)
    .then(processUserOrdersResponse)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
});
