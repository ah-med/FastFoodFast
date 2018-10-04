/* eslint-env browser */
/* eslint-disable no-unused-vars */


const baseUrl = 'http://localhost:9000';

const token = localStorage.getItem('userToken');

const readResponseAsJSON = response => response.json();

const createNode = element => document.createElement(element);

const append = (parent, el) => parent.appendChild(el);

const createText = text => document.createTextNode(text);

const reDirect = (url) => {
  window.location.href = (url);
};

const displayElement = (el, style) => {
  document.getElementById(el).style.display = style;
};

const addToClassList = (id, className) => {
  const element = document.getElementById(id);
  element.classList.add(className);
};

const removeFromClassList = (id, className) => {
  const element = document.getElementById(id);
  element.classList.remove(className);
};

const appendDOM = (id, element) => {
  const domElement = document.getElementById(id);
  append(domElement, element);
};

const insertHTML = (id, newHTML) => {
  document.getElementById(id).innerHTML = newHTML;
};

const setCartIcon = (cart) => {
  const noOfItems = Object.keys(cart.items).length;
  insertHTML('cart', noOfItems);
};

const appendManyNodes = (node, appendArray) => {
  appendArray.forEach((element) => {
    append(node, element);
  });
};

const toggleModal = (id) => {
  let modalClassName = document.getElementById(id).className;
  modalClassName = (modalClassName.indexOf('show') === -1) ? modalClassName.replace(' hide', ' show')
    : modalClassName.replace(' show', ' hide');
  document.getElementById(id).className = modalClassName;
};

const displayLoader = () => {
  displayElement('loadingModal', 'block');
  setTimeout(() => {
    displayElement('loadingModal', 'none');
  }, 15000);
};

const displayAlert = (text) => {
  displayElement('loadingModal', 'none');
  displayElement('alert', 'block');
  insertHTML('error-text', text);
};
const displayErrorAlert = (text) => {
  displayAlert(text);
  addToClassList('alert-element', 'error-alert');
  removeFromClassList('alert-element', 'warning-alert');
  removeFromClassList('alert-element', 'success-alert');
};

const displaySuccessAlert = (text) => {
  displayAlert(text);
  addToClassList('alert-element', 'success-alert');
  removeFromClassList('alert-element', 'error-alert');
  removeFromClassList('alert-element', 'warning-alert');
};

const displayWarningAlert = (text) => {
  displayAlert(text);
  addToClassList('alert-element', 'warning-alert');
  removeFromClassList('alert-element', 'error-alert');
  removeFromClassList('alert-element', 'success-alert');
};

const filterValidationError = (errorObject) => {
  const ul = createNode('ul');
  const errorFields = Object.values(errorObject);
  const errorList = errorFields.map((element) => {
    const li = createNode('li'),
      textNode = createText(element);
    append(li, textNode);
    return li;
  });
  appendManyNodes(ul, errorList);
  return ul;
};

const createManyNodes = (val, noOfNodes) => {
  const nodesArray = [];
  if (Array.isArray(val)) {
    val.forEach((element) => {
      nodesArray.push(createNode(element));
    });
    return nodesArray;
  }
  if (typeof val === 'string' && noOfNodes && typeof noOfNodes === 'number') {
    for (let i = 0; i <= noOfNodes; i += 1) {
      nodesArray.push(createNode(val));
    }
    return nodesArray;
  }
};

const fixOnScroll = (id) => {
  const element = document.getElementById(id);
  const elementOffsetTop = element.offsetTop;

  if (window.pageYOffset > elementOffsetTop) {
    addToClassList(id, 'fixed');
  } else {
    removeFromClassList(id, 'fixed');
  }
};

const createFoodItem = (item) => {
  const addCart = '<div class="add-cart"><button id="minus" class="click">-</button><input type="number" min="0" max="30" step="1" value="0"> <button id="plus" class="click">+</button></div>';
  const a = '<a class="action-btn" href="Javascript:void(0);" onclick="toggleModal(\'checkoutModal\')">Order Now</a>';

  const nodes = ['img', 'h4', 'span', 'input'],
    [img, h4, span] = createManyNodes(nodes),
    [foodItemCard, action] = createManyNodes('div', 3);

  action.innerHTML = addCart + a;
  action.setAttribute('class', 'action');
  span.innerHTML = `&#8358;${item.price}`;
  h4.innerHTML = item.food_name;
  img.setAttribute('src', item.image_url);
  img.setAttribute('alt', item.food_name);
  foodItemCard.setAttribute('class', 'food-item-card');
  foodItemCard.setAttribute('align', 'center');
  appendManyNodes(foodItemCard, [img, h4, span, action]);
  return foodItemCard;
};
