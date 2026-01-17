window.onload = function () {
    loadCart();
    updateCartCount();
};

function loadCart() {
    let cart = JSON.parse(localStorage.getItem('localbites_cart')) || [];

    const itemsBox = document.getElementById('cart-items');
    const emptyText = document.getElementById('empty-cart');
    const totalBox = document.getElementById('cart-total');

    itemsBox.innerHTML = '';

    if (cart.length === 0) {
        emptyText.style.display = 'block';
        totalBox.style.display = 'none';
        return;
    }

    emptyText.style.display = 'none';
    totalBox.style.display = 'block';

    let subtotal = 0;

    cart.forEach((item, i) => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        itemsBox.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>M${item.price.toFixed(2)} × ${item.quantity} = M${itemTotal.toFixed(2)}</p>
               
        `;
    });

    document.getElementById('subtotal').textContent = `M${subtotal.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `M${(subtotal + 29.99).toFixed(2)}`;
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('localbites_cart')) || [];
    let count = 0;

    cart.forEach(i => count += i.quantity);

    const el = document.getElementById('cart-count-nav');
    if (el) el.textContent = count;
}

function placeOrder() {
    let cart = JSON.parse(localStorage.getItem('localbites_cart')) || [];

    if (!cart.length) {
        alert('Cart is empty');
        return;
    }

    location.href = 'receipt.html';
}