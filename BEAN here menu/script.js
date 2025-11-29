// --- Firebase Setup ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDONkqXl_yn_gbPQWsALfOOHhPoVm3N41U",
  authDomain: "bean-hear-authentication.firebaseapp.com",
  projectId: "bean-hear-authentication",
  storageBucket: "bean-hear-authentication.firebasestorage.app",
  messagingSenderId: "158281052460",
  appId: "1:158281052460:web:4aedd863e7e419103f3c89"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Admin Emails ---
const adminEmails = ["admin@mycafe.com", "owner@mycafe.com"];

// --- Modal Logic ---
const logoBtn = document.getElementById("logoBtn");
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");

logoBtn.addEventListener("click", () => authModal.classList.remove("hidden"));
closeModal.addEventListener("click", () => authModal.classList.add("hidden"));

// --- Auth Logic ---
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    document.getElementById("authMsg").textContent = "Signup successful!";
  } catch (err) {
    document.getElementById("authMsg").textContent = err.message;
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("authMsg").textContent = "Login successful!";
  } catch (err) {
    document.getElementById("authMsg").textContent = err.message;
  }
});

// --- Redirect if Admin ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (adminEmails.includes(user.email)) {
      // Redirect to admin page
      window.location.href = "admin.html";
    } else {
      authModal.classList.add("hidden"); // close modal for normal users
    }
  }
});

// --- Menu Rendering (your existing renderMenu function) ---

// Menu data
const menuData = {
    hotDrinks: [
        { name: "Espresso", description: "", price: "70,000L.L", img: "" },
        { name: "Nescafe ", description: "", price: "100,000L.L", img: "" },
        { name: "Cappuccino", description: "", price: "120,000L.L", img: "" },
        { name: "Tea", description: "", price: "50,000L.L", img: "" },
        { name: "Zhorat", description: "", price: "50,000L.L", img: "" },
        { name: "Coffee Latte", description: "", price: "280,000L.L", img: "" },
        { name: "Caramel Latte", description: "", price: "280,000L.L", img: "" },
        { name: "Vanilla Latte", description: "", price: "280,000L.L", img: "" },
        { name: "White Mocha", description: "", price: "280,000L.L", img: "" },
        { name: "Mocha", description: "", price: "280,000L.L", img: "" },
        { name: "BEAN here Special", description: "", price: "280,000L.L", img: "" },
    ],
    coldDrinks: [
        { name: "Caramel Iced Coffee", description: "", price: "250,000L.L", img: "" },
        { name: "Vanilla Iced Coffee", description: "", price: "250,000L.L", img: "" },
        { name: "Caramel Frappe", description: "", price: "280,000L.L", img: "" },
        { name: "Vanilla Frappe", description:"", price:"280,000L.L", img:""},
        { name: "Iced Tea Peach", description: "", price: "250,000L.L", img: "" },
        { name: "Orange Juice", description: "", price: "200,000L.L", img: "" },
        { name: "BoomBoom Mix", description: "", price: "200,000L.L", img: "" }, 
        { name: "Sparkling Water", description: "", price: "100,000L.L", img: "" },
        { name: "Water", description: "", price: "30,000L.L", img: "" },
        { name: "Juice Glass", description: "", price: "60,000L.L", img: "" },
        { name: "Juice Carton", description: "", price: "30,000L.L", img: "" },
        { name: "Laziza", description: "", price: "100,000L.L", img: "" },
        { name: "Iced Coffee", description: "Regular", price: "100,000L.L", img: "" },  

    ],  
    smoothiesAndShakes: [
        { name: "Strawberry Shake", description: "", price: "280,000L.L", img: "" },
        { name: "Vanilla Shake", description: "", price: "280,000L.L", img: "" },
        { name: "Caramel Shake", description: "", price: "280,000L.L", img: "" },
        { name: "lotus Shake", description: "", price: "300,000L.L", img: "" },
        { name: "Nutella Shake", description: "", price: "300,000L.L", img: "" },
        
        { name: "Strawberry Smoothie", description: "", price: "280,000L.L", img: "" },
        { name: "Mix Berries Smoothie", description: "", price: "280,000L.L", img: "" },
        { name: "Mango Smoothie", description: "", price: "280,000L.L", img: "" },
        { name: "Passion Smoothie", description: "", price: "280,000L.L", img: "" },
        { name: "Mango Passion Smoothie", description: "", price: "280,000L.L", img: "" },
        
    ],
    food: [
        { name: "Cheese Croissant", description: "", price: "100,000L.L", img: "" },
        { name: "Chocolate Croissant", description: "", price: "100,000L.L", img: "" },
        { name: "Cheese Saj", description: "", price: "200,000L.L", img: "" },
        { name: "Zaatar Saj", description: "", price: "100,000L.L", img: "" },
        { name: "Cocktail Saj", description: "", price: "150,000L.L", img: "" },
        { name: "Turkey Cheese Saj", description: "", price: "250,000L.L", img: "" },
        { name: "Saj Extras", description: "", price: "50,000L.L", img: "" },
    ],
    desserts: [
        { name: "Crepe", description: "", price: "400,000L.L", img: "" },
        { name: "Brownies Cup", description: "", price: "200,000L.L", img: "" },
        { name: "Tiramisu", description: "", price: "200,000L.L", img: "" },
        { name: "Jello", description: "", price: "100,000L.L", img: "" },
    ],
    shisha: [
        { name: "Double Apple", description: "", price: "350,000L.L", img: "imgs/items/shisha.png" },
        { name: "Lemon & Mint", description: "", price: "350,000L.L", img: "imgs/items/shisha.png" },
        { name: "Love", description: "", price: "350,000L.L", img: "imgs/items/shisha.png" },
        { name: "Grape & Mint", description: "", price: "350,000L.L", img: "imgs/items/shisha.png" },
       
    ]
};

function createCard(item) {
    const card = document.createElement("div");
    card.className = "menu-item";
    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;
    img.onerror = function () {
        this.onerror = null;
        this.src = "imgs/no_img.jpg";
    };

    const details = document.createElement("div");
    details.className = "menu-details";
    details.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p class="price">${item.price}</p>
  `;

    card.appendChild(img);
    card.appendChild(details);

    return card;
}

function renderMenu() {
    // Hot Drinks
    const hotGrid = document.getElementById("hotDrinksGrid");
    hotGrid.innerHTML = "";
    menuData.hotDrinks.forEach(item => hotGrid.appendChild(createCard(item)));

    // Cold Drinks Subsections
    const coldGrid = document.getElementById("coldDrinksGrid");
    coldGrid.innerHTML = "";
    menuData.coldDrinks.forEach(item => coldGrid.appendChild(createCard(item)));
    //smoothiesAndShakes
    const smoothieGrid = document.getElementById("smoothiesAndShakesGrid");
    smoothieGrid.innerHTML = "";
    menuData.smoothiesAndShakes.forEach(item => smoothieGrid.appendChild(createCard(item)));
    //Food
    const foodGrid = document.getElementById("foodGrid");
    foodGrid.innerHTML = "";
    menuData.food.forEach(item => foodGrid.appendChild(createCard(item)));
    // Desserts
    const dessertGrid = document.getElementById("dessertsGrid");
    dessertGrid.innerHTML = "";
    menuData.desserts.forEach(item => dessertGrid.appendChild(createCard(item)));
    // Shisha
    const shishaGrid = document.getElementById("shishaGrid");
    shishaGrid.innerHTML = "";
    menuData.shisha.forEach(item => shishaGrid.appendChild(createCard(item)));

         
}


// Scroll to top button logic
function handleScroll() {
    const btn = document.getElementById("back-to-top");
    btn.style.display = window.scrollY > 400 ? "flex" : "none";
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Event bindings
window.onload = () => {
    window.scrollTo(0, 0);
    renderMenu();

    // Other buttons
    document.getElementById("back-to-top").addEventListener("click", scrollToTop);
    window.addEventListener("scroll", handleScroll);
};