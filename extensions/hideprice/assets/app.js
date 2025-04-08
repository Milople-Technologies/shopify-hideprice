document.addEventListener("DOMContentLoaded", () => {
    const priceElements = document.querySelectorAll(".price, .product-price");
  
    priceElements.forEach((el) => {
      el.style.display = "none";
    });
  
    const msg = document.getElementById("hide-price-message");
    if (msg) msg.style.display = "block";
  });
  