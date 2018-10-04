const renderOrders = (data) => {
  console.log(data);
  data.forEach((element) => {
    const order = createOrderItems(element);
    appendDOM('user_orders', order);
  });
};

const processOrdersResponse = (response) => {
  if (!response.error) {
    renderOrders(response.data);
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

const isAdmin = confirmAdmin();

if (!isAdmin) {
  reDirect('./login.html');
}

window.addEventListener('load', () => {
  displayElement('loadingModal', 'block');
  const pathToResource = `${baseUrl}/api/v1/orders`;
  fetch(pathToResource, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(readResponseAsJSON)
    .then(processOrdersResponse)
    .catch((error) => {
        console.log(error)
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
});
