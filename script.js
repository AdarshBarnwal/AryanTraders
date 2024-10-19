// Function to handle adding items to cart
function addToCart(item, button) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the item already exists in the cart
  const isItemInCart = cart.some((cartItem) => cartItem.name === item.name);

  if (!isItemInCart) {
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Change button text to "Added" and disable it
    button.innerText = "Added";
    button.disabled = true;
  } else {
    // Optional: You can choose to show a message here if needed.
    // alert(item.name + " is already in the cart.");
  }
}

// Function to handle adding items to wishlist
function addToWishlist(item, button) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Check if the item already exists in the wishlist
  const isItemInWishlist = wishlist.some(
    (wishlistItem) => wishlistItem.name === item.name
  );

  if (!isItemInWishlist) {
    wishlist.push(item);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();

    // Change button text to "Added" and disable it
    button.innerText = "Added";
    button.disabled = true;
  } else {
    // Optional: You can choose to show a message here if needed.
    // alert(item.name + " is already in the wishlist.");
  }
}

// Update the cart count in the nav
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelector(".cart span").innerText = cart.length;
}

// Update the wishlist count in the nav
function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  document.querySelector(".like span").innerText = wishlist.length;
}

// Load and update the counts when the page loads
window.onload = function () {
  updateCartCount();
  updateWishlistCount();
};

// Event listeners for add to cart and wishlist buttons
document.querySelectorAll(".cart-btn").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent page scroll

    const item = {
      name: this.parentNode.querySelector("strong").innerText,
      price: this.parentNode.querySelector(".price").innerText,
      image: this.parentNode.querySelector("img").src,
    };

    // Call addToCart with the button element
    addToCart(item, this);
  });
});

document.querySelectorAll(".like-btn").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent page scroll

    const item = {
      name: this.parentNode.querySelector("strong").innerText,
      price: this.parentNode.querySelector(".price").innerText,
      image: this.parentNode.querySelector("img").src,
    };

    // Call addToWishlist with the button element
    addToWishlist(item, this);
  });
});

document.getElementById("checkout-btn").addEventListener("click", function () {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the cart is empty
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
  } else {
    // Redirect to the checkout page
    window.location.href = "index.html"; // Add your checkout page URL
  }
});
