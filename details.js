import products from "./products.js";
import cart from "./cart.js";

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

// Initialize app
(async () => {
    try {
        await loadTemplate();
    } catch (error) {
        console.error('Error loading template:', error);
    }
})();

const initApp = () => {
    let id = new URLSearchParams(window.location.search).get('id');
    let product = products.find(product => product.id == id);
    console.log(product);
    
    // if there's no product, redirect to home page
    if (!product) {
        window.location.href = '/';
        return;
    }

    // assign values to elements
    let details = document.querySelector('.detail');
    details.querySelector('.image img').src = product.image;
    details.querySelector('.name').innerHTML = product.name;
    details.querySelector('.price').innerHTML = `GHC ${product.price}`;
    details.querySelector('.description p').innerHTML = product.description;
    details.querySelector('.addToCart').dataset.id = id;

    // load products

    let listProduct = document.querySelector('.listProduct');
    // clear existing content
    listProduct.innerHTML = null;
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
