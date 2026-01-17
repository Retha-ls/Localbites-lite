let restaurants = [];
let menuItems = {};
let currentRestaurant = null;

// Fetch data from data.json
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        restaurants = data.restaurants;
        menuItems = data.menuItems;
        
        updateCartCount();
        displayRestaurants();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Display all restaurants dynamically
function displayRestaurants() {
    const restaurantGrid = document.getElementById('restaurant-grid');
    
    if (!restaurantGrid) return;
    
    restaurantGrid.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const restaurantCard = document.createElement('div');
        restaurantCard.className = 'restaurant-card';
        restaurantCard.onclick = () => showRestaurant(restaurant.id);
        
        restaurantCard.innerHTML = `
            <div class="restaurant-image">
                <img src="images/restaurants/${restaurant.image}" alt="${restaurant.name}">
            </div>
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <div class="restaurant-meta">
                    <span class="rating">
                        <img src="images/svg/star.svg" alt="star" class="icon-img"> ${restaurant.rating}
                    </span>
                    <span class="delivery-time">
                        <img src="images/svg/clock.svg" alt="clock" class="icon-img"> ${restaurant.delivery}
                    </span>
                </div>
            </div>
        `;
        
        restaurantGrid.appendChild(restaurantCard);
    });
}

// Update cart count
function updateCartCount() {
    const savedCart = localStorage.getItem('localbites_cart');
    let totalItems = 0;
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    const navCartCount = document.getElementById('cart-count-nav');
    if (navCartCount) {
        navCartCount.textContent = totalItems;
    }
}

// Show home page
function showHome() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('restaurant-page').style.display = 'none';
}

// Show restaurant page
function showRestaurant(restaurantId) {
    currentRestaurant = restaurantId;
    
    const restaurant = restaurants.find(r => r.id === restaurantId) || {};
    const infoEl = document.getElementById('restaurant-info');
    if (infoEl) {
        infoEl.innerHTML = `
            <h2>${restaurant.name || ''}</h2>
            <p>${restaurant.description || ''}</p>
            <div style="display:flex; gap:20px; margin-top:10px;">
                <span class="rating"><img src="images/svg/star.svg" alt="star" class="icon-img"> ${restaurant.rating || ''}</span>
                <span class="delivery-time"><img src="images/svg/clock.svg" alt="clock" class="icon-img"> ${restaurant.delivery || ''}</span>
            </div>
        `;
    }
    
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;
    menuContainer.innerHTML = '';
    
    // Check if menu items exist for this restaurant
    if (menuItems[restaurantId] && menuItems[restaurantId].length) {
        menuItems[restaurantId].forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item-card';

            const desc = item.description ? item.description : '';
            
            menuItem.innerHTML = `
                <div class="left">
                    <div class="title">${item.name}</div>
                    <div class="desc">${desc}</div>
                </div>
                <div class="right">
                    <div class="price">M${Number(item.price).toFixed(2)}</div>
                    <div class="actions">
                        <div class="qty-controls">
                            <button type="button" class="qty-decr">-</button>
                            <div class="qty">1</div>
                            <button type="button" class="qty-incr">+</button>
                        </div>
                        <button class="add-btn">Add</button>
                    </div>
                </div>
            `;
            menuContainer.appendChild(menuItem);

            // Wire quantity controls and add action
            const qtyEl = menuItem.querySelector('.qty');
            const incr = menuItem.querySelector('.qty-incr');
            const decr = menuItem.querySelector('.qty-decr');
            const addBtn = menuItem.querySelector('.add-btn');

            if (incr && qtyEl) {
                incr.addEventListener('click', () => {
                    const v = Math.min(99, Math.max(1, parseInt(qtyEl.textContent || '1') + 1));
                    qtyEl.textContent = v;
                });
            }
            if (decr && qtyEl) {
                decr.addEventListener('click', () => {
                    const v = Math.max(1, parseInt(qtyEl.textContent || '1') - 1);
                    qtyEl.textContent = v;
                });
            }
            if (addBtn && qtyEl) {
                addBtn.addEventListener('click', () => {
                    const qty = Math.max(1, parseInt(qtyEl.textContent || '1'));
                    addToCart(item.id, item.name, Number(item.price), qty);
                });
            }
        });
    } else {
        menuContainer.innerHTML = '<p class="no-menu">No menu items available for this restaurant.</p>';
    }
    
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('restaurant-page').style.display = 'block';
}

// Add item to cart
function addToCart(itemId, itemName, price, quantity = 1) {
    const savedCart = localStorage.getItem('localbites_cart'); 
    let cart = savedCart ? JSON.parse(savedCart) : [];
    
    const index = cart.findIndex(i => i.id === itemId);
    if (index > -1) {
        cart[index].quantity = (cart[index].quantity || 0) + quantity;
    } else {
        cart.push({ id: itemId, name: itemName, price: price, quantity: quantity });
    }
    
    localStorage.setItem('localbites_cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(itemName + (quantity > 1 ? ` (x${quantity})` : '') + " added to cart!");
}

// Start after fetching data
window.onload = loadData;