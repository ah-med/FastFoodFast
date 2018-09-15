function toggleModal(id) {
    // get the modal element by id
    var modalClassName = document.getElementById(id).className;

    // replace based on status
    modalClassName = (modalClassName.indexOf('show') === -1) ? modalClassName.replace(" hide", " show") : 
    modalClassName.replace(" show", " hide");

    document.getElementById(id).className = modalClassName;
}

const addToClassList = (id, className) => {
  const element = document.getElementById(id);
  element.classList.add(className);
}
const removeFromClassList = (id, className) => {
  const element = document.getElementById(id);
  element.classList.remove(className);
}

const fixOnScroll = (id) => {
  const element = document.getElementById(id);
  const elementOffsetTop = element.offsetTop;

  if (window.pageYOffset > elementOffsetTop) {
    addToClassList(id, 'fixed');
  } else {
    removeFromClassList(id, 'fixed');
  }
}

window.onscroll = () => { fixOnScroll('header') };
