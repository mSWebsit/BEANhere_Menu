import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// State
let categories = [];
let subCatOrderMap = {}; // Will store { "coldDrinks": ["Frappe", "Juice"] }

// DOM Elements
const editModal = document.getElementById("editModal");
const addModal = document.getElementById("addModal");
const catModal = document.getElementById("catModal");
const subCatModal = document.getElementById("subCatModal");

const closeEditModal = document.getElementById("closeEditModal");
const closeAddModal = document.getElementById("closeAddModal");
const closeCatModal = document.getElementById("closeCatModal");
const closeSubCatModal = document.getElementById("closeSubCatModal");

// --- MODAL HANDLERS ---
closeEditModal.addEventListener("click", () => editModal.classList.add("hidden"));
closeAddModal.addEventListener("click", () => addModal.classList.add("hidden"));
closeCatModal.addEventListener("click", () => catModal.classList.add("hidden"));
closeSubCatModal.addEventListener("click", () => subCatModal.classList.add("hidden"));

window.onclick = (e) => { 
  if(e.target == editModal) editModal.classList.add("hidden");
  if(e.target == addModal) addModal.classList.add("hidden");
  if(e.target == catModal) catModal.classList.add("hidden");
  if(e.target == subCatModal) subCatModal.classList.add("hidden");
};

document.getElementById("openAddModalBtn").addEventListener("click", () => {
  document.getElementById("addForm").reset();
  addModal.classList.remove("hidden");
});

document.getElementById("openCatModalBtn").addEventListener("click", () => {
  renderCategoryManager();
  catModal.classList.remove("hidden");
});

document.getElementById("openSubCatModalBtn").addEventListener("click", async () => {
  await populateSubCatDropdown();
  subCatModal.classList.remove("hidden");
});
document.getElementById("openItemOrderModalBtn").addEventListener("click", async () => {
  await populateDropdown(document.getElementById("itemOrderCatSelector"), renderItemOrderList);
  itemOrderModal.classList.remove("hidden");
});
// Auth
onAuthStateChanged(auth, async (user) => {
  if (!user || !adminEmails.includes(user.email)) {
    window.location.href = "index.html";
    return;
  }
  await fetchConfig(); // Load Categories & SubCat Order
  populateCategoryDropdown();
  await renderDashboard();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// --- FETCH CONFIG ---
async function fetchConfig() {
  const docRef = doc(db, "config", "menuSettings");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    categories = data.categoryOrder || ["hotDrinks", "coldDrinks", "food", "desserts", "snacks", "shisha"];
    subCatOrderMap = data.subCategoryOrder || {};
  } else {
    categories = ["hotDrinks", "coldDrinks", "food", "desserts", "snacks", "shisha"];
    subCatOrderMap = {};
  }
}

async function saveConfig() {
  await setDoc(doc(db, "config", "menuSettings"), {
    categoryOrder: categories,
    subCategoryOrder: subCatOrderMap
  });
}

// Helpers
function formatTitle(str) {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}

function populateCategoryDropdown() {
  const select = document.getElementById("addCategory");
  select.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = formatTitle(cat);
    select.appendChild(option);
  });
}

// --- SUB-GROUP MANAGER LOGIC ---
async function populateSubCatDropdown() {
    const select = document.getElementById("subCatSelector");
    select.innerHTML = "";
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = formatTitle(cat);
        select.appendChild(option);
    });
}
    
    // Load the first one by default
    if(categories.length > 0) await renderSubCatList(categories[0]);

    // Change listener
    select.onchange = (e) => renderSubCatList(e.target.value);
    //--- 1. ITEM REORDER LOGIC ---
    async function renderItemOrderList(category) {
    const container = document.getElementById("itemOrderListContainer");
    container.innerHTML = "Loading...";

    const colRef = collection(db, "menuData", category, "items");
    const snapshot = await getDocs(colRef);
    let items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Sort by order
    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    container.innerHTML = "";
    if(items.length === 0) {
        container.innerHTML = "<p>No items in this category.</p>";
        return;
    }

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "category-list-item";
        // Show Name + Group if exists
        const label = item.name + (item.subcategory ? ` <small>[${item.subcategory}]</small>` : "");
        
        div.innerHTML = `
            <span class="cat-name">${label}</span>
            <div class="list-controls">
                <button class="btn-up">↑</button>
                <button class="btn-down">↓</button>
            </div>
        `;

        div.querySelector(".btn-up").addEventListener("click", () => moveItemInList(category, item.id, -1, items));
        div.querySelector(".btn-down").addEventListener("click", () => moveItemInList(category, item.id, 1, items));
        container.appendChild(div);
    });
}

// --- 2. SUB-GROUP MANAGER LOGIC ---

async function renderSubCatList(category) {
    const container = document.getElementById("subCatListContainer");
    container.innerHTML = "Loading...";

    // 1. Get all items to find existing sub-groups
    const colRef = collection(db, "menuData", category, "items");
    const snapshot = await getDocs(colRef);
    const uniqueGroups = new Set();
    snapshot.forEach(doc => {
        const d = doc.data();
        if(d.subcategory && d.subcategory.trim() !== "") {
            uniqueGroups.add(d.subcategory.trim());
        }
    });

    let groupsArray = Array.from(uniqueGroups);

    // 2. Sort based on saved order
    const savedOrder = subCatOrderMap[category] || [];
    groupsArray.sort((a, b) => {
        const indexA = savedOrder.indexOf(a);
        const indexB = savedOrder.indexOf(b);
        // If both exist in saved order, sort by index. If not, push to end.
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    // 3. Render List
    container.innerHTML = "";
    if(groupsArray.length === 0) {
        container.innerHTML = "<p>No groups found in this category.</p>";
        return;
    }

    groupsArray.forEach((group, index) => {
        const div = document.createElement("div");
        div.className = "category-list-item";
        div.innerHTML = `
            <span>${group}</span>
            <div>
                <button class="btn-move btn-up">↑</button>
                <button class="btn-move btn-down">↓</button>
            </div>
        `;
        
        div.querySelector(".btn-up").addEventListener("click", async () => {
            if(index > 0) {
                [groupsArray[index], groupsArray[index-1]] = [groupsArray[index-1], groupsArray[index]];
                subCatOrderMap[category] = groupsArray;
                await saveConfig();
                renderSubCatList(category);
            }
        });

        div.querySelector(".btn-down").addEventListener("click", async () => {
            if(index < groupsArray.length - 1) {
                [groupsArray[index], groupsArray[index+1]] = [groupsArray[index+1], groupsArray[index]];
                subCatOrderMap[category] = groupsArray;
                await saveConfig();
                renderSubCatList(category);
            }
        });

        container.appendChild(div);
    });
}

// --- 3. CATEGORY MANAGER LOGIC ---
function renderCategoryManager() {
    const container = document.getElementById("categoryListContainer");
    container.innerHTML = "";

    categories.forEach((cat, index) => {
        const div = document.createElement("div");
        div.className = "category-list-item";
        div.innerHTML = `
            <span class="cat-name">${formatTitle(cat)}</span>
            <div>
                <button class="btn-move btn-up">↑</button>
                <button class="btn-move btn-down">↓</button>
            </div>
        `;

        div.querySelector(".btn-up").addEventListener("click", async () => {
            if (index > 0) {
                [categories[index], categories[index - 1]] = [categories[index - 1], categories[index]];
                await saveConfig();
                renderCategoryManager();
                renderDashboard();
            }
        });

        div.querySelector(".btn-down").addEventListener("click", async () => {
            if (index < categories.length - 1) {
                [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
                await saveConfig();
                renderCategoryManager();
                renderDashboard();
            }
        });

        container.appendChild(div);
    });
}

// --- 4.ITEM ORDER LOGIC ---
async function moveItem(category, itemId, direction, currentItems) {
    const index = currentItems.findIndex(i => i.id === itemId);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;

    const itemA = currentItems[index];
    const itemB = currentItems[targetIndex];

    const tempOrder = itemA.order;
    itemA.order = itemB.order;
    itemB.order = tempOrder;

    const refA = doc(db, "menuData", category, "items", itemA.id);
    const refB = doc(db, "menuData", category, "items", itemB.id);

    await Promise.all([
        updateDoc(refA, { order: itemA.order }),
        updateDoc(refB, { order: itemB.order })
    ]);

    await renderDashboard();
}

// --- CRUD ---
document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const cat = document.getElementById("addCategory").value;
  const colRef = collection(db, "menuData", cat, "items");
  const snap = await getDocs(colRef);
  const newOrder = snap.size + 1;

  try {
    await addDoc(colRef, {
      name: document.getElementById("addName").value, 
      subcategory: document.getElementById("addSubCat").value.trim(), 
      description: document.getElementById("addDesc").value, 
      price: document.getElementById("addPrice").value, 
      img: document.getElementById("addImgUrl").value,
      order: newOrder
    });
    alert("Added!");
    addModal.classList.add("hidden");
    await renderDashboard();
  } catch (err) { alert(err.message); }
});

let currentEditId = null;
let currentEditCategory = null;

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const ref = doc(db, "menuData", currentEditCategory, "items", currentEditId);
    await updateDoc(ref, {
      name: document.getElementById("editName").value,
      subcategory: document.getElementById("editSubCat").value.trim(),
      description: document.getElementById("editDesc").value,
      price: document.getElementById("editPrice").value,
      img: document.getElementById("editImgUrl").value
    });
    alert("Updated!");
    editModal.classList.add("hidden");
    await renderDashboard();
  } catch (err) { alert(err.message); }
});

// --- 5.MAIN RENDER ---
async function renderDashboard() {
  const container = document.getElementById("adminContainer");
  container.innerHTML = "";

  for (const category of categories) {
    const colRef = collection(db, "menuData", category, "items");
    const snapshot = await getDocs(colRef);
    let items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Sort by item order
    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    const sectionEl = document.createElement("section");
    sectionEl.className = "section";
    const title = document.createElement("h2");
    title.textContent = formatTitle(category);
    sectionEl.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    items.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "menu-item";
      const subLabel = item.subcategory ? `<small style="color:blue; font-weight:bold;">[${item.subcategory}]</small><br>` : "";

      card.innerHTML = `
        <div style="display:flex;">
            <div class="order-controls">
                <button class="btn-move btn-item-up">↑</button>
                <button class="btn-move btn-item-down">↓</button>
            </div>
            <img src="${item.img || 'imgs/no_img.png'}" onerror="this.src='imgs/no_img.png'" style="width:100px; height:100px; object-fit:cover;">
            <div class="menu-details">
                <h3>${item.name}</h3>
                ${subLabel}
                <p>${item.price}</p>
                 <div style="display:flex; gap:5px; margin-top:5px;">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Del</button>
                 </div>
            </div>
        </div>
      `;

      card.querySelector(".btn-item-up").addEventListener("click", () => moveItem(category, item.id, -1, items));
      card.querySelector(".btn-item-down").addEventListener("click", () => moveItem(category, item.id, 1, items));
      
      card.querySelector(".btn-edit").addEventListener("click", () => {
        currentEditId = item.id;
        currentEditCategory = category;
        document.getElementById("editName").value = item.name;
        document.getElementById("editSubCat").value = item.subcategory || "";
        document.getElementById("editDesc").value = item.description || "";
        document.getElementById("editPrice").value = item.price;
        document.getElementById("editImgUrl").value = item.img || ""; 
        editModal.classList.remove("hidden");
      });

      card.querySelector(".btn-delete").addEventListener("click", async () => {
        if(confirm("Delete " + item.name + "?")) {
          await deleteDoc(doc(db, "menuData", category, "items", item.id));
          await renderDashboard();
        }
      });

      grid.appendChild(card);
    });

    sectionEl.appendChild(grid);
    container.appendChild(sectionEl);
  }
}





