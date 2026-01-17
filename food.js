let allFoodItems = [];

// Fetch list of food items with restaurant info
async function loadData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();

        allFoodItems = [];

        data.restaurants.forEach(restaurant => {
            const items = data.menuItems[restaurant.id];
            if (!items) return;

            items.forEach(item => {
                allFoodItems.push({
                    ...item,
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                    restaurantRating: restaurant.rating,
                    restaurantDelivery: restaurant.delivery
                    // image is already in the item object from JSON
                });
            });
        });

        updateCartCount();
        displayAllFood();

    } catch (e) {
        console.log('Failed to load data:', e);
        const grid = document.getElementById('all-food-items');
        if (grid) {
            grid.innerHTML = `
                <div class="no-menu" style="grid-column: 1/-1; text-align:center; padding:3rem;">
                    <h3>Failed to load menu</h3>
                    <p>Please refresh the page</p>
                </div>
            `;
        }
    }
}

function displayAllFood() {
    const grid = document.getElementById('all-food-items');
    if (!grid) return;

    grid.innerHTML = '';

    if (allFoodItems.length === 0) {
        grid.innerHTML = `
            <div class="no-menu" style="grid-column: 1/-1; text-align:center; padding:3rem;">
                <h3>No food items found</h3>
                <p>Try again later</p>
            </div>
        `;
        return;
    }

    allFoodItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'food-card';

        // Check if item has an image property
        const imageHTML = item.image ? `
            <div class="food-image">
                <img src="images/food/${item.image}" alt="${item.name}" 
                     onerror="this.style.display='none'; this.parentElement.style.display='none'">
            </div>
        ` : '';

        card.innerHTML = `
            ${imageHTML}

            <div class="food-header">
                <div class="food-name">${item.name}</div>
                <div class="food-price">M${item.price.toFixed(2)}</div>
            </div>

            <p class="food-desc">${item.description || ''}</p>

            <div class="food-footer">
                <span class="restaurant-name">${item.restaurantName}</span>

                <div class="food-meta">
                    <span class="rating">
                        <img src="images/svg/star.svg" class="icon-img"> ${item.restaurantRating || ''}
                    </span>
                    <span class="delivery-time">
                        <img src="images/svg/clock.svg" class="icon-img"> ${item.restaurantDelivery || ''}
                    </span>
                </div>
            </div>

            <button class="add-to-cart-btn">Add to Cart</button>
        `;

        card.querySelector('.add-to-cart-btn').onclick = e => {
            e.stopPropagation();
            addToCartDirect(item.id, item.name, item.price, 1);
        };

        grid.appendChild(card);
    });
}

// Add item to cart directly
function addToCartDirect(id, name, price, qty = 1) {
    let cart = JSON.parse(localStorage.getItem('localbites_cart')) || [];

    let item = cart.find(i => i.id === id);

    if (item) {
        item.quantity += qty;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: qty
        });
    }

    localStorage.setItem('localbites_cart', JSON.stringify(cart));
    updateCartCount();

    alert('added to cart');
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('localbites_cart')) || [];
    let count = 0;
    cart.forEach(item => {
        count += item.quantity;
    });
    const el = document.getElementById('cart-count-nav');
    if (el) el.textContent = count;
}

window.onload = loadData;