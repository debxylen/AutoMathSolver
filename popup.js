/* 
* This file is part of mathsolver.ext
* Copyright (C) 2025 debxylen
* Licensed under the AGPLv3 License.
*/

function showToast(message, bg) {
        let toast = document.createElement("div");
        toast.innerText = message;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = bg;
        toast.style.color = "#fff";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "5px";
        toast.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
        toast.style.zIndex = "9999";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "bold";

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = "opacity 0.5s";
            toast.style.opacity = "0";
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 2000);
}

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

// Listen for messages from the content script (injected script)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "showToast") {
        showToast(request.message, request.color);
    }
});

function injectScript(tabId) {
    // Inject script directly in the context of the tab
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
            // Create the script element within the page context
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('bypass.js');
            
            // Handle loading and errors
            script.onload = function() {
                chrome.runtime.sendMessage({
                type: "showToast",
                message: "Bypassed copy event block!",
                color: "#4CAF50"
                });
            };
            script.onerror = function() {
                chrome.runtime.sendMessage({
                type: "showToast",
                message: "Failed to load bypass script.",
                color: "#D40000"
                });
            };
            
            // Append the script to the body of the document
            document.body.appendChild(script);
        }
    });
}

// Button click event handler
document.getElementById('injectButton').addEventListener('click', function() {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            injectScript(tabs[0].id);
        });
    } catch (error) {
        showToast(error, "#D40000");
    }
});