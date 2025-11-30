import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Firebase Config
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

// 2. Admin Emails (LOWERCASE ONLY)
const adminEmails = ["admin@beanhere.com"];

// 3. Categories
const categories = [
  "hotDrinks", "smoothiesAndShakes","coldDrinks","food", "desserts", "shisha"];

// VARIABLES TO TRACK EDITING
let currentEditId = null;
let currentEditCategory = null;

// DOM Elements for Modal
const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const editForm = document.getElementById("editForm");

// Close Modal Logic
closeEditModal.addEventListener("click", () => editModal.classList.add("hidden"));
window.onclick = (e) => {
  if (e.target == editModal) editModal.classList.add("hidden");
};

// 4. Auth Guard
onAuthStateChanged(auth, async (user) => {
  if (!user || !adminEmails.includes(user.email)) {
    window.location.href = "index.html";
    return;
  }
  await renderDashboard();
});

// 5. Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// 6. Save Edited Data
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newName = document.getElementById("editName").value;
  const newDesc = document.getElementById("editDesc").value;
  const newPrice = document.getElementById("editPrice").value;
  const newImg = document.getElementById("editImg").value;

  try {
    const ref = doc(db, "menuData", currentEditCategory, "items", currentEditId);
    await updateDoc(ref, {
      name: newName,
      description: newDesc,
      price: newPrice,
      img: newImg
    });

    alert("Item updated successfully!");
    editModal.classList.add("hidden"); // Close modal
    await renderDashboard(); // Refresh screen
  } catch (err) {
    alert("Error updating: " + err.message);
  }
});

// 7. Render Dashboard
async function renderDashboard() {
  const container = document.getElementById("adminContainer");
  container.innerHTML = "";

  for (const category of categories) {
    const colRef = collection(db, "menuData", category, "items");
    const snapshot = await getDocs(colRef);
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    const sectionEl = document.createElement("section");
    sectionEl.className = "section";
    
    // Add Category Title
    const title = document.createElement("h2");
    title.textContent = category.replace(/([A-Z])/g, " $1").trim(); // Fix camelCase
    title.style.textTransform = "capitalize";
    sectionEl.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-item";
      card.innerHTML = `
        <img src="${item.img || 'imgs/no_img.png'}" onerror="this.src='imgs/no_img.png'">
        <div class="menu-details">
          <h3>${item.name}</h3>
          <p>${item.description || ""}</p>
          <p class="price">${item.price}</p>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete" style="background:red; color:white; border:none; padding:5px;">Delete</button>
          </div>
        </div>
      `;

      // --- EDIT BUTTON CLICK ---
      card.querySelector(".btn-edit").addEventListener("click", () => {
        // 1. Save ID and Category to global variables
        currentEditId = item.id;
        currentEditCategory = category;

        // 2. Fill the form with current data
        document.getElementById("editName").value = item.name;
        document.getElementById("editDesc").value = item.description || "";
        document.getElementById("editPrice").value = item.price;
        document.getElementById("editImg").value = item.img || "";

        // 3. Show the modal
        editModal.classList.remove("hidden");
      });

      // --- DELETE BUTTON CLICK ---
      card.querySelector(".btn-delete").addEventListener("click", async () => {
        if(confirm("Delete " + item.name + "?")) {
          await deleteDoc(doc(db, "menuData", category, "items", item.id));
          await renderDashboard();
        }
      });

      grid.appendChild(card);
    });

    // Add New Item Button (Simple Prompt for Add, Modal for Edit)
    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add New Item";
    addBtn.style.marginTop = "10px";
    addBtn.addEventListener("click", async () => {
      const name = prompt("Item Name:");
      if(!name) return;
      const price = prompt("Price:");
      await addDoc(collection(db, "menuData", category, "items"), {
        name: name, price: price, description: "", img: ""
      });
      await renderDashboard();
    });

    sectionEl.appendChild(grid);
    sectionEl.appendChild(addBtn);
    container.appendChild(sectionEl);
  }
}


