import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config 
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
const db = getFirestore(app);

// Admin emails
const adminEmails = ["admin@beanhere.com"];

// Modal logic
const logoBtn = document.getElementById("logoBtn");
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");

logoBtn.addEventListener("click", () => authModal.classList.remove("hidden"));
closeModal.addEventListener("click", () => authModal.classList.add("hidden"));

// Login only
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("authMsg").textContent = "Login successful!";
  } catch (err) {
    document.getElementById("authMsg").textContent = err.message;
  }
});

// Redirect admin
onAuthStateChanged(auth, (user) => {
  if (user && adminEmails.includes(user.email)) {
    window.location.href = "admin.html";
  } else {
    authModal.classList.add("hidden");
  }
});

// Load menu from Firestore
async function loadMenu(category, gridId) {
  const colRef = collection(db, "menuData", category, "items");
  const snapshot = await getDocs(colRef);
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const grid = document.getElementById(gridId);
  grid.innerHTML = "";
  items.forEach(item => grid.appendChild(createCard(item)));
}

function createCard(item) {
  const card = document.createElement("div");
  card.className = "menu-item";
  card.innerHTML = `
    <img src="${item.img || "imgs/no_img.png"}" alt="${item.name}">
    <div class="menu-details">
      <h3>${item.name}</h3>
      <p>${item.description || ""}</p>
      <p class="price">${item.price}</p>
    </div>
  `;
  return card;
}

// Back-to-top
const backToTopBtn = document.getElementById("back-to-top");
function handleScroll() {
  backToTopBtn.style.display = window.scrollY > 400 ? "flex" : "none";
}
backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", handleScroll);

// Init
window.onload = async () => {
  await Promise.all([
    loadMenu("hotDrinks", "hotDrinksGrid"),
    loadMenu("smoothiesAndShakes", "smoothiesAndShakesGrid"),
    loadMenu("coldDrinks", "coldDrinksGrid"),
    loadMenu("food", "foodGrid"),
    loadMenu("desserts", "dessertsGrid"),
    loadMenu("shisha", "shishaGrid")
  ]);
  handleScroll();
};


