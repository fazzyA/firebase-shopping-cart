import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://hackathon-d6b7e-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const todoDB = ref(database, "todos")

const titleField = document.getElementById('title-field');
const priceField = document.getElementById('price-field');
const buttonEl = document.getElementById('add-to-cart');
const shoppingList = document.getElementById('shopping-list');

buttonEl.addEventListener("click", function () {
  let title = titleField.value;
  let price = priceField.value;

  if (title && price) {
    const newItemRef = push(todoDB);
    const newItemKey = newItemRef.key;

    // Use the key to set the data
    set(ref(database, `todos/${newItemKey}`), {
      title: title,
      price: price
    });
    clearInputFields();
  } else {
    alert("Please enter both title and price.");
  }
});

onValue(todoDB, function (snapshot) {
  if (snapshot.exists()) {
    clearShoppingList();
    console.log('onvalue', snapshot.val())
    const data = Object.entries(snapshot.val());
    console.log("🚀 ~ file: index.js:41 ~ data:", data)

    for (let i = 0; i < data.length; i++) {
      appenItemToShoppingList(data[i]);
    }
  } else {
    shoppingList.innerHTML = `<li>No items to show...</li>`;
  }
});

function clearInputFields() {
  titleField.value = "";
  priceField.value = "";
}

function clearShoppingList() {
  shoppingList.innerHTML = "";
}

function appenItemToShoppingList(item) {
  let itemId = item[0];
  let itemData = item[1];

  let newLi = document.createElement("li");
  newLi.textContent = `${itemData.title} - ${itemData.price}/. Rs`;

  newLi.addEventListener("dblclick", function () {
    let locationToDelete = ref(database, `todos/${itemId}`);
    remove(locationToDelete);
  });

  shoppingList.append(newLi);
}
