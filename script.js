
// declaring all variables here to so that are GLOBAL.

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
   const itemsFromStorage = getItemsFromStorage();
   itemsFromStorage.forEach((item) => addItemToDOM(item));
   checkUI(); 
}


function onAddItemSubmit (e){
    e.preventDefault();
const newItem = itemInput.value

    // Validate input
    if (newItem === ''){
        alert('Please add an item')
        return;
    }
// check for edit mode

 if (isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
 } else {
    if (checkIfItemExists(newItem)){
      alert('That item already exists!');
      return;
    }
 }

 // create item DOM element
    addItemToDOM(newItem);
    
 
// Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value ='';
}



function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;

}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon
}

function addItemToDOM(item) {
  // create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM

  itemList.appendChild(li);
}

// to add items to local storage

function addItemToStorage(item) {
  // initialize this variable itemsFromStorage
  // achieving DRY . 

  const itemsFromStorage = getItemsFromStorage();

  //add new item to array

  itemsFromStorage.push(item);

  // convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// get items from storage

function getItemsFromStorage(){
  let itemsFromStorage;
  //first check if local storage has any items.

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    // from localstorage we get a string so to convert to an array we use JSON.parse
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }  
  return itemsFromStorage
}

function onClickItem(e){
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target)
  }
}

// Preventing duplicates

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
// ensure that when you click another item the one that is greyed returns to bold
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))

    item.classList.add('edit-mode');
    // we grey out the clicked item
    formBtn.innerHTML = '<i class="fa-solid fa-pen"> Update Item</i>';
    // change the update button color
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

// function to delete items from DOM

function removeItem(item){

        //this lets you confirm if you want to continue to delete

        if (confirm('Are you sure you want to delete the item?')){

            // remove item from DOM
    item.remove();

    // Remove item from storage

    removeItemFromStorage(item.textContent);

    // Again here the CHECKUI function ensures that when you remove all items filter field and clear button are cleared.

    checkUI();
} };


function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    
    // Filter out item to be removed

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item );

    // Re-set to local Storage

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));

}


// filter function

function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    
    
    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        
        if (itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
     })
}

// function to clear user interface -want to clear filter field and clear button when when do not have items added.

function checkUI(){
    itemInput.value = '';

    const items = itemList.querySelectorAll('li'); 
    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';

    }else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
  
    formBtn.innerHTML = '<i class="fa-solid fa-plus">Add Item</i>'
    formBtn.style.backgroundColor = '#333';

   isEditMode = false;  
}

// function to clear items

function clearItems (){
    itemList.innerHTML = '';

    // clear from localstorage

    localStorage.removeItem('items');
    // CHECKUI here is used to clear the clear button.

    checkUI();
}

// Initialize app

function init(){

// Event Listeners

// submit items to display

itemForm.addEventListener('submit',onAddItemSubmit);

// remove the items by clicking the x mark
itemList.addEventListener('click',onClickItem);

// clear items by clicking on the clear button

clearBtn.addEventListener('click',clearItems); 

// filter function

itemFilter.addEventListener('input',filterItems);

document.addEventListener('DOMContentLoaded',displayItems);

// run/call  the checkUI function,this function checks if page has any item when it loads.This CHECKUI runs only when the page LOADS not everytime we add an item.

checkUI();
}
init();
  