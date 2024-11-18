import products from './products.js';

/**
 * CheckoutForm class handles all checkout page functionality
 * Including form validation, order summary, and order processing
 */
class CheckoutForm {
    /**
     * Initialize the checkout form and load order summary
     */
    constructor() {
        console.log('Initializing CheckoutForm');
        this.form = document.getElementById('checkoutForm');
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.orderItems = document.getElementById('orderItems');
        this.orderTotal = document.getElementById('orderTotal');
        this.setupValidation();
        this.setupKeyboardNavigation();
        this.loadOrderSummary();
    }

    /**
     * Set up form validation event listeners
     */
    setupValidation() {
        // Add input event listeners for real-time validation
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            // Add blur event for keyboard users
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Add form submit handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Special validation for card fields
        this.setupCardValidation();
    }

    /**
     * Set up keyboard navigation for the form
     */
    setupKeyboardNavigation() {
        // Handle Enter key on form elements
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const inputs = Array.from(this.form.querySelectorAll('input, textarea, button'));
                const index = inputs.indexOf(e.target);
                if (index > -1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });

        // Add focus styles
        const formElements = this.form.querySelectorAll('input, textarea, button');
        formElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focus-visible');
            });
            element.addEventListener('blur', () => {
                element.classList.remove('focus-visible');
            });
        });
    }

    /**
     * Validate individual form fields
     * @param {HTMLElement} input - The input element to validate
     * @returns {boolean} - Whether the field is valid
     */
    validateField(input) {
        const error = input.nextElementSibling;
        let isValid = true;
        let errorMessage = '';

        switch(input.id) {
            case 'fullName':
                if (input.value.length < 3) {
                    isValid = false;
                    errorMessage = 'Name must be at least 3 characters long';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(input.value.replace(/\D/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 10-digit phone number';
                }
                break;

            case 'cardNumber':
                if (!/^\d{16}$/.test(input.value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 16-digit card number';
                }
                break;

            case 'expiry':
                const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
                if (!expiryRegex.test(input.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid expiry date (MM/YY)';
                }
                break;

            case 'cvv':
                if (!/^\d{3}$/.test(input.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 3-digit CVV';
                }
                break;
        }

        // Update UI with validation result
        if (!isValid) {
            input.classList.add('error');
            error.textContent = errorMessage;
            error.classList.add('show');
            // Announce error to screen readers
            error.setAttribute('role', 'alert');
        } else {
            input.classList.remove('error');
            error.classList.remove('show');
            error.textContent = '';
            error.removeAttribute('role');
        }

        return isValid;
    }

    /**
     * Set up special validation and formatting for card fields
     */
    setupCardValidation() {
        const cardNumber = document.getElementById('cardNumber');
        const expiry = document.getElementById('expiry');

        // Format card number with spaces after every 4 digits
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 16) value = value.substr(0, 16);
            e.target.value = value.replace(/(\d{4})/g, '$1 ').trim();
        });

        // Format expiry date as MM/YY
        expiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substr(0, 2) + '/' + value.substr(2);
            }
            e.target.value = value;
        });

        // Add keyboard navigation for card fields
        [cardNumber, expiry].forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const next = input.id === 'cardNumber' ? expiry : document.getElementById('cvv');
                    next.focus();
                }
            });
        });
    }

    /**
     * Load and display the order summary from cart data
     */
    loadOrderSummary() {
        console.log('Loading order summary');
        let total = 0;
        this.orderItems.innerHTML = '';

        this.cart.forEach(item => {
            const productIndex = products.findIndex(p => p.id == item.product_id);
            const product = products[productIndex];
            
            if (productIndex !== -1) {
                const itemTotal = product.price * item.quantity;
                total += itemTotal;

                const itemElement = document.createElement('div');
                itemElement.classList.add('order-item');
                itemElement.setAttribute('role', 'listitem');
                itemElement.innerHTML = `
                    <div class="item-details">
                        <span>${product.name} x ${item.quantity}</span>
                        <span>GHC ${itemTotal}</span>
                    </div>
                `;
                this.orderItems.appendChild(itemElement);
            }
        });

        this.orderTotal.textContent = `GHC ${total}`;
    }

    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        let firstInvalidInput = null;

        this.form.querySelectorAll('input, textarea').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            }
        });

        if (!isValid) {
            // Focus the first invalid input
            firstInvalidInput.focus();
            return;
        }

        // Process the order
        this.processOrder();
    }

    /**
     * Process the order after successful validation
     * Currently just shows success message and clears cart
     */
    processOrder() {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = './';
    }
}

// Initialize the checkout form when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutForm();
});