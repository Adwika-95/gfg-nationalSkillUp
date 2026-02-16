// checkout.js - Handles checkout page using sessionStorage for temporary data

// Get cart data from localStorage
function getCart() {
  const cartData = localStorage.getItem('jholaCart');
  return cartData ? JSON.parse(cartData) : [];
}

// Display order summary from localStorage
function displayOrderSummary() {
  const cart = getCart();
  const container = document.getElementById('checkoutOrderSummary');
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-checkout">
        <p>No items in cart</p>
        <a href="products.html" class="continue-shopping-btn">Add Products</a>
      </div>
    `;
    return;
  }
  
  let html = '<div class="checkout-items-list">';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    html += `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="checkout-item-info">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</p>
        </div>
        <div class="checkout-item-total">
          ₹${itemTotal.toLocaleString('en-IN')}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  
  // Update summary
  document.getElementById('checkoutSubtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
  document.getElementById('checkoutTax').textContent = `₹${tax.toLocaleString('en-IN')}`;
  document.getElementById('checkoutTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
}

// Handle form submission and store in sessionStorage
function handleCheckout(event) {
  event.preventDefault();
  
  // Get form data
  const formData = {
    customerName: document.getElementById('customerName').value,
    customerEmail: document.getElementById('customerEmail').value,
    customerPhone: document.getElementById('customerPhone').value,
    customerAddress: document.getElementById('customerAddress').value,
    deliveryOption: document.getElementById('deliveryOption').value,
    paymentMethod: document.getElementById('paymentMethod').value,
    timestamp: new Date().toISOString()
  };
  
  // Store in sessionStorage using sessionStorage.setItem()
  sessionStorage.setItem('checkoutData', JSON.stringify(formData));
  
  console.log('=== SESSION STORAGE DEMO ===');
  console.log('Action: Checkout form submitted');
  console.log('Method: sessionStorage.setItem("checkoutData", data)');
  console.log('Data stored:', formData);
  console.log('===========================');
  
  // Display session data
  displaySessionData();
  
  // Show success message
  alert('✓ Order placed successfully!\n\nYour checkout data has been saved in Session Storage.\n\nNote: This data will be cleared when you close the browser tab.');
  
  // Clear cart from localStorage
  localStorage.removeItem('jholaCart');
  
  // Redirect to products page after delay
  setTimeout(() => {
    window.location.href = 'products.html';
  }, 2000);
}

// Display session data
function displaySessionData() {
  // Get data from sessionStorage using sessionStorage.getItem()
  const sessionData = sessionStorage.getItem('checkoutData');
  
  if (sessionData) {
    const data = JSON.parse(sessionData);
    const container = document.getElementById('sessionDataDisplay');
    const content = document.getElementById('sessionDataContent');
    
    content.innerHTML = `
      <p><strong>Name:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      <p><strong>Phone:</strong> ${data.customerPhone}</p>
      <p><strong>Address:</strong> ${data.customerAddress}</p>
      <p><strong>Delivery:</strong> ${data.deliveryOption}</p>
      <p><strong>Payment:</strong> ${data.paymentMethod}</p>
      <p><strong>Saved at:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
    `;
    
    container.style.display = 'block';
  }
}

// Restore session data (demonstrates session persistence across page refresh)
function restoreSessionData() {
  // Get data from sessionStorage using sessionStorage.getItem()
  const sessionData = sessionStorage.getItem('checkoutData');
  
  if (sessionData) {
    const data = JSON.parse(sessionData);
    
    // Fill form with saved data
    document.getElementById('customerName').value = data.customerName || '';
    document.getElementById('customerEmail').value = data.customerEmail || '';
    document.getElementById('customerPhone').value = data.customerPhone || '';
    document.getElementById('customerAddress').value = data.customerAddress || '';
    document.getElementById('deliveryOption').value = data.deliveryOption || '';
    document.getElementById('paymentMethod').value = data.paymentMethod || '';
    
    alert('✓ Session data restored!\n\nThis demonstrates that sessionStorage survives page refresh.');
    
    console.log('=== SESSION STORAGE RESTORED ===');
    console.log('Method: sessionStorage.getItem("checkoutData")');
    console.log('Data:', data);
    console.log('================================');
  } else {
    alert('No session data found.\n\nSession data is cleared when the browser tab is closed.');
  }
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== CHECKOUT PAGE LOADED ===');
  console.log('Local Storage (Cart):', localStorage.getItem('jholaCart'));
  console.log('Session Storage (Checkout):', sessionStorage.getItem('checkoutData'));
  console.log('============================');
  
  displayOrderSummary();
  updateCartBadge();
  
  // Check if there's existing session data
  if (sessionStorage.getItem('checkoutData')) {
    displaySessionData();
  }
});

// Demonstrate session storage behavior on tab close
window.addEventListener('beforeunload', function() {
  console.log('=== TAB CLOSING ===');
  console.log('Session Storage will be cleared');
  console.log('Local Storage will persist');
  console.log('===================');
});