import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://hackathon-d6b7e-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
export const todoDB = ref(database, "todos")

const shoppingList = document.getElementById('list');

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
