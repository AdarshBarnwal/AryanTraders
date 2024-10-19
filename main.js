const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);

  input.addEventListener("blur", blurFunc);
});

// Real-time validation for name
const nameInput = document.getElementById("name");
const nameError = document.getElementById("nameError");
nameInput.addEventListener("input", function () {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(nameInput.value)) {
    nameError.textContent = "Please enter you name.";
  } else {
    nameError.textContent = ""; // Clear the error if valid
  }
});

// Real-time validation for phone
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");
phoneInput.addEventListener("input", function () {
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneInput.value)) {
    phoneError.textContent = "Phone number must be exactly 10 digits.";
  } else {
    phoneError.textContent = ""; // Clear the error if valid
  }
});

// Real-time validation for email (only Gmail)
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
emailInput.addEventListener("input", function () {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = "Please enter a valid Gmail address.";
  } else {
    emailError.textContent = ""; // Clear the error if valid
  }
});

const form = document.getElementById("contactForm");
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Assuming validation passed, show the success alert
  alert("Message sent successfully!");

  // Now submit the form to Web3Forms
  form.submit(); // Continue to submit the form after showing the alert
});
