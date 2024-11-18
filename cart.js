import products from "./products.js";

const cart = () => {
    let iconCart = document.querySelector('.cart-icon');
    let closeBtn = document.querySelector('.cartTab .close');
    let body = document.querySelector('body');
    let cart = [];

    iconCart.addEventListener('click', () => {
        body.classList.add('activeTabCart');
    });
    closeBtn.addEventListener('click', () => {
        body.classList.remove('activeTabCart');
    });

    const setProductInCart = (productId, quantity, position) => {
        if (quantity > 0) {
            if (position < 0) {
                cart.push({
                    product_id: productId,
                    quantity: quantity
                });
            } else {
                cart[position].quantity = quantity;
            }
        } else {
            cart.splice(position, 1);
        }
        renderCart();
    }

    const renderCart = () => {
        let listCart = document.querySelector('.listCart');
        let totalHTML = document.querySelector('.cart-icon span');
        let totalQuantity = 0;
        listCart.innerHTML = null;
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let product = products.findIndex(product => product.id == item.product_id);
            let info = products[product];
            let productItem = document.createElement('div');
            productItem.classList.add('item');
            productItem.innerHTML = `
                <div class='image'>
                    <img src="${info.image}" alt="${info.name}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">GHC ${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="decrease" data-id="${info.id}">-</span>
                    <span>${item.quantity}</span>
                    <span class="increase" data-id="${info.id}">+</span>
                </div>
            `;
            listCart.appendChild(productItem);
        });
        totalHTML.innerHTML = totalQuantity;
    }

    // button click event
    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let productId = buttonClick.dataset.id;
        let position = cart.findIndex((item) => item.product_id == productId);
        let quantity = position < 0 ? 0 : cart[position].quantity;

        if (buttonClick.classList.contains('addToCart') || buttonClick.classList.contains('increase')) {
            quantity++;
            setProductInCart(productId, quantity, position);
        } else if (buttonClick.classList.contains('decrease')) {
            quantity--;
            setProductInCart(productId, quantity, position);
        } 
    });
}

export default cart;