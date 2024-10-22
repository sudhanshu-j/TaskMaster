// Enable strict mode for the script
"use strict";

// Select all required DOM elements

const headerTime = document.querySelector("[data-header-time]"); // Select the header time element

const menuTogglers = document.querySelectorAll("[data-menu-toggler]"); // Select all menu toggler elements

const menu = document.querySelector("[data-menu]"); // Select the menu element

const themeBtns = document.querySelectorAll("[data-theme-btn]"); // Select all theme button elements

const modalTogglers = document.querySelectorAll("[data-modal-toggler]"); // Select all modal toggler elements

const welcomeNote = document.querySelector("[data-welcome-note]"); // Select the welcome note element

const taskList = document.querySelector("[data-task-list]"); // Select the task list element

const taskInput = document.querySelector("[data-task-input]"); // Select the task input element

const modal = document.querySelector("[data-info-modal]"); // Select the info modal element

// Initialize empty objects for task items and task removers

let taskItem = {}; // Object to store task items

let taskRemover = {}; // Object to store task removers

// Store the current date using the built-in Date object

const date = new Date(); // Creates a new Date object representing the current date and time

// Import the task complete sound from the specified path

const taskCompleteSound = new Audio("/assets/sounds/task-delete.wav"); // Loads the audio file for task completion sound

/**
 * Convert weekday number to weekday name
 * @param {number} dayNumber - A number representing the day of the week (0-6)
 * @returns {string} The name of the corresponding weekday
 */

const getWeekDayName = function (dayNumber) {
  switch (dayNumber) {
    case 0:
      return "Sunday"; // Return "Sunday" for 0
    case 1:
      return "Monday"; // Return "Monday" for 1
    case 2:
      return "Tuesday"; // Return "Tuesday" for 2
    case 3:
      return "Wednesday"; // Return "Wednesday" for 3
    case 4:
      return "Thursday"; // Return "Thursday" for 4
    case 5:
      return "Friday"; // Return "Friday" for 5
    case 6:
      return "Saturday"; // Return "Saturday" for 6
    default:
      return "Not a valid day"; // Return an error message for invalid input
  }
};

/**
 * Convert month number to month name
 * @param {number} monthNumber - A number representing the month of the year (0-11)
 * @returns {string} The name of the corresponding month
 */

// Define a function to convert month number to month name

const getMonthName = function (monthNumber) {
  switch (monthNumber) {
    case 0:
      return "Jan"; // Return "Jan" for January
    case 1:
      return "Feb"; // Return "Feb" for February
    case 2:
      return "Mar"; // Return "Mar" for March
    case 3:
      return "Apr"; // Return "Apr" for April
    case 4:
      return "May"; // Return "May" for May
    case 5:
      return "Jun"; // Return "Jun" for June
    case 6:
      return "Jul"; // Return "Jul" for July
    case 7:
      return "Aug"; // Return "Aug" for August
    case 8:
      return "Sep"; // Return "Sep" for September
    case 9:
      return "Oct"; // Return "Oct" for October
    case 10:
      return "Nov"; // Return "Nov" for November
    case 11:
      return "Dec"; // Return "Dec" for December
    default:
      return "Not a valid month"; // Return an error message for invalid input
  }
};

// Store the weekday name, month name, and month-of-day number

const weekDayName = getWeekDayName(date.getDay()); // Get the weekday name using the getWeekDayName function

const monthName = getMonthName(date.getMonth()); // Get the month name using the getMonthName function

const monthOfDay = date.getDate(); // Get the day of the month (1-31)

// Update the headerTime date with the formatted string

headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`; // Set the text content of the headerTime element

/**
 * Toggle the active class on an element
 * @param {object} elementNode - The element node to toggle the active class on
 */

// Define a function to toggle the "active" class on a given element

const elemToggler = function (elem) {
  elem.classList.toggle("active"); // Toggle the "active" class on the specified element
};

/**
 * Toggle the active class on multiple elements
 * @param {NodeList} elems - A collection of element nodes to toggle the active class on
 * @param {function} event - The event handler function to attach to each element
 */

const addEventOnMultiElem = function (elems, event) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", event); // Add a click event listener to each element
  }
};

/**
 * Create a task item element node and return it
 * @param {string} taskText - The text content for the task item
 * @returns {HTMLElement} The created task item element
 */

const taskItemNode = function (taskText) {
  const createTaskItem = document.createElement("li"); // Create a new list item element

  createTaskItem.classList.add("task-item"); // Add the "task-item" class to the list item

  createTaskItem.setAttribute("data-task-item", ""); // Set a data attribute for the task item

  // Set the inner HTML of the task item with buttons and task text
  createTaskItem.innerHTML = `
    <button class="item-icon" data-task-remove="complete">
      <span class="check-icon"></span>
    </button>
    <p class="item-text">${taskText}</p>
    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
      <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>
  `;

  return createTaskItem; // Return the created task item element
};

/**
 * Validate the task input
 * @param {boolean} taskIsValid - A boolean indicating if the task input is valid
 */

const taskInputValidation = function (taskIsValid) {
  if (taskIsValid) {
    // If the task input is valid, create a new task item
    if (taskList.childElementCount > 0) {
      // If there are existing tasks, add the new task before the first task
      taskList.insertBefore(taskItemNode(taskInput.value), taskItem[0]);
    } else {
      // If there are no existing tasks, append the new task to the list
      taskList.appendChild(taskItemNode(taskInput.value));
    }

    // Clear the input field after adding the task
    taskInput.value = "";

    // Hide the welcome note after adding the first task
    welcomeNote.classList.add("hide");

    // Update the taskItem and taskRemover DOM selections
    taskItem = document.querySelectorAll("[data-task-item]"); // Select all task items
    taskRemover = document.querySelectorAll("[data-task-remove]"); // Select all task remove buttons
  } else {
    // If the input is invalid (e.g., empty), log a message to the console
    console.log("Please write something!");
  }
};

/**
 * Hide the welcome note if there are existing tasks
 */
const removeWelcomeNote = function () {
  if (taskList.childElementCount > 0) {
    // If there are tasks, hide the welcome note
    welcomeNote.classList.add("hide");
  } else {
    // If there are no tasks, show the welcome note
    welcomeNote.classList.remove("hide");
  }
};

/**
 * Remove task when clicking on the delete button or check button
 */
const removeTask = function () {
  // Select the parent element of the clicked button (the task item)
  const parentElement = this.parentElement;

  /**
   * If the task is completed, the task item will be removed after 250ms
   * If deleted, then the task item will be removed instantly
   */
  if (this.dataset.taskRemove === "complete") {
    parentElement.classList.add("complete"); // Add "complete" class to the task item
    taskCompleteSound.play(); // Play the task completion sound

    // Set a timeout to remove the task item after 250ms
    setTimeout(function () {
      parentElement.remove(); // Remove the task item from the DOM
      removeWelcomeNote(); // Check and potentially remove the welcome note
    }, 250);
  } else {
    parentElement.remove(); // Immediately remove the task item
    removeWelcomeNote(); // Check and potentially remove the welcome note
  }
};

/**
 * Add task function
 */
const addTask = function () {
  // Check the task input validation
  taskInputValidation(taskInput.value);

  // Add event listeners to all task item checkboxes and delete buttons
  addEventOnMultiElem(taskRemover, removeTask);
};

/**
 * Add keypress listener on taskInput
 */
taskInput.addEventListener("keypress", function (e) {
  // Add task if the user presses 'Enter'
  switch (e.key) {
    case "Enter":
      addTask(); // Call the addTask function
      break;
  }
});

// Toggle active class on menu when clicking on menuBtn or dropdownLink
const toggleMenu = function () {
  elemToggler(menu); // Toggle the active class on the menu
};
addEventOnMultiElem(menuTogglers, toggleMenu); // Add event listeners to menu togglers

// Toggle active class on modal when clicking on dropdownLink or modal Ok button
const toggleModal = function () {
  elemToggler(modal); // Toggle the active class on the modal
};
addEventOnMultiElem(modalTogglers, toggleModal); // Add event listeners to modal togglers

/**
 * Add "loaded" class on body when the website is fully loaded
 */
window.addEventListener("load", function () {
  document.body.classList.add("loaded"); // Add "loaded" class to the body
});

/**
 * Change body background when clicking on any themeBtn
 */
const themeChanger = function () {
  // Store hue value from the clicked themeBtn
  const hueValue = this.dataset.hue;

  // Create CSS custom property on root and set value from hueValue
  document.documentElement.style.setProperty("--hue", hueValue);

  // Remove "active" class from all themeBtns
  for (let i = 0; i < themeBtns.length; i++) {
    if (themeBtns[i].classList.contains("active")) {
      themeBtns[i].classList.remove("active"); // Remove "active" class from each button
    }
  }

  // Add "active" class to the clicked themeBtn
  this.classList.add("active");
};

// Add event listeners on all themeBtns
addEventOnMultiElem(themeBtns, themeChanger);
