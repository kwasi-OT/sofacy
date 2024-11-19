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

    // Event Listeners for cart UI with keyboard support
    iconCart.addEventListener('click', toggleCart);
    iconCart.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCart();
        }
    });
    
    closeBtn.addEventListener('click', closeCart);
    closeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeCart();
        } else if (e.key === 'Tab' && !e.shiftKey) {
            // Move focus to first quantity button when tabbing from close
            e.preventDefault();
            const firstQuantityBtn = document.querySelector('.decrease');
            if (firstQuantityBtn) firstQuantityBtn.focus();
        }
    });

    // Functions to handle cart visibility
    function toggleCart() {
        body.classList.add('activeTabCart');
        // Focus the close button when cart opens
        setTimeout(() => closeBtn.focus(), 100);
    }

    function closeCart() {
        body.classList.remove('activeTabCart');
        // Return focus to cart icon when closing
        iconCart.focus();
    }
    
    // Checkout button handler - redirects to checkout page if cart has items
    checkoutBtn.addEventListener('click', handleCheckout);
    checkoutBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCheckout();
        }
    });

    function handleCheckout() {
        if (cart.length > 0) {
            window.location.href = './checkout.html';
        } else {
            alert('Your cart is empty!');
        }
    }

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
     * Adds keyboard navigation to quantity controls
     * @throws {Error} If cart data is invalid or products cannot be found
     */
    const renderCart = () => {
        try {
            if (!Array.isArray(cart)) {
                throw new Error('Invalid cart data structure');
            }

            const listCart = document.querySelector('.listCart');
            const totalHTML = document.querySelector('.cart-icon span');
            
            if (!listCart || !totalHTML) {
                throw new Error('Required cart UI elements not found');
            }

            // Clear existing cart items
            listCart.innerHTML = '';
            let totalQuantity = 0;

            cart.forEach((item, index) => {
                if (!item || typeof item.quantity !== 'number' || !item.product_id) {
                    throw new Error(`Invalid cart item at index ${index}`);
                }

                totalQuantity += item.quantity;
                const productIndex = products.findIndex(product => product.id == item.product_id);
                
                if (productIndex === -1) {
                    throw new Error(`Product not found for ID: ${item.product_id}`);
                }

                const info = products[productIndex];
                try {
                    const productItem = createCartItemElement(info, item);
                    listCart.appendChild(productItem);
                } catch (error) {
                    throw new Error(`Failed to create cart item: ${error.message}`);
                }
            });

            // Update total quantity display
            totalHTML.textContent = totalQuantity;

            // Add keyboard event listeners for quantity adjustment buttons
            setupQuantityControls();

        } catch (error) {
            // Log error for debugging
            // console.error('Error rendering cart:', error);
            
            // Show user-friendly error message
            const listCart = document.querySelector('.listCart');
            if (listCart) {
                listCart.innerHTML = `
                    <div class="cart-error" role="alert">
                        <p>Sorry, there was a problem displaying your cart. Please try refreshing the page.</p>
                    </div>
                `;
            }
            
            // Reset cart if data is corrupted
            if (error.message.includes('Invalid cart data')) {
                localStorage.removeItem('cart');
                cart = [];
            }
        }
    };

    /**
     * Creates a cart item element with product information
     * @param {Object} info - Product information
     * @param {Object} item - Cart item data
     * @returns {HTMLElement} The created cart item element
     */
    const createCartItemElement = (info, item) => {
        if (!info || !item) {
            throw new Error('Invalid product or cart item data');
        }

        const productItem = document.createElement('div');
        productItem.classList.add('item');
        
        // Validate required product information
        if (!info.image || !info.name || !info.price) {
            throw new Error('Missing required product information');
        }

        productItem.innerHTML = `
            <img src="${info.image}" alt="${info.name}" onerror="this.src='placeholder.jpg'">
            <div class="info">
                <div class="name">${info.name}</div>
                <div class="price">GHC ${info.price}</div>
            </div>
            <div class="quantity" role="group" aria-label="Quantity controls for ${info.name}">
                <button class="decrease" data-id="${info.id}" aria-label="Decrease quantity" tabindex="0">-</button>
                <span class="quantity-display" role="status" aria-live="polite">${item.quantity}</span>
                <button class="increase" data-id="${info.id}" aria-label="Increase quantity" tabindex="0">+</button>
            </div>
        `;

        return productItem;
    };

    /**
     * Sets up event listeners for quantity control buttons
     */
    const setupQuantityControls = () => {
        document.querySelectorAll('.increase, .decrease').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleQuantityChange.call(button);
                }
            });
        });
    };

    function handleQuantityChange() {
        const id = this.dataset.id;
        const positionItemInCart = cart.findIndex(value => value.product_id == id);
        if (positionItemInCart >= 0) {
            const change = this.classList.contains('increase') ? 1 : -1;
            cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + change;
            if (cart[positionItemInCart].quantity <= 0) {
                cart.splice(positionItemInCart, 1);
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Add keyboard support for add to cart buttons
    document.querySelectorAll('.addToCart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddToCart.call(button);
            }
        });
    });

    function handleAddToCart() {
        const id = this.dataset.id;
        const positionThisProductInCart = cart.findIndex((value) => value.product_id == id);
        if (positionThisProductInCart < 0) {
            setProductInCart(id, 1, -1);
        }
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