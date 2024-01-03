import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const appSettings = {
    databaseURL: "https://hackathon-d6b7e-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const moviesDb = ref(database, "movies")

const inputField = document.getElementById('input-field');
const buttonEl = document.getElementById('add-to-cart')
const shoppingList = document.getElementById('shopping-list')

buttonEl.addEventListener("click", function () {
    console.log(inputField.value)
    let input = inputField.value;
    push(moviesDb, input)
    // appenItemToShoppingList(input) 
    clearInputField()
})
onValue(moviesDb, function(snapshot){
    if(snapshot.exists()){
        console.log('snapshot', Object.entries(snapshot.val()))
        clearShoppingList()
        const data = Object.entries(snapshot.val());
        const dataWithKey = Object.keys(snapshot.val());
        for(let i = 0; i < data.length; i++ ){
            let currentItem = data[i][1]
            appenItemToShoppingList(data[i])
        }
    } else {
        shoppingList.innerHTML = `<li>No items to show ...</li>`
    }
})
function clearInputField() {
    inputField.value = ""
}
function clearShoppingList() {
    shoppingList.innerHTML = ""
}

function appenItemToShoppingList(item) {
    let itemValue= item[1]
    let itemId = item[0]
    let newLi = document.createElement("li")
    newLi.textContent = itemValue
    newLi.addEventListener("dblclick", function(){
        console.log(itemId)
        let locationToDelete = ref(database, `movies/${itemId}`)
        remove(locationToDelete)
    })
    shoppingList.append(newLi)
    // shoppingList.innerHTML += `<li>${input}</li>`
}