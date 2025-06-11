const scriptSelect = document.getElementById("scriptSelect");
const inputField = document.getElementById("input");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");

// Load saved scripts
chrome.storage.local.get("scripts", (data) => {
  const scripts = data.scripts || {};
  Object.entries(scripts).forEach(([name, script]) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    scriptSelect.appendChild(option);
  });
});

// Run selected script
runBtn.addEventListener("click", async () => {
  const name = scriptSelect.value;
  const input = inputField.value;

  chrome.storage.local.get("scripts", async (data) => {
    const script = data.scripts?.[name];
    if (!script) return;

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [script, input],
      func: (code, input) => {
        try {
          const fn = new Function("input", code);
          fn(input);
        } catch (e) {
          alert("Script error: " + e.message);
        }
      },
    });
  });
});

// Save new script
saveBtn.addEventListener("click", () => {
  const name = prompt("Script name?");
  const code = prompt("Enter your JS code. Use `input` as a variable.");
  if (!name || !code) return;

  chrome.storage.local.get("scripts", (data) => {
    const scripts = data.scripts || {};
    scripts[name] = code;
    chrome.storage.local.set({ scripts }, () => location.reload());
  });
});
