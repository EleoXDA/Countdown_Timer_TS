"use strict";
// Query DOM elements and assign their correct types
const hoursInput = document.querySelector('#hours-input');
const minutesInput = document.querySelector('#minutes-input');
const secondsInput = document.querySelector('#seconds-input');
const startButton = document.querySelector('#start-btn');
const resetButton = document.querySelector('#reset-btn');
const timerDisplay = document.querySelector('#timer-display');
// Variable to hold the countdown interval ID
let countdown;
/**
 * Function that handles the timer countdown and display
 */
function timer(seconds) {
    // Calculate end time
    const endTime = Date.now() + seconds * 1000;
    // Store end time in localStorage
    localStorage.setItem('endTime', endTime.toString());
    // Initial time display
    displayTimeLeft(seconds);
    // Start countdown
    countdown = setInterval(() => {
        const secondsLeft = Math.round((endTime - Date.now()) / 1000);
        // Stop countdown and alert when time is up
        if (secondsLeft < 0) {
            clearInterval(countdown);
            countdown = 0;
            alert('Timer Finished!');
            localStorage.removeItem('endTime');
            return;
        }
        // Display time left
        displayTimeLeft(secondsLeft);
    }, 1000);
}
/**
 * Function to display the remaining time
 */
function displayTimeLeft(seconds) {
    // Convert seconds to hours, minutes, and remaining seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainderSeconds = seconds % 60;
    // Format time for display
    const display = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    // Update display
    timerDisplay.textContent = display;
}
// Event listener for start button
startButton.addEventListener('click', () => {
    // If countdown is already running, return
    if (countdown != 0) {
        return;
    }
    // Parse time input values
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    // Validate time input values
    if (hours >= 0 && minutes >= 0 && seconds >= 0) {
        // Store time input values in localStorage
        localStorage.setItem('hours', hours.toString());
        localStorage.setItem('minutes', minutes.toString());
        localStorage.setItem('seconds', seconds.toString());
        // Start timer
        timer((hours * 3600) + (minutes * 60) + seconds);
    }
    else {
        alert('Please enter valid time!');
    }
});
// Event listener for reset button
resetButton.addEventListener('click', () => {
    // Reset time input values
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    // Reset timer display
    timerDisplay.textContent = '00:00:00';
    // Clear countdown
    clearInterval(countdown);
    countdown = 0;
    // Remove saved time input values and end time from localStorage
    localStorage.removeItem('endTime');
    localStorage.removeItem('hours');
    localStorage.removeItem('minutes');
    localStorage.removeItem('seconds');
});
// Event listener for window load
window.addEventListener('load', () => {
    // Retrieve saved time input values and end time from localStorage
    const savedHours = parseInt(localStorage.getItem('hours')) || 0;
    const savedMinutes = parseInt(localStorage.getItem('minutes')) || 0;
    const savedSeconds = parseInt(localStorage.getItem('seconds')) || 0;
    const savedEndTime = parseInt(localStorage.getItem('endTime'));
    // Resume timer if there is a saved end time
    if (savedEndTime) {
        const timeLeft = Math.round((savedEndTime - Date.now()) / 1000);
        if (timeLeft >= 0) {
            // Populate time input values
            hoursInput.value = savedHours.toString();
            minutesInput.value = savedMinutes.toString();
            secondsInput.value = savedSeconds.toString();
            // Resume timer
            timer(timeLeft);
        }
        else {
            // Remove saved end time from localStorage if it's expired
            localStorage.removeItem('endTime');
        }
    }
});
// Event listener for document load
document.addEventListener('DOMContentLoaded', function () {
    // Get theme selector and apply types
    const themeSelector = document.querySelector('#theme-selector');
    themeSelector.addEventListener('change', function () {
        // Remove the existing theme class from the body
        document.body.classList.remove('theme-default', 'theme-dark');
        // Add the selected theme class to the body
        document.body.classList.add(this.value);
        // Save the selected theme in local storage
        localStorage.setItem('selectedTheme', this.value);
    });
    // Load the saved theme from local storage (if any)
    let savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        // Remove the current theme from the body
        document.body.classList.remove('theme-default', 'theme-dark');
        // Add the saved theme class to the body
        document.body.classList.add(savedTheme);
        // Set the dropdown menu's value to the saved theme
        themeSelector.value = savedTheme;
    }
});
