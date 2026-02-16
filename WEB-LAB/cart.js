// cart.js - Handles cart page functionality using localStorage

// Get cart data from localStorage using localStorage.getItem()
function getCart() {
  const cartData = localStorage.getItem('jholaCart');
  return cartData ? JSON.parse(cartData) : [];
}

// Save cart data to localStorage using localStorage.setItem()
function saveCart(cart) {
  localStorage.setItem('jholaCart', JSON.stringify(cart));
  console.log('=== LOCAL STORAGE UPDATED ===');
  console.log('Method: localStorage.setItem("jholaCart", data)');
  console.log('Cart:', cart);
  console.log('============================');
}

// Display cart items
function displayCart() {
  const cart = getCart();
  const container = document.getElementById('cartItemsContainer');
  const emptyMessage = document.getElementById('emptyCartMessage');
  
  if (cart.length === 0) {
    container.innerHTML = '';
    emptyMessage.style.display = 'block';
    updateCartSummary(0, 0, 0, 0);
    return;
  }
  
  emptyMessage.style.display = 'none';
  
  let html = '<div class="cart-items-list">';
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    html += `
      <div class="cart-item-row">
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="item-price">₹${item.price.toLocaleString('en-IN')}</p>
        </div>
        <div class="item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <div class="item-total">
          <p>₹${itemTotal.toLocaleString('en-IN')}</p>
        </div>
        <div class="item-actions">
          <button class="remove-btn" onclick="removeItem(${index})">🗑️ Remove</button>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  // Calculate and update summary
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  
  updateCartSummary(subtotal, shipping, tax, total);
}

// Update quantity
function updateQuantity(index, change) {
  const cart = getCart();
  
  if (cart[index]) {
    cart[index].quantity += change;
    
    // Remove if quantity becomes 0
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    
    saveCart(cart);
    displayCart();
    updateCartBadge();
  }
}

// Remove item from cart
function removeItem(index) {
  const cart = getCart();
  const itemName = cart[index].name;
  
  // Remove item
  cart.splice(index, 1);
  
  // Save updated cart
  saveCart(cart);
  
  // Refresh display
  displayCart();
  updateCartBadge();
  
  showNotification(`${itemName} removed from cart`);
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    // Clear cart from localStorage
    localStorage.removeItem('jholaCart');
    
    console.log('=== CART CLEARED ===');
    console.log('Method: localStorage.removeItem("jholaCart")');
    console.log('Cart is now empty');
    console.log('===================');
    
    displayCart();
    updateCartBadge();
    showNotification('Cart cleared!');
  }
}

// Update cart summary
function updateCartSummary(subtotal, shipping, tax, total) {
  document.getElementById('subtotalAmount').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('shippingAmount').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
  document.getElementById('taxAmount').textContent = `₹${tax.toLocaleString('en-IN')}`;
  document.getElementById('totalAmount').textContent = `₹${total.toLocaleString('en-IN')}`;
}

// Update cart badge
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItems;
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification-popup';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== CART PAGE LOADED ===');
  console.log('Reading from localStorage.getItem("jholaCart")');
  console.log('Cart Data:', getCart());
  console.log('=======================');
  
  displayCart();
  updateCartBadge();
});