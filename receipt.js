window.onload = function () {
    loadReceipt();
    updateCartCount();
};

function loadReceipt() {
    const cart = getCart();
    const container = document.getElementById('receipt-items');

    if (!cart.length) {
        container.innerHTML = '<p>Your receipt is empty.</p>';
        return;
    }

    let subtotal = 0;
    container.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>M${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <strong>M${itemTotal.toFixed(2)}</strong>
        `;

        container.appendChild(div);
    });

    const delivery = 29.99;
    document.getElementById('receipt-subtotal').textContent = `M${subtotal.toFixed(2)}`;
    document.getElementById('receipt-total').textContent = `M${(subtotal + delivery).toFixed(2)}`;
}

function getCart() {
    const saved = localStorage.getItem('localbites_cart');
    return saved ? JSON.parse(saved) : [];
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('cart-count-nav').textContent = count;
}
function goHomeAndClearCart() {
    localStorage.removeItem('localbites_cart');
    window.location.href = 'index.html';
}
