import products from "./products.js";
import cart from "./cart.js";

/**
 * Load template file and initialize the app
 * Fetches the template HTML and sets up the initial content
 */
const loadTemplate = () => {
    // Fetch template HTML
    fetch('/template.html')
    .then(response => response.text())
    .then(html => {
        // Set up the initial content
        app.innerHTML = html;

        // Replace existing template content
        let contentTab = document.getElementById('contentTab');
        contentTab.innerHTML = temporaryContent.innerHTML;
        temporaryContent.innerHTML = null;

        // Initialize cart functionality
        cart();

        // Initialize the app
        initApp();
    });
}

/**
 * Initialize the product details page
 * Loads product information and sets up event handlers
 */
const initApp = () => {
    // Get product ID from URL parameters
    let id = new URLSearchParams(window.location.search).get('id');
    
    // Find the selected product
    let product = products.find(product => product.id == id);
    console.log(product);
    
    // If there's no product, redirect to home page
    if (!product) {
        window.location.href = '/';
        return;
    }

    // Get details container
    let details = document.querySelector('.detail');
    
    // Update product details in the UI
    details.querySelector('.image img').src = product.image;
    details.querySelector('.name').innerHTML = product.name;
    details.querySelector('.price').innerHTML = `GHC ${product.price}`;
    details.querySelector('.description p').innerHTML = product.description;
    details.querySelector('.addToCart').dataset.id = id;
    details.querySelector('.checkOut').dataset.id = id;

    /**
     * Checkout button handler
     * Adds current product to cart and redirects to checkout
     */
    details.querySelector('.checkOut').addEventListener('click', () => {
        // Add the product to cart with quantity 1
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.product_id == id);
        
        if (existingItemIndex === -1) {
            // Add new item if not in cart
            cart.push({
                product_id: id,
                quantity: 1
            });
        } else {
            // Update quantity if already in cart
            cart[existingItemIndex].quantity = cart[existingItemIndex].quantity + 1;
        }
        
        // Save cart and redirect to checkout
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = './checkout.html';
    });

    // Load similar products section
    let listProduct = document.querySelector('.listProduct');
    // Clear existing content
    listProduct.innerHTML = null;
    
    // Display all products except the current one
    products.filter((product) => product.id != id).forEach(product => {
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', loadTemplate);
