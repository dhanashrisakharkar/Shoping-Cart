console.log("connected");
let minusButton = document.querySelectorAll(".minus-button");
let plusButton = document.querySelectorAll(".plus-button");
let quantityElement = document.querySelectorAll(".quantity");
let addToCartButtons = document.querySelectorAll(".add-to-cart");
let cartItems = document.querySelectorAll(".products");
let cartBtn = document.getElementById("cart-btn");
let cartPage = document.getElementById("cart-page");
let cart = JSON.parse(sessionStorage.getItem("cartItems")) || [];
let cartContainer = document.getElementById("cart-container");
let productsContainer = document.querySelector(".products");
let backBtn = document.querySelector(".back-btn");
let header = document.querySelector(".header");
let cartSummary = document.querySelector(".order-summary");
let subtotalElement = document.getElementById("summary-subtotal");
let summartTotalElement = document.getElementById("summary-total");
let gstElement = document.getElementById("summary-tax");
let checkoutBtn = document.querySelector(".checkout-btn");
let subtotal,
  quantityMax = 50,
  quantityMin = 1;

backBtn.addEventListener("click", () => {
  header.style.display = "flex";
  productsContainer.style.display = "flex";
  cartPage.style.display = "none";
});

cartBtn.addEventListener("click", () => {
  header.style.display = "none";
  productsContainer.style.display = "none";
  cartPage.style.display = "block";
  if (cart.length === 0) {
    showEmptyCartMessage();
  } else {
    updateCartHTML();
    updateCartTotals();
    setEventListenersOnRemoveButtons();
  }
});

checkoutBtn.addEventListener("click", () => {
  alert("Thank you for your purchase!");
});

cartItems[0].addEventListener("click", (e) => {
  let button = e.target;
  if (
    button.classList.contains("minus-button") ||
    button.classList.contains("plus-button")
  ) {
    setPlusMinusButtons(button);
    return;
  } else if (!button.classList.contains("add-to-cart")) {
    return;
  }
  let cartItem = button.closest(".cart-items");
  let product = getProductData(cartItem);
  let { name, price, quantity, image, subtotal, id } = product;
  let existingItem = cart.some((item) => item.id === id);
  if (existingItem) {
    getcartDataAndUpdateCart(product);
  } else if (!existingItem) {
    if (cart.length === 0) {
      cartContainer.innerHTML = "";
    }
    cart.push(product);
    cartContainer.innerHTML += getCartItemHTML(
      name,
      price,
      quantity,
      image,
      subtotal,
      id,
    );
    setEventListenersOnRemoveButtons();
  }
  updateCartTotals();
  sessionStorage.setItem(`cartItems`, JSON.stringify(cart));
  header.style.display = "none";
  productsContainer.style.display = "none";
  cartPage.style.display = "block";
});

function updateCartTotals() {
  let total = cart.reduce((acc, item) => acc + item.subtotal, 0);
  let GstAmount = (total * 18) / 100;
  subtotalElement.textContent = `₹${total}`;
  summartTotalElement.textContent = `₹${total + GstAmount}`;
  gstElement.textContent = `18%`;
}

function getcartDataAndUpdateCart(product) {
  let { name, price, quantity, image, subtotal, id } = product;
  cart = cart.map((item) => {
    if (item.id === id) {
      return { ...item, quantity: item.quantity + quantity };
    }
    return item;
  });
  let updatedItem = cart.find((item) => item.id === id);
  let card = cartContainer.querySelector(`.cart-card[data-id="${id}"]`);
  let middleCard = card.querySelector(".cart-middle");
  middleCard.querySelector("p:nth-child(3)").textContent =
    `Quantity: ${updatedItem.quantity}`;
  (
    middleCard.querySelector("p:nth-child(4)") ||
    middleCard.querySelector("p:nth-child(5)")
  ).textContent = `Subtotal: ₹${updatedItem.subtotal}`;
}

function getProductData(cartItem) {
  let name = cartItem.querySelector("h2").textContent;
  let price = parseInt(
    cartItem.querySelector("p").textContent.replace("Price: ₹", ""),
  );
  let image = cartItem.querySelector("img").src;
  let id = cartItem.getAttribute("data-id");
  let quantity = parseInt(
    cartItem.querySelector(".quantity-box").querySelector(".quantity")
      .textContent,
  );
  let subtotal = price * quantity;
  let product = {
    name: name,
    price: price,
    quantity: quantity,
    image: image,
    subtotal: subtotal,
    id: id,
  };
  return product;
}

function updateCartHTML() {
  cartContainer.innerHTML = "";
  cart.forEach((item) => {
    cartContainer.innerHTML += getCartItemHTML(
      item.name,
      item.price,
      item.quantity,
      item.image,
      item.subtotal,
      item.id,
    );
  });
}

function setPlusMinusButtons(button) {
  let quantityElement = button.parentElement.querySelector(".quantity");
  let isPlusButton = button.classList.contains("plus-button");
  let isMinusButton = button.classList.contains("minus-button");
  let quantity = parseInt(quantityElement.textContent);
  if (isPlusButton && quantity < quantityMax) {
    quantityElement.textContent = quantity + 1;
  } else if (isMinusButton && quantity > quantityMin) {
    quantityElement.textContent = quantity - 1;
  } else if (quantity >= quantityMax) {
    quantityElement.textContent = quantityMax;
  }
}

function setEventListenersOnRemoveButtons() {
  cartContainer.addEventListener("click", (e) => {
    let btn = e.target;
    if (
      btn.classList.contains("minus-button") ||
      btn.classList.contains("plus-button")
    ) {
      setPlusMinusButtons(btn);
    } else if (btn.classList.contains("remove-btn")) {
      let cartItem = btn.closest(".cart-card");
      let name = cartItem.querySelector("h2").textContent;
      let price = cartItem.querySelector("p").textContent;
      let id = cartItem.getAttribute("data-id");
      cart = cart.filter((item) => item.id !== id);
      sessionStorage.setItem("cartItems", JSON.stringify(cart));
      cartItem.remove();
      if (cart.length === 0) {
        showEmptyCartMessage();
      }
    }
    updateCartTotals();
  });
}

function showEmptyCartMessage() {
  cartContainer.innerHTML = `
           <h2 class="empty-cart">Your cart is empty</h2>
        `;
  subtotalElement.textContent = `₹0`;
  summartTotalElement.textContent = `₹0`;
  gstElement.textContent = `0%`;
}

function getCartItemHTML(name, price, quantity, image, subtotal, id) {
  return `<div class="cart-card" data-id="${id}">
   <div class="cart-left">
      <img
      src="${image}"
      class="cart-image"
      >
   </div>
   <div class="cart-middle">
      <h2>${name}</h2>
      <p>${price}</p>
      <p class="cart-quantity">
         Quantity: ${quantity}
      </p>
      <p class="cart-subtotal">
         Subtotal: ₹${subtotal}
      </p>
   </div>
   <div class="cart-right">
      <button class="remove-btn">
         Remove
      </button>
   </div>
</div>
`;
}
