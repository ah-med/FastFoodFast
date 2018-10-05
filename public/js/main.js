/* eslint-env browser */
/* eslint-disable no-unused-vars */


const baseUrl = 'https://afastfood-app.herokuapp.com';

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

const logout = () => {
  localStorage.setItem('userToken', undefined);
  localStorage.setItem('login', false);
  localStorage.setItem('role', undefined);
  reDirect('./login.html');
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

const confirmUser = () => {
  const login = localStorage.getItem('login');
  const userToken = localStorage.getItem('userToken');
  const role = localStorage.getItem('role');
  return (login && userToken && role === 'user');
};

const confirmAdmin = () => {
  const login = localStorage.getItem('login');
  const userToken = localStorage.getItem('userToken');
  const role = localStorage.getItem('role');
  return (login && userToken && role === 'admin');
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
  const addCart = '<div class="add-cart"><button id="minus" onclick="removeItemFromCart(event)" class="minus click">-</button><input type="number" min="0" max="30" step="1" value="0"> <button id="plus" onclick="addItemToCart(event)" class="plus click">+</button></div>';
  const a = '<a class="action-btn" href="Javascript:void(0);" onclick="orderNow(event)">Order Now</a>';

  const nodes = ['img', 'h4', 'span', 'input'],
    [img, h4, span] = createManyNodes(nodes),
    [foodItemCard, action] = createManyNodes('div', 3);

  action.innerHTML = addCart + a;
  action.setAttribute('class', 'action');
  action.setAttribute('id', item.food_id);
  span.setAttribute('price', item.price);
  span.innerHTML = `&#8358;${item.price}`;
  h4.innerHTML = item.food_name;
  img.setAttribute('src', item.image_url);
  img.setAttribute('alt', item.food_name);
  foodItemCard.setAttribute('class', 'food-item-card');
  foodItemCard.setAttribute('align', 'center');
  appendManyNodes(foodItemCard, [img, h4, span, action]);
  return foodItemCard;
};

const appendUpdateAction = (status, action, actionObj) => {
  const { complete, process, cancel } = actionObj;
  const noAction = createText('No Action Required');
  switch (status) {
    case 'New':
      // you can only Process or Cancel an order that is New
      appendManyNodes(action, [process, cancel]);
      break;
    case 'Processing':
      // you can only Cancel or Complete a Processing order status
      appendManyNodes(action, [complete, cancel]);
      break;
    case 'Completed':
    case 'Cancelled':
      //  you cannot update a Cancelled or Completed order
      append(action, noAction);
      break;
    default:
      break;
  }
  return action;
};

const appendTextRight = (status, textRight) => {
  const newOrderIcon = '<span class="status status-new">&#9899;</span>',
    completeIcon = '<span class="status status-complete">&#9899;</span>',
    cancelIcon = '<span class="status status-decline">&#9899;</span>',
    processingIcon = '<span class="status status-approve">&#9899;</span>';
  const textNode = createText(status);
  switch (status) {
    case 'New':
      textRight.innerHTML = newOrderIcon;
      break;
    case 'Processing':
      textRight.innerHTML = processingIcon;
      break;
    case 'Completed':
      textRight.innerHTML = completeIcon;
      break;
    case 'Cancelled':
      textRight.innerHTML = cancelIcon;
      break;
    default:
      break;
  }
  append(textRight, textNode);
  return textRight;
};

const createOrderItems = (item, role) => {
  const view = '<button class="action click" onclick="viewOrder(event)">view</button>';
  const img = createNode('img'),
    [
      orderCard, top,
      bottom, action,
      bottomLeft, bottomRight,
      textRight, overlay
    ] = createManyNodes('div', 8),
    [totalAmount, noOfItems] = createManyNodes('span', 2),
    [complete, process, cancel] = createManyNodes('button', 3);

  orderCard.setAttribute('class', 'order-card food-item-card');
  top.setAttribute('class', 'top');
  bottom.setAttribute('class', 'bottom');
  action.setAttribute('class', 'action');
  overlay.setAttribute('class', 'overlay');
  overlay.setAttribute('order_id', item.order_id);
  overlay.innerHTML = view;

  process.setAttribute('class', 'action-btn btn-approve click');
  process.setAttribute('onclick', 'updateOrder(event)');
  process.setAttribute('order_id', item.order_id);
  process.innerText = 'Process';
  cancel.setAttribute('class', 'action-btn btn-decline click');
  cancel.setAttribute('onclick', 'updateOrder(event)');
  cancel.setAttribute('order_id', item.order_id);
  cancel.innerText = 'Cancel';
  complete.setAttribute('class', 'action-btn click');
  complete.setAttribute('onclick', 'updateOrder(event)');
  complete.setAttribute('order_id', item.order_id);
  complete.innerText = 'Complete';
  const appendAction = appendUpdateAction(item.status, action, { complete, process, cancel });

  const statusText = createText(item.status),
    textRightAppend = appendTextRight(item.status, textRight);
  append(bottomRight, textRightAppend);
  textRight.setAttribute('class', 'text-right');

  const noOfItemsText = createText(`${item.order_items.length} items`),
    totalAmountText = createText(item.total_amount);
  totalAmount.innerHTML = '&#8358; ';
  append(totalAmount, totalAmountText);
  append(noOfItems, noOfItemsText);

  bottomLeft.setAttribute('class', 'section text-left');
  bottomRight.setAttribute('class', 'section text-right');
  appendManyNodes(bottomLeft, [totalAmount, noOfItems]);

  img.setAttribute('src', './images/food/pastries-food.jpg');
  appendManyNodes(top, [img, overlay]);

  appendManyNodes(bottom, [bottomLeft, bottomRight]);

  if (role === 'user') {
    appendManyNodes(orderCard, [top, bottom]);
  } else {
    appendManyNodes(orderCard, [top, bottom, action]);
  }
  return orderCard;
};
