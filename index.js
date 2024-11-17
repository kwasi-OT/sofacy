import cart from "./cart.js";
import products from "./products.js";

let app = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');

// load template file
const loadTemplate = () => {
    fetch('/template.html')
    .then(response => response.text())
    .then(html => {
        app.innerHTML = html;

        // replace existing template content
        let contentTab = document.getElementById('contentTab');
        contentTab.innerHTML = temporaryContent.innerHTML;
        temporaryContent.innerHTML = null;

        cart();
        initApp();
    });
}

const initApp = () => {
    console.log(products);
    // load products
    let listProduct = document.querySelector('.listProduct');
    // clear existing content
    listProduct.innerHTML = null;
    products.forEach(product => {
        let productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>GHC ${product.price}</p>
            <button class="addToCart" data-id="${product.id}">Add to Cart</button>
        `;
        listProduct.appendChild(productItem);
    });
}

// Initialize app
(async () => {
    try {
        await loadTemplate();
    } catch (error) {
        console.error('Error loading template:', error);
    }
})();