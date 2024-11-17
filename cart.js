let iconCart = document.querySelector('.cart-icon');
let closeBtn = document.querySelector('.cartTab .close');
let body = document.querySelector('body');

iconCart.addEventListener('click', () => {
    body.classList.add('activeTabCart');
});
closeBtn.addEventListener('click', () => {
    body.classList.remove('activeTabCart');
});