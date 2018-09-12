function toggleModal(id) {
    // get the modal element by id
    var modalClassName = document.getElementById(id).className;

    // replace based on status
    modalClassName = (modalClassName.indexOf('show') === -1) ? modalClassName.replace(" hide", " show") : 
    modalClassName.replace(" show", " hide");

    document.getElementById(id).className = modalClassName;
}