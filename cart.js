import products from "./products.js";

/**
 * Cart module that handles all shopping cart functionality
 * Manages cart state, UI updates, and localStorage persistence
 */
const cart = () => {
    // DOM elements
    let iconCart = document.querySelector('.cart-icon');
    let closeBtn = document.querySelector('.cartTab .close');
    let checkoutBtn = document.querySelector('.cartTab .checkOut');
    let body = document.querySelector('body');
    
    // Initialize cart from localStorage to persist cart data across page reloads
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Event Listeners for cart UI
    iconCart.addEventListener('click', () => {
        body.classList.add('activeTabCart');
    });
    
    closeBtn.addEventListener('click', () => {
        body.classList.remove('activeTabCart');
    });
    
    // Checkout button handler - redirects to checkout page if cart has items
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = './checkout.html';
        } else {
            alert('Your cart is empty!');
        }
    });

    /**
     * Updates cart with product quantity changes
     * @param {number} productId - ID of the product to update
     * @param {number} quantity - New quantity for the product
     * @param {number} position - Index in cart array (-1 for new items)
     */
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
        // Persist cart data and update UI
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    /**
     * Renders the cart UI with current cart items
     * Calculates totals and updates quantity display
     */
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
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    GHC ${info.price * item.quantity}
                </div>
                <div class="quantity">
                    <span class="decrease" data-id="${info.id}">-</span>
                    <span>${item.quantity}</span>
                    <span class="increase" data-id="${info.id}">+</span>
                </div>
            `;
            listCart.appendChild(productItem);
        });

        totalHTML.innerHTML = totalQuantity;

        // Add event listeners for quantity adjustment buttons
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', () => {
                let id = button.dataset.id;
                let positionItemInCart = cart.findIndex(value => value.product_id == id);
                if(positionItemInCart >= 0){
                    cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            })
        });

        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', () => {
                let id = button.dataset.id;
                let positionItemInCart = cart.findIndex(value => value.product_id == id);
                if(positionItemInCart >= 0){
                    cart[positionItemInCart].quantity = cart[positionItemInCart].quantity - 1;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            })
        });
    }

    // Add click handlers for add to cart buttons
    document.querySelectorAll('.addToCart').forEach(button => {
        button.addEventListener('click', () => {
            let id = button.dataset.id;
            let positionThisProductInCart = cart.findIndex((value) => value.product_id == id);
            if(positionThisProductInCart < 0){
                setProductInCart(id, 1, -1);
            }
        })
    });

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

    // init app
    const initApp = () => {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        renderCart();
    }
    initApp();

    // implement search feature 

    let searchBar = document.querySelector('.searchBar input');
    let listProduct = document.querySelector('.listProduct');
    let searchErrorDisplay = document.querySelector('#contentTab');
    searchBar.addEventListener('input', () => {
        let value = searchBar.value;
        let filteredProducts = products.filter((product) => product.name.toLowerCase().includes(value.toLowerCase()));
        // if search value is not found
        if (filteredProducts.length == 0) {
            searchErrorDisplay.innerHTML = `<h1 class="notFound">Sorry, "${value}" does not match any product.<br>Please try something else.</h1>`;
            return;
        }
        // clear existing content
        listProduct.innerHTML = null;
        filteredProducts.forEach(product => {
            let productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <a href='/details.html?id=${product.id}'>
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <h3>${product.name}</h3>
                <p class="price">GHC ${product.price}</p>
                <button class="addToCart" data-id="${product.id}">Add to Cart</button>
            `;
            listProduct.appendChild(productItem);
        });
    });
}

export default cart;