// products.js - Handles product page functionality and localStorage

// Function to add product to cart using localStorage
function addToCart(id, name, price, image) {
  // Get existing cart from localStorage using localStorage.getItem()
  let cart = localStorage.getItem('jholaCart');
  
  // Parse cart or initialize empty array
  cart = cart ? JSON.parse(cart) : [];
  
  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex(item => item.id === id);
  
  if (existingProductIndex > -1) {
    // Product exists, increase quantity
    cart[existingProductIndex].quantity += 1;
  } else {
    // New product, add to cart
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  // Save updated cart to localStorage using localStorage.setItem()
  localStorage.setItem('jholaCart', JSON.stringify(cart));
  
  // Update cart badge
  updateCartBadge();
  
  // Show success message
  showNotification(`✓ ${name} added to cart!`);
  
  // Log to console for demonstration
  console.log('=== LOCAL STORAGE DEMO ===');
  console.log('Action: Product added to cart');
  console.log('Method: localStorage.setItem("jholaCart", data)');
  console.log('Product:', { id, name, price });
  console.log('Updated Cart:', cart);
  console.log('========================');
}

// Update cart badge count
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('jholaCart') || '[]');
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
  updateCartBadge();
  
  // Log localStorage contents for demonstration
  console.log('=== LOCAL STORAGE CONTENTS ===');
  console.log('Cart Data:', localStorage.getItem('jholaCart'));
  console.log('Parsed:', JSON.parse(localStorage.getItem('jholaCart') || '[]'));
  console.log('=============================');
});