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
            }
        } else {
            cart[position].quantity = quantity;
        }
        iconCart.querySelector('span').innerHTML = cart.length;
        renderCart();
    }

    const renderCart = () => {
        let listCart = document.querySelector('.listCart');
        listCart.innerHTML = null;
        cart.forEach(item => {
            let product = products.find(product => product.id == item.product_id);
            let productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">GHC ${product.price}</p>
                <p class="quantity">Quantity: ${item.quantity}</p>
            `;
            listCart.appendChild(productItem);
        });
    }

    // button click event
    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let productId = buttonClick.dataset.id;
        let position = cart.findIndex(item => item.id == productId);
        let quantity = position < 0 ? 0 : cart[position].quantity;

        if (buttonClick.classList.contains('addToCart')) {
            quantity++;
            setProductInCart(productId, quantity, position);
        }
    });
}

export default cart;