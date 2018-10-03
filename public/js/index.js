/* eslint-env browser */

/* global

  removeFromClassList,
  readResponseAsJSON,
  displayErrorAlert,
  createFoodItem,
  addToClassList,
  displayElement,
  setCartIcon,
  appendDOM,
  baseUrl,
  cart

*/

const fixOnScroll = (id) => {
  const element = document.getElementById(id);
  const elementOffsetTop = element.offsetTop;

  if (window.pageYOffset > elementOffsetTop) {
    addToClassList(id, 'fixed');
  } else {
    removeFromClassList(id, 'fixed');
  }
};

window.onscroll = () => { fixOnScroll('header'); };

const renderPopularSection = (response) => {
  const { data } = response;
  displayElement('loadingModal', 'none');
  // display four food items
  for (let i = 0; i < 4; i += 1) {
    const foodItem = createFoodItem(data[i]);
    appendDOM('food-item', foodItem);
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
