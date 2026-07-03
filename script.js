/* =========================================================
   GLOBAL STATE (LOCAL STORAGE)
   Stores cart items and comments so data persists after refresh
========================================================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let comments = JSON.parse(localStorage.getItem("comments")) || [];


/* =========================================================
   CART STORAGE SYSTEM
   Saves cart data to localStorage so it persists
========================================================= */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


/* =========================================================
   ADD TO CART FUNCTION
   Adds product to cart or increases quantity if it already exists
========================================================= */
function addToCart(name, price) {
  price = Number(price);

  let item = cart.find(i => i.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  renderCart();
}


/* =========================================================
   REMOVE ITEM FROM CART
   Removes a product completely from the cart
========================================================= */
function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  renderCart();
}


/* =========================================================
   UPDATE QUANTITY
   Increases or decreases product quantity in cart
   Removes item if quantity reaches 0 or less
========================================================= */
function changeQuantity(name, amount) {
  let item = cart.find(i => i.name === name);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(name);
  } else {
    saveCart();
    renderCart();
  }
}


/* =========================================================
   CALCULATE CART TOTAL
   Computes total price of all items in cart
========================================================= */
function calculateTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}


/* =========================================================
   RENDER CART UI
   Displays all cart items dynamically in the HTML page
========================================================= */
function renderCart() {
  const list = document.getElementById("cartList");
  const total = document.getElementById("cartTotal");

  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    total.textContent = "0";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span><strong>${item.name}</strong></span>
      <span>R${item.price}</span>
      <span>Qty: ${item.quantity}</span>

      <button onclick="changeQuantity('${item.name}', 1)">+</button>
      <button onclick="changeQuantity('${item.name}', -1)">-</button>
      <button onclick="removeFromCart('${item.name}')">Remove</button>
    `;

    list.appendChild(div);
  });

  total.textContent = calculateTotal().toFixed(2);
}


/* =========================================================
   CLEAR CART
   Removes all items from cart and updates UI
========================================================= */
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}


/* =========================================================
   LOGIN SYSTEM (COOKIE BASED)
   Stores username in cookies and displays greeting
========================================================= */
function saveUser() {
  const name = document.getElementById("usernameInput").value;
  if (!name) return;

  document.cookie = "username=" + name + "; path=/";

  document.getElementById("greeting").textContent =
    "Welcome, " + name + "!";
}


/* =========================================================
   GET USER FROM COOKIES
   Reads stored username from browser cookies
========================================================= */
function getUser() {
  const cookies = document.cookie.split("; ");
  for (let c of cookies) {
    const [key, value] = c.split("=");
    if (key === "username") return value;
  }
  return null;
}


/* =========================================================
   FONT CUSTOMISATION (SESSION STORAGE)
   Saves selected font for current session only
========================================================= */
function changeFont() {
  const font = document.getElementById("fontSelector").value;

  sessionStorage.setItem("font", font);
  document.body.style.fontFamily = font;
}


/* Loads saved font preference from session storage */
function loadFont() {
  const font = sessionStorage.getItem("font");

  if (font) {
    document.body.style.fontFamily = font;
    document.getElementById("fontSelector").value = font;
  }
}


/* =========================================================
   COMMENTS SYSTEM
   Allows users to post and view product reviews
========================================================= */
function saveComments() {
  localStorage.setItem("comments", JSON.stringify(comments));
}


/* Adds a new comment to the system */
function addComment() {
  const name = document.getElementById("commentName").value;
  const text = document.getElementById("commentText").value;

  if (!name || !text) return;

  comments.push({
    name,
    text,
    date: new Date().toLocaleString()
  });

  saveComments();
  renderComments();

  document.getElementById("commentName").value = "";
  document.getElementById("commentText").value = "";
}


/* Displays all saved comments on the page */
function renderComments() {
  const list = document.getElementById("commentList");
  list.innerHTML = "";

  comments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <strong>${c.name}</strong>
      <p>${c.text}</p>
      <small>${c.date}</small>
    `;

    list.appendChild(div);
  });
}


/* =========================================================
   SERVICE WORKER (CACHE API)
   Enables offline caching of assets for faster loading
========================================================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => {
      const cacheMsg = document.getElementById("cacheMsg");

      if (cacheMsg) {
        cacheMsg.textContent =
          "Images are loaded from cache (Service Worker active).";
      }
    })
    .catch(err => console.log("Service Worker failed:", err));
}


/* =========================================================
   PAGE INITIALISATION
   Runs when page loads:
   - Restores user session
   - Loads font preference
   - Renders cart and comments
========================================================= */
window.onload = function () {
  const user = getUser();

  if (user) {
    document.getElementById("greeting").textContent =
      "Welcome back, " + user + "!";
  }

  loadFont();
  renderCart();
  renderComments();
};