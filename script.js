// Global object to store bookings
let tableBookings = JSON.parse(localStorage.getItem("tableBookings")) || {};

// Save to localStorage
function saveBookingsToLocalStorage() {
  localStorage.setItem("tableBookings", JSON.stringify(tableBookings));
}

// Initialize bookings for a table
function initializeTableBooking(tableName) {
  if (!tableBookings[tableName]) {
    tableBookings[tableName] = {};
    saveBookingsToLocalStorage();
  }
}

// Load time slots dynamically for a selected table and date
function loadTimeSlots() {
  const tableName = document.getElementById("tableName").innerText;
  const date = document.getElementById("calendar").value;

  if (!date) return;

  const bookedSlots = tableBookings[tableName][date] || [];
  const timeSlotsContainer = document.getElementById("timeSlots");
  const timeSlots = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
    "21:00", "22:00", "23:00"
  ];

  // Clear and render the slots
  timeSlotsContainer.innerHTML = "";
  timeSlots.forEach(slot => {
    const isBooked = bookedSlots.includes(slot);
    const slotButton = document.createElement("button");
    slotButton.className = `px-6 py-3 rounded-lg shadow-lg w-full mb-3 transition ${isBooked ? "booked" : "available"}`;
    slotButton.innerText = slot;

    if (!isBooked) {
      slotButton.onclick = () => bookTimeSlot(tableName, date, slot);
    }

    timeSlotsContainer.appendChild(slotButton);
  });
}

// Book a time slot
function bookTimeSlot(tableName, date, timeSlot) {
  if (!tableBookings[tableName][date]) {
    tableBookings[tableName][date] = [];
  }
  tableBookings[tableName][date].push(timeSlot);

  saveBookingsToLocalStorage();
  alert(`Booked ${timeSlot} on ${date} for ${tableName}`);
  loadTimeSlots();
}

// Handle table selection
function selectTable(tableName) {
  document.getElementById("tableName").innerText = tableName;

  // Initialize table booking if not present
  initializeTableBooking(tableName);

  // Load default slots for the current table
  const date = document.getElementById("calendar").value;
  if (date) {
    loadTimeSlots();
  }

  // Switch pages
  document.getElementById("tableSelectionPage").classList.add("hidden");
  document.getElementById("bookingPage").classList.remove("hidden");
}

// Go back to table selection page
function goBackToTableSelection() {
  document.getElementById("bookingPage").classList.add("hidden");
  document.getElementById("tableSelectionPage").classList.remove("hidden");
}

// Attach event listeners to table buttons
document.querySelectorAll(".table-btn").forEach(button => {
  button.addEventListener("click", () => selectTable(button.dataset.table));
});

// Back button listener
document.getElementById("backButton").addEventListener("click", goBackToTableSelection);

// Date change listener
document.getElementById("calendar").addEventListener("change", loadTimeSlots);

// Initialize tables
["Table 1", "Table 2", "Table 3", "Table 4"].forEach(initializeTableBooking);
