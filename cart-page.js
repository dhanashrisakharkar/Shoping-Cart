let cartData = JSON.parse(sessionStorage.getItem("cartItems")) || [];
let cartContainer = document.getElementById("cart-container");
let subtotal;

if (cartData.length === 0) {
  cartContainer.innerHTML = `
    <h2 class="empty-cart">Your cart is empty</h2>
    `;
} else {
  for (let data of cartData) {
    subtotal = parseInt(data.price.replace("Price: ₹", "")) * data.quantity;
    cartContainer.innerHTML += `
<div class="products">
     <div class="cart-items">
    <img src="${data.image}" alt=""  style="width: 200px; height: 200px">
   <h2>${data.name}</h2>
   <p>${data.price}</p>
   <p>Quantity: ${data.quantity}</p>
   <p>Subtotal: ₹${subtotal}</p>
   <button class="remove-btn">
      Remove
   </button>
 </div>
</div>
`;
  }
}

let removeBtn = document.querySelectorAll(".remove-btn");
let backBtn = document.querySelector(".back-btn");
if (removeBtn) {
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      let cartItem = btn.closest(".cart-items");
      let name = cartItem.querySelector("h2").textContent;
      let price = cartItem.querySelector("p").textContent;
      cartData = cartData.filter(
        (item) => item.name !== name || item.price !== price,
      );
      sessionStorage.setItem("cartItems", JSON.stringify(cartData));
      cartItem.remove();
      if (cartData.length === 0) {
        cartContainer.innerHTML = `
           <h2 class="empty-cart">Your cart is empty</h2>
        `;
      }
    });
  });
}

backBtn.addEventListener("click", () => {
  window.location.href = "shopping.html";
});
