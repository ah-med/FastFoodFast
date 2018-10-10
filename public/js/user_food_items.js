/* eslint-env browser */

/* global

  readResponseAsJSON,
  displayErrorAlert,
  createFoodItem,
  displayElement,
  setCartIcon,
  fixOnScroll,
  insertHTML,
  createText,
  createNode,
  appendDOM,
  baseUrl,
  append
  cart

*/

window.onscroll = () => { fixOnScroll('header'); };

const setAuthStatus = () => {
  const loginStatus = localStorage.getItem('login');
  const loginRole = localStorage.getItem('role');
  const logoutHtml = '<span class="desktop"><a id="logout" href="./login.html">Logout</a></span><a href="./login.html"><img class="mobile" src="./images/icons/account.png" alt="account"></a>';
  if (loginStatus && loginRole === 'user') { insertHTML('auth', logoutHtml); }
};

const getCategories = (arr) => {
  const categories = [];
  let i = 0;
  for (i; i < arr.length; i += 1) {
    if (!categories.includes(arr[i].category)) {
      categories.push(arr[i].category);
    }
  }
  return categories;
};

const createSection = (item) => {
  const div = createNode('div'),
    foodItems = createNode('div'),
    h4 = createNode('h4'),
    text = createText(item);
  foodItems.setAttribute('id', item);
  foodItems.setAttribute('class', 'food-items');
  append(h4, text);
  append(div, h4);
  append(div, foodItems);
  return div;
};

const createListItem = (item) => {
  const li = createNode('li'),
    a = createNode('a'),
    text = createText(item);
  a.href = `#${item}`;
  append(a, text);
  append(li, a);
  return li;
};

const renderMenu = (categories) => {
  categories.forEach((element) => {
    const listItem = createListItem(element);
    const itemsSection = createSection(element);
    appendDOM('menu-list', listItem);
    appendDOM('menu-body', itemsSection);
  });
};

const renderFoodItems = (data) => {
  data.forEach((element) => {
    const categoryId = element.category;
    const foodItem = createFoodItem(element);
    appendDOM(categoryId, foodItem);
  });
};

const processResponse = (response) => {
  displayElement('loadingModal', 'none');
  if (response.data.length === 0) {
    displayElement('no-orders', 'block');
  } else {
    displayElement('no-orders', 'none');
    const categories = getCategories(response.data);
    renderMenu(categories);
    renderFoodItems(response.data);
  }
};

window.addEventListener('load', () => {
  setCartIcon(cart);
  setAuthStatus();
  displayElement('loadingModal', 'block');
  const pathToResource = `${baseUrl}/api/v1/menu`;
  fetch(pathToResource, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(readResponseAsJSON)
    .then(processResponse)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
});
