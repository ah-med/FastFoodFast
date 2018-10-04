/* eslint-env browser */

/* global

  readResponseAsJSON,
  displayErrorAlert,
  createFoodItem,
  displayElement,
   fixOnScroll,
  setCartIcon,
  appendDOM,
  baseUrl,
  cart

*/

window.onscroll = () => { fixOnScroll('header'); };

const renderPopularSection = (response) => {
  if (response.data.length === 0) {
    displayElement('no-orders', 'block');
  } else {
    const { data } = response;
    displayElement('no-orders', 'none');
    // display four food items
    for (let i = 0; i < 4; i += 1) {
      const foodItem = createFoodItem(data[i]);
      appendDOM('food-item', foodItem);
    }
  }
};

window.addEventListener('load', () => {
  setCartIcon(cart);
  const pathToResource = `${baseUrl}/api/v1/menu`;
  fetch(pathToResource, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(readResponseAsJSON)
    .then(renderPopularSection)
    .catch(() => {
      displayErrorAlert('something is not right, check your connection');
    });
});
