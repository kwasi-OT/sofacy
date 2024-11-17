import cart from "./cart.js";

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