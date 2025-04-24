// Get references to input box, list container, and toggle switch
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const toggle = document.getElementById("mode-toggle");

// Function to add a new task
function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");// Alert if input is empty
    } else {
        // Create new list item
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        li.setAttribute("draggable", true);// Enable dragging
        addListeners(li);// Add drag listeners
        listContainer.appendChild(li);// Add item to list

        // Create and append delete (×) button
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";// Unicode for ×
        li.appendChild(span);
    }
    inputBox.value = "";// Clear input box
    saveData();// Save updated list to localStorage
}

// Handle click events on the list
listContainer.addEventListener("click", function(e){
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");// Toggle check/uncheck
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();// Delete task
    }
}, false);

// Handle double click for editing task
listContainer.addEventListener("dblclick", function(e){
    if (e.target.tagName === "LI") {
        const currentText = e.target.childNodes[0].nodeValue;// Get current text
        const newText = prompt("Edit Task:", currentText);// Prompt for new text
        if (newText !== null && newText.trim() !== "") {
            e.target.childNodes[0].nodeValue = newText;
            saveData();
        }
    }
});

// Save tasks to localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Load tasks from localStorage on page load
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    // Reapply drag listeners to existing tasks
    [...listContainer.children].forEach(li => {
        li.setAttribute("draggable", true);
        addListeners(li);
    });
}
showTask();// Initial load

// Toggle dark mode on checkbox change
toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

// Drag and Drop Sorting
let dragSrcEl; // Store reference to dragged item

// Called when dragging starts
function handleDragStart(e) {
    dragSrcEl = this;// Set source element
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);// Pass HTML content
    this.style.opacity = '0.4';// Slightly transparent
}

// Needed to allow drop
function handleDragOver(e) {
    e.preventDefault();
    return false;
}

// Called when dropped on another element
function handleDrop(e) {
    e.preventDefault();
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');// Swap content
        saveData();
        showTask(); // re-bind drag listeners
    }
}
// Restore opacity after drag ends
function handleDragEnd() {
    this.style.opacity = '1';
}

// Add all drag and drop event listeners to a task
function addListeners(item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
}
