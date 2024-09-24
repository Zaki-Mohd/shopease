const productsContainer = document.getElementById('products');
const cartItemsContainer = document.getElementById('cart-items');
const totalMrpElement = document.getElementById('total-mrp');
const couponDiscountElement = document.getElementById('coupon-discount');
const platformFeeElement = document.getElementById('platform-fee');
const shippingChargesElement = document.getElementById('shipping-charges');
const totalAmountElement = document.getElementById('total-amount');
const placeOrderButton = document.getElementById('place-order');
const searchInput = document.getElementById('search-input');

const cart = {};

fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(products => {
        displayProducts(products);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });

function displayProducts(products) {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.title;

        const productName = document.createElement('h3');
        productName.textContent = product.title;

        const productRating = document.createElement('p');
        productRating.classList.add('rating');
        productRating.textContent = `★ ${product.rating.rate}`;

        const productPrice = document.createElement('p');
        productPrice.classList.add('price');
        productPrice.textContent = `₹${product.price}`;

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => {
            addToCart(product);
        });

        productElement.appendChild(productImage);
        productElement.appendChild(productName);
        productElement.appendChild(productRating);
        productElement.appendChild(productPrice);
        productElement.appendChild(addToCartButton);

        productsContainer.appendChild(productElement);
    });
}

function addToCart(product) {
    if (cart[product.id]) {
        cart[product.id].quantity++;
    } else {
        cart[product.id] = {
            ...product,
            quantity: 1
        };
    }

    updateCart();
}

function updateCart() {
    cartItemsContainer.innerHTML = '';

    let totalMrp = 0;

    for (const productId in cart) {
        const product = cart[productId];
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const cartItemImage = document.createElement('img');
        cartItemImage.src = product.image;
        cartItemImage.alt = product.title;

        const cartItemDetails = document.createElement('div');
        cartItemDetails.classList.add('item-details');

        const cartItemName = document.createElement('h3');
        cartItemName.textContent = product.title;

        const cartItemPrice = document.createElement('p');
        cartItemPrice.classList.add('price');
        cartItemPrice.textContent = `₹${product.price}`;

        const cartItemQuantity = document.createElement('div');
        cartItemQuantity.classList.add('quantity');

        const decreaseQuantityButton = document.createElement('button');
        decreaseQuantityButton.textContent = '-';
        decreaseQuantityButton.addEventListener('click', () => {
            decreaseQuantity(product.id);
        });

        const quantityElement = document.createElement('span');
        quantityElement.textContent = product.quantity;

        const increaseQuantityButton = document.createElement('button');
        increaseQuantityButton.textContent = '+';
        increaseQuantityButton.addEventListener('click', () => {
            increaseQuantity(product.id);
        });

        const removeButton = document.createElement('span');
        removeButton.classList.add('remove');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromCart(product.id);
        });

        cartItemQuantity.appendChild(decreaseQuantityButton);
        cartItemQuantity.appendChild(quantityElement);
        cartItemQuantity.appendChild(increaseQuantityButton);

        cartItemDetails.appendChild(cartItemName);
        cartItemDetails.appendChild(cartItemPrice);
        cartItemDetails.appendChild(cartItemQuantity);

        cartItem.appendChild(cartItemImage);
        cartItem.appendChild(cartItemDetails);
        cartItem.appendChild(removeButton);

        cartItemsContainer.appendChild(cartItem);

        totalMrp += product.price * product.quantity;
    }

    totalMrpElement.textContent = `₹${totalMrp.toFixed(2)}`;
    couponDiscountElement.textContent = `₹${(totalMrp * 0.1).toFixed(2)}`;
    platformFeeElement.textContent = `₹10`;
    shippingChargesElement.textContent = `₹20`;
    totalAmountElement.textContent = `₹${(totalMrp * 1.1 + 30).toFixed(2)}`;

    placeOrderButton.disabled = Object.keys(cart).length === 0;
}

function decreaseQuantity(productId) {
    if (cart[productId].quantity > 1) {
        cart[productId].quantity--;
    } else {
        removeFromCart(productId);
    }

    updateCart();
}

function increaseQuantity(productId) {
    cart[productId].quantity++;
    updateCart();
}

function removeFromCart(productId) {
    delete cart[productId];
    updateCart();
}

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product => {
                return product.title.toLowerCase().includes(searchTerm);
            });
            displayProducts(filteredProducts);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

// Smooth transition to the cart section
document.getElementById('cart-logo').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
});
