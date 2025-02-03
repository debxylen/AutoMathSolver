/* 
* This file is part of the Auto Math Solver extension.
* Copyright (C) 2025 debxylen
* Licensed under the AGPLv3 License.
*/

// Initialize the toggle button state when the popup is opened
document.addEventListener('DOMContentLoaded', async () => {
    const toggleButton = document.getElementById('toggleButton');
    const statusLabel = document.getElementById('status');

    // Get the current state from storage (default to 'disabled' if not set)
    const isEnabled = await getToggleState();

    // Set the button label and status based on the current state
    if (isEnabled) {
        toggleButton.textContent = 'Disable Math Solver';
        statusLabel.textContent = 'Currently Enabled';
    } else {
        toggleButton.textContent = 'Enable Math Solver';
        statusLabel.textContent = 'Currently Disabled';
    }

    // Toggle event listener
    toggleButton.addEventListener('click', async () => {
        const newState = !isEnabled; // Flip the state
        await setToggleState(newState); // Save new state to storage

        // Update UI based on the new state
        if (newState) {
            toggleButton.textContent = 'Disable Math Solver';
            statusLabel.textContent = 'Currently Enabled';
        } else {
            toggleButton.textContent = 'Enable Math Solver';
            statusLabel.textContent = 'Currently Disabled';
        }
    });
});

// Get the current toggle state from Chrome storage
async function getToggleState() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['mathSolverEnabled'], (result) => {
            resolve(result.mathSolverEnabled || false);
        });
    });
}

// Set the new toggle state in Chrome storage
async function setToggleState(state) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ mathSolverEnabled: state }, resolve);
    });
}
