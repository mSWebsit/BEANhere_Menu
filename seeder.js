import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- 1. DATA PREPARED FOR NEW STRUCTURE ---
// Note: Smoothies/Shakes are now inside 'coldDrinks' with subcategories
const menuData = {
    hotDrinks: [
        { name: "Espresso", subcategory: "", price: "70,000L.L", description: "", img: "" },
        { name: "Nescafe", subcategory: "", price: "100,000L.L", description: "", img: "" },
        { name: "Cappuccino", subcategory: "", price: "120,000L.L", description: "", img: "" },
        { name: "Tea", subcategory: "", price: "50,000L.L", description: "", img: "" },
        { name: "Zhorat", subcategory: "", price: "50,000L.L", description: "", img: "" },
        { name: "Coffee Latte", subcategory: "", price: "280,000L.L", description: "", img: "" },
        { name: "Caramel Latte", subcategory: "", price: "280,000L.L", description: "", img: "" },
        { name: "Vanilla Latte", subcategory: "", price: "280,000L.L", description: "", img: "" },
        { name: "White Mocha", subcategory: "", price: "280,000L.L", description: "", img: "" },
        { name: "Mocha", subcategory: "", price: "280,000L.L", description: "", img: "" },
        { name: "BEAN here Special", subcategory: "", price: "280,000L.L", description: "", img: "" },
    ],
    coldDrinks: [
        // Iced Coffee Group
        { name: "Caramel Iced Coffee", subcategory: "Ice Coffee", price: "250,000L.L", description: "", img: "" },
        { name: "Vanilla Iced Coffee", subcategory: "Ice Coffee", price: "250,000L.L", description: "", img: "" },
        { name: "Iced Coffee (Regular)", subcategory: "Ice Coffee", price: "100,000L.L", description: "", img: "" },
        
        // Frappe Group
        { name: "Caramel Frappe", subcategory: "Frappe", price: "280,000L.L", description: "", img: "" },
        { name: "Vanilla Frappe", subcategory: "Frappe", price: "280,000L.L", description: "", img: "" },

        // Shakes Group (Moved from old category)
        { name: "Strawberry Shake", subcategory: "Shakes", price: "280,000L.L", description: "", img: "" },
        { name: "Vanilla Shake", subcategory: "Shakes", price: "280,000L.L", description: "", img: "" },
        { name: "Caramel Shake", subcategory: "Shakes", price: "280,000L.L", description: "", img: "" },
        { name: "Lotus Shake", subcategory: "Shakes", price: "300,000L.L", description: "", img: "" },
        { name: "Nutella Shake", subcategory: "Shakes", price: "300,000L.L", description: "", img: "" },

        // Smoothies Group (Moved from old category)
        { name: "Strawberry Smoothie", subcategory: "Smoothies", price: "280,000L.L", description: "", img: "" },
        { name: "Mix Berries Smoothie", subcategory: "Smoothies", price: "280,000L.L", description: "", img: "" },
        { name: "Mango Smoothie", subcategory: "Smoothies", price: "280,000L.L", description: "", img: "" },
        { name: "Passion Smoothie", subcategory: "Smoothies", price: "280,000L.L", description: "", img: "" },
        { name: "Mango Passion Smoothie", subcategory: "Smoothies", price: "280,000L.L", description: "", img: "" },

        // Juice/Drinks Group
        { name: "Iced Tea Peach", subcategory: "Juice", price: "250,000L.L", description: "", img: "" },
        { name: "Orange Juice", subcategory: "Juice", price: "200,000L.L", description: "", img: "" },
        { name: "Juice Glass", subcategory: "Juice", price: "60,000L.L", description: "", img: "" },
        { name: "Juice Carton", subcategory: "Juice", price: "30,000L.L", description: "", img: "" },

        // Water/Soft Drinks
        { name: "Sparkling Water", subcategory: "Water", price: "100,000L.L", description: "", img: "" },
        { name: "Water", subcategory: "Water", price: "30,000L.L", description: "", img: "" },
        { name: "Laziza", subcategory: "Soft Drinks", price: "100,000L.L", description: "", img: "" },
        { name: "BoomBoom Mix", subcategory: "Energy Mixes", price: "200,000L.L", description: "", img: "" }, 
    ],
    food: [
        { name: "Cheese Croissant", subcategory: "", price: "100,000L.L", description: "", img: "" },
        { name: "Chocolate Croissant", subcategory: "", price: "100,000L.L", description: "", img: "" },
        { name: "Cheese Saj", subcategory: "", price: "200,000L.L", description: "", img: "" },
        { name: "Zaatar Saj", subcategory: "", price: "100,000L.L", description: "", img: "" },
        { name: "Cocktail Saj", subcategory: "", price: "150,000L.L", description: "", img: "" },
        { name: "Turkey Cheese Saj", subcategory: "", price: "250,000L.L", description: "", img: "" },
        { name: "Saj Extras", subcategory: "", price: "50,000L.L", description: "", img: "" },
    ],
    desserts: [
        { name: "Crepe", subcategory: "", price: "400,000L.L", description: "", img: "" },
        { name: "Brownies Cup", subcategory: "", price: "200,000L.L", description: "", img: "" },
        { name: "Tiramisu", subcategory: "", price: "200,000L.L", description: "", img: "" },
        { name: "Jello", subcategory: "", price: "100,000L.L", description: "", img: "" },
    ],
    snacks: [], // Empty for now, adds the category to structure
    shisha: [
        { name: "Double Apple", subcategory: "", price: "350,000L.L", description: "", img: "imgs/items/shisha.png" },
        { name: "Lemon & Mint", subcategory: "", price: "350,000L.L", description: "", img: "imgs/items/shisha.png" },
        { name: "Love", subcategory: "", price: "350,000L.L", description: "", img: "imgs/items/shisha.png" },
        { name: "Grape & Mint", subcategory: "", price: "350,000L.L", description: "", img: "imgs/items/shisha.png" },
    ]
};

// --- 2. DELETE OLD DATA ---
async function clearCollection(category) {
    const colRef = collection(db, "menuData", category, "items");
    const snapshot = await getDocs(colRef);
    if (snapshot.size === 0) return;
    
    console.log(`Deleting ${snapshot.size} items from ${category}...`);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
}

// --- 3. UPLOAD NEW DATA ---
async function seedDatabase() {
    console.log("--- STARTING DATABASE RESET ---");
    const statusMsg = document.createElement('h1');
    statusMsg.style.textAlign = "center";
    statusMsg.style.padding = "20px";
    statusMsg.innerText = "Processing Database... Please Wait...";
    document.body.prepend(statusMsg);

    try {
        for (const [category, items] of Object.entries(menuData)) {
            // 1. Clear old data
            await clearCollection(category);
            
            // 2. Add new data
            if(items.length > 0) {
                console.log(`Uploading ${items.length} items to ${category}...`);
                const uploadPromises = items.map(item => addDoc(collection(db, "menuData", category, "items"), item));
                await Promise.all(uploadPromises);
            }
        }
        console.log("--- SUCCESS! ---");
        statusMsg.innerText = "Done! You can switch back to app.js now.";
        statusMsg.style.color = "green";
        alert("Database has been reset and updated successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
        statusMsg.innerText = "Error: " + error.message;
        statusMsg.style.color = "red";
    }
}

window.onload = seedDatabase;
