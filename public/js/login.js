/* eslint-env browser */

/* global

  setCartIcon,
  login,
  cart

*/

window.addEventListener('load', () => {
  setCartIcon(cart);
  document.getElementById('login-form').addEventListener('submit', login);
});
