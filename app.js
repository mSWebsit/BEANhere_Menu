import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const adminEmails = ["admin@beanhere.com", "owner@mycafe.com", "mhmd@gmail.com"];

const logoBtn = document.getElementById("logoBtn");
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");

if(logoBtn) logoBtn.addEventListener("click", () => authModal.classList.remove("hidden"));
if(closeModal) closeModal.addEventListener("click", () => authModal.classList.add("hidden"));

const loginForm = document.getElementById("loginForm");
if(loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      document.getElementById("authMsg").textContent = "Login successful!";
    } catch (err) {
      document.getElementById("authMsg").textContent = err.message;
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user && adminEmails.includes(user.email)) {
    window.location.href = "admin.html";
  } else {
    if(authModal) authModal.classList.add("hidden");
  }
});

// GLOBAL VARS FOR ORDER
let subCatOrderMap = {};

// 1. INIT
async function initMenu() {
    let categories = [];
    try {
        const docRef = doc(db, "config", "menuSettings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            categories = data.categoryOrder || ["hotDrinks", "coldDrinks", "food", "desserts", "snacks", "shisha"];
            subCatOrderMap = data.subCategoryOrder || {};
        } else {
            categories = ["hotDrinks", "coldDrinks", "food", "desserts", "snacks", "shisha"];
        }
    } catch (e) {
        categories = ["hotDrinks", "coldDrinks", "food", "desserts", "snacks", "shisha"];
    }

    const container = document.getElementById("dynamicMenuContainer");
    container.innerHTML = "";
    
    const navUl = document.querySelector("nav ul");
    if(navUl) navUl.innerHTML = ""; 

    for (const cat of categories) {
        // Nav
        if(navUl) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#${cat}`;
            a.textContent = cat.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
            li.appendChild(a);
            navUl.appendChild(li);
        }

        // Section
        const section = document.createElement("section");
        section.id = cat;
        section.className = "section";
        section.innerHTML = `
            <h2>${cat.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</h2>
            <div id="${cat}Grid" class="menu-grid"></div>
        `;
        
        container.appendChild(section);
        await loadMenu(cat, `${cat}Grid`);
    }
}


async function loadMenu(category, gridId) {
  const grid = document.getElementById(gridId);
  const colRef = collection(db, "menuData", category, "items");
  const snapshot = await getDocs(colRef);
  let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // SORT ITEMS
  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  grid.innerHTML = ""; 

  const hasSubGroups = items.some(item => item.subcategory && item.subcategory.trim() !== "");

  if (hasSubGroups) {
    grid.className = ""; 
    const groups = {};
    const others = [];

    items.forEach(item => {
      if (item.subcategory && item.subcategory.trim() !== "") {
        const sub = item.subcategory.trim();
        if (!groups[sub]) groups[sub] = [];
        groups[sub].push(item);
      } else {
        others.push(item);
      }
    });

    // Sort Groups based on saved order
    const groupKeys = Object.keys(groups);
    const savedOrder = subCatOrderMap[category] || [];
    
    groupKeys.sort((a, b) => {
        const indexA = savedOrder.indexOf(a);
        const indexB = savedOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    // Render Sorted Groups
    for (const groupName of groupKeys) {
      const title = document.createElement("h3");
      title.textContent = groupName;
      title.style.marginTop = "25px";
      title.style.borderBottom = "2px solid #ddd";
      title.style.color = "#0A3325";
      title.style.display = "inline-block";
      title.style.marginBottom = "10px";
      grid.appendChild(title);

      const subGrid = document.createElement("div");
      subGrid.className = "menu-grid";
      groups[groupName].forEach(item => subGrid.appendChild(createCard(item)));
      grid.appendChild(subGrid);
    }

    if (others.length > 0) {
      const otherTitle = document.createElement("h3");
      otherTitle.textContent = "Others";
      otherTitle.style.marginTop = "25px";
      otherTitle.style.borderBottom = "2px solid #ddd";
      grid.appendChild(otherTitle);
      const otherGrid = document.createElement("div");
      otherGrid.className = "menu-grid";
      others.forEach(item => otherGrid.appendChild(createCard(item)));
      grid.appendChild(otherGrid);
    }
  } else {
    grid.className = "menu-grid";
    items.forEach(item => grid.appendChild(createCard(item)));
  }
}

function createCard(item) {
  const card = document.createElement("div");
  card.className = "menu-item";
  const imgSrc = item.img ? item.img : "imgs/no_img.png";
  
  card.innerHTML = `
    <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null;this.src='imgs/no_img.png';">
    <div class="menu-details">
      <h3>${item.name}</h3>
      <p>${item.description || ""}</p>
      <p class="price">${item.price}</p>
    </div>
  `;
  return card;
}

const backToTopBtn = document.getElementById("back-to-top");
if(backToTopBtn) {
  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 400 ? "flex" : "none";
  });
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

window.onload = initMenu;
