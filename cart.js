// Load cart items from localStorage
function loadCartItems() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItemsContainer = document.getElementById("cart-items");
  let totalAmount = 0;

  cartItemsContainer.innerHTML = ""; // Clear previous items

  cart.forEach((item, index) => {
    let weight = item.weight || 1;
    let totalPrice = parseFloat(item.price) * weight;
    totalAmount += totalPrice;

    let row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${
      item.name
    }" width="50" height="50">
                <strong>${item.name}</strong>
            </td>
            <td>${item.price}</td>
            <td>
                <div class="weight-adjuster">
                    <button class="minus-btn" data-index="${index}">-</button>
                    <input type="number" value="${weight.toFixed(
                      1
                    )}" min="0.1" step="0.1" data-index="${index}" class="weight-input">
                    <button class="plus-btn" data-index="${index}">+</button>
                </div>
            </td>
            <td class="total-price">${totalPrice.toFixed(3)}</td>
            <td>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </td>
        `;
    cartItemsContainer.appendChild(row);
  });

  document.getElementById(
    "total-amount"
  ).innerText = `Total: ${totalAmount.toFixed(3)}`;

  attachEventListeners();
}

// Attach event listeners to weight inputs and remove buttons
function attachEventListeners() {
  document.querySelectorAll(".weight-input").forEach((input) => {
    input.addEventListener("focus", function () {
      this.setSelectionRange(0, this.value.length); // Select entire input value
    });
    input.addEventListener("input", updateItemWeight);
  });

  document.querySelectorAll(".minus-btn").forEach((button) => {
    button.addEventListener("click", decreaseWeight);
  });

  document.querySelectorAll(".plus-btn").forEach((button) => {
    button.addEventListener("click", increaseWeight);
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", removeItem);
  });

  // Add input validation for name, email, phone, and address
  document.getElementById("name").addEventListener("input", validateName);
  document.getElementById("email").addEventListener("input", validateEmail);
  document.getElementById("phone").addEventListener("input", validatePhone);
  document.getElementById("address").addEventListener("input", validateAddress);
}

// Decrease item weight
function decreaseWeight(event) {
  let index = event.target.getAttribute("data-index");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let weightInput = document.querySelector(
    `.weight-input[data-index='${index}']`
  );
  let newWeight = Math.max(0.1, parseFloat(weightInput.value) - 0.1); // Ensure weight doesn't go below 0.1
  weightInput.value = newWeight.toFixed(1); // Set weight with one decimal place
  cart[index].weight = newWeight;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

// Increase item weight
function increaseWeight(event) {
  let index = event.target.getAttribute("data-index");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let weightInput = document.querySelector(
    `.weight-input[data-index='${index}']`
  );
  let newWeight = parseFloat(weightInput.value) + 0.1;
  weightInput.value = newWeight.toFixed(1); // Set weight with one decimal place
  cart[index].weight = newWeight;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

// Update item weight
function updateItemWeight(event) {
  let index = event.target.getAttribute("data-index");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let newWeight = parseFloat(event.target.value);

  if (newWeight <= 0) {
    alert("Weight cannot be zero or negative.");
    return;
  }

  cart[index].weight = newWeight;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

// Remove item from cart
function removeItem(event) {
  let index = event.target.getAttribute("data-index");
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

// Validate name
function validateName() {
  const nameInput = document.getElementById("name");
  const nameRegex = /^[A-Za-z\s]*$/; // Allows only letters and spaces

  if (!nameRegex.test(nameInput.value)) {
    nameInput.setCustomValidity(
      "Please enter a valid name (letters and spaces only)."
    );
  } else {
    nameInput.setCustomValidity(""); // Clear the error
  }

  nameInput.reportValidity(); // Show validation message
}

// Validate email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Only allows Gmail addresses

  if (!emailRegex.test(emailInput.value)) {
    emailInput.setCustomValidity("Please enter a valid Gmail address.");
  } else {
    emailInput.setCustomValidity(""); // Clear the error
  }

  emailInput.reportValidity(); // Show validation message
}

// Validate phone number
function validatePhone() {
  const phoneInput = document.getElementById("phone");
  const phoneRegex = /^\d{10}$/; // Only allows exactly 10 digits

  if (!phoneRegex.test(phoneInput.value)) {
    phoneInput.setCustomValidity("Phone number must be exactly 10 digits.");
  } else {
    phoneInput.setCustomValidity(""); // Clear the error
  }

  phoneInput.reportValidity(); // Show validation message
}

// Validate address
function validateAddress() {
  const addressInput = document.getElementById("address");

  if (addressInput.value.trim() === "") {
    addressInput.setCustomValidity("Please enter your address.");
  } else {
    addressInput.setCustomValidity(""); // Clear the error
  }

  addressInput.reportValidity(); // Show validation message
}

// Proceed to checkout
document.getElementById("checkout-btn").addEventListener("click", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Validate the checkout form
  if (!validateCheckoutForm()) {
    return; // Stop the checkout process if validation fails
  }

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => {
    const weight = item.weight || 1; // Default weight to 1 if not specified
    return sum + parseFloat(item.price) * weight;
  }, 0);

  // Generate the PDF receipt
  generateReceiptPDF(cart, totalAmount); // Pass cart and total amount

  // Send order details to Web3Forms
  sendOrderDetails();
});

// Validate the checkout form
function validateCheckoutForm() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");

  let isValid = true;

  // Clear previous error messages
  name.setCustomValidity("");
  email.setCustomValidity("");
  phone.setCustomValidity("");
  address.setCustomValidity("");

  // Validate each input
  validateName();
  validateEmail();
  validatePhone();
  validateAddress();

  // If any input is invalid, set isValid to false
  if (
    !name.checkValidity() ||
    !email.checkValidity() ||
    !phone.checkValidity() ||
    !address.checkValidity()
  ) {
    isValid = false;
  }

  return isValid; // All validations passed
}

// Send order details to Web3Forms
function sendOrderDetails() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalAmount = cart.reduce((sum, item) => {
    const weight = item.weight || 1;
    return sum + parseFloat(item.price) * weight;
  }, 0);

  const formData = {
    access_key: "be0dc8a4-196d-4e99-8edf-229ceda14106", // Your Web3Forms API key
    name: name,
    phone: phone,
    email: email,
    address: address,
    items: cart.map((item) => `${item.name} - ${item.price}`).join("\n"), // Joining cart items for the message
    totalAmount: `${totalAmount.toFixed(3)}`, // Add total amount to the formData
  };

  // Send data to Web3Forms
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.ok) {
        alert(`Thank you, ${name}! Your order has been placed.`);
        // Clear the cart after checkout
        localStorage.removeItem("cart");
        window.location.href = "index.html"; // Redirect to home page or another page
      } else {
        console.error(response);
        alert(json.message || "Failed to send order. Please try again later.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Something went wrong!");
    });
}

// Load cart items on page load
window.onload = function () {
  loadCartItems();
};

// Function to generate and download PDF receipt
function generateReceiptPDF(cartItems, totalAmount) {
  // Import jsPDF
  const { jsPDF } = window.jspdf;

  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Add title and greeting
  doc.setFontSize(20);
  doc.text("Thank You for Your Purchase!", 20, 20);
  doc.setFontSize(14);
  doc.text("Here is your receipt:", 20, 30);

  // Add cart items to the PDF
  doc.setFontSize(12);
  let startY = 40; // Starting Y position for items
  doc.text("Item", 20, startY);
  doc.text("Quantity", 80, startY);
  doc.text("Price", 140, startY);

  // Loop through cart items
  cartItems.forEach((item, index) => {
    const weight = item.weight || 1; // Use weight for quantity
    const price = parseFloat(item.price); // Ensure price is a number
    const totalPrice = (weight * price).toFixed(2); // Calculate total price for the item
    const y = startY + 10 * (index + 1); // Calculate Y position for each item

    doc.text(item.name, 20, y);
    doc.text(weight.toFixed(1), 80, y); // Ensure weight is displayed with one decimal place
    doc.text(`${totalPrice}`, 140, y); // Ensure currency symbol is displayed correctly
  });

  // Add total amount
  const totalY = startY + 10 * (cartItems.length + 1);
  doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 20, totalY); // Ensure currency symbol is displayed correctly

  // Save the PDF
  doc.save("receipt.pdf");
}
