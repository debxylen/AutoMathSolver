/* 
* This file is part of mathsolver.ext
* Copyright (C) 2025 debxylen
* Licensed under the AGPLv3 License.
*/

document.addEventListener('copy', async () => {
    try {
        const isEnabled = await getToggleState();
        if (!isEnabled) return;

        let copiedText = await navigator.clipboard.readText();
        copiedText = copiedText.replace(/[“”]/g, '"');
        let mathExpression;
        const quotedTextMatch = copiedText.match(/"([^"]+)"/);

        if (quotedTextMatch) { mathExpression = quotedTextMatch[1].trim(); } else { mathExpression = copiedText.trim(); }
        if (mathExpression.match(/[\d+\-*/^()]/)) {
            const solution = await solveMath(mathExpression);
            await navigator.clipboard.writeText(solution);
        }

    } catch (error) {
        //
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
    //const apiUrl = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(problem)}`;
    //const response = await fetch(apiUrl);
    //return await response.text();
    return math.evaluate(problem);
}
