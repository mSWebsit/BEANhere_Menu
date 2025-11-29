import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Data from your old script.js
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
    // Changed Key to match app.js camelCase
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

async function seedDatabase() {
  console.log("Starting upload...");
  for (const [category, items] of Object.entries(menuData)) {
    console.log(`Uploading ${category}...`);
    for (const item of items) {
      await addDoc(collection(db, "menuData", category, "items"), item);
    }
  }
  console.log("Upload Complete! You can now switch back to app.js");
  alert("Database seeded successfully!");
}

window.onload = seedDatabase;
