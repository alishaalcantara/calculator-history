Step 1 — Capture and log results to the console (5 min)
Every time a calculation completes, push an object like { expression: "8 × 4", result: 32, timestamp: new Date() } into an array and console.log it. Open DevTools — confirm a new object appears after each calculation.

Step 2a — Add a history container to your HTML (5 min)
Add a <div id="history-panel"> to your HTML file. Open DevTools and inspect the DOM — confirm the container exists on the page.

Step 2b — Render the history list in the DOM (5–10 min)
Write a renderHistory() function that builds a <ul> / <li> list inside that container and call it after every calculation. Confirm list items appear and grow with each operation.

Step 3 — Make history entries clickable (5–10 min)
Attach a click handler to each history entry so clicking one populates the calculator display with that result. Click an old entry — confirm the display updates correctly.

Step 4 — Add a "Clear History" button (5 min)
Add a button that resets the history array to [] and calls renderHistory(). Click it — confirm the list empties and shows a "No history yet" message.

Step 5 — Persist history across page refreshes with localStorage (10 min)
On every update, save the array with JSON.stringify(). On page load, read it back with JSON.parse() and re-render. Do 3 calculations, refresh the page — confirm they're still there. Then clear and refresh — confirm they're gone.

Step 6 — Cap history at 10 entries (5 min)
After each calculation, trim the array so it never exceeds 10 items, dropping the oldest. Do 11 calculations — confirm only the latest 10 appear in the list.