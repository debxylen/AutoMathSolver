/* 
* This file is part of the Auto Math Solver extension.
* Copyright (C) 2025 debxylen
* Licensed under the AGPLv3 License.
*/

// Listen for copy event and modify clipboard content if necessary
document.addEventListener('copy', async () => {
    try {
        // Get the toggle state to check if math solver is enabled
        const isEnabled = await getToggleState();
        if (!isEnabled) return; // If not enabled, do nothing

        let copiedText = await navigator.clipboard.readText();

        // Replace curly quotes with straight quotes for consistency
        copiedText = copiedText.replace(/[“”]/g, '"');

        let mathExpression;

        // Check if there are quotes and extract the content inside
        const quotedTextMatch = copiedText.match(/"([^"]+)"/);

        if (quotedTextMatch) {
            // If quotes are present, take the content inside the quotes
            mathExpression = quotedTextMatch[1].trim();
        } else {
            // Otherwise, treat the entire string as the math expression
            mathExpression = copiedText.trim();
        }

        // Check if the content looks like a valid math expression
        if (mathExpression.match(/[\d+\-*/^()]/)) {
            const solution = await solveMath(mathExpression);
            await navigator.clipboard.writeText(solution);
        }

    } catch (error) {
        // Handle error silently
    }
});

// Function to get the current toggle state from storage
async function getToggleState() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['mathSolverEnabled'], (result) => {
            resolve(result.mathSolverEnabled || false);
        });
    });
}

// Function to solve math problems using MathJS API
async function solveMath(problem) {
    const apiUrl = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(problem)}`;
    const response = await fetch(apiUrl);
    return await response.text();
}
