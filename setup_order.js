import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDONkqXl_yn_gbPQWsALfOOHhPoVm3N41U",
  authDomain: "bean-hear-authentication.firebaseapp.com",
  projectId: "bean-hear-authentication",
  storageBucket: "bean-hear-authentication.firebasestorage.app",
  messagingSenderId: "158281052460",
  appId: "1:158281052460:web:4aedd863e7e419103f3c89"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// The order you want for categories
const categoriesList = ["hotDrinks", "coldDrinks", "food", "desserts", "snacks", "shisha"];

async function upgradeDatabase() {
  console.log("--- STARTING UPGRADE ---");

  // 1. Save Category Order
  console.log("Saving Category Order...");
  await setDoc(doc(db, "config", "menuSettings"), {
    categoryOrder: categoriesList
  });

  // 2. Add 'order' field to every item
  for (const cat of categoriesList) {
    console.log(`Processing ${cat}...`);
    const colRef = collection(db, "menuData", cat, "items");
    const snapshot = await getDocs(colRef);
    
    let index = 0;
    const updates = [];
    
    snapshot.forEach((document) => {
      index++;
      // Assign an order number (1, 2, 3...)
      const promise = updateDoc(document.ref, { order: index });
      updates.push(promise);
    });
    
    await Promise.all(updates);
  }

  alert("Upgrade Complete! You now have permanent sorting capability.");
  console.log("--- DONE ---");
}

window.onload = upgradeDatabase;