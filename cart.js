console.log("connected");
let minusButton = document.querySelectorAll(".minus-button");
let plusButton = document.querySelectorAll(".plus-button");
let quantityElement = document.querySelectorAll(".quantity");
let addToCartButtons = document.querySelectorAll(".add-to-cart");

let cart = JSON.parse(sessionStorage.getItem("cartItems")) || [];
minusButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    let quantity = parseInt(quantityElement[index].textContent);
    if (quantity > 1) {
      quantityElement[index].textContent = quantity - 1;
    }
  });
});

plusButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    let quantity = parseInt(quantityElement[index].textContent);
    quantityElement[index].textContent = quantity + 1;
  });
});

addToCartButtons.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    let quantity = parseInt(quantityElement[index].textContent);
    let cartItem = button.closest(".cart-items");
    let name = cartItem.querySelector("h2").textContent;
    let price = cartItem.querySelector("p").textContent;
    let image =cartItem.querySelector("img").src;
    let product = {
      name: name,
      price: price,
      quantity: quantity,
      image: image
    };
    cart.push(product);
    sessionStorage.setItem(`cartItems`, JSON.stringify(cart));
      /* GO TO CART PAGE */
    window.location.href = "cart.html";
  });
});
