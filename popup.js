const scriptSelect = document.getElementById("scriptSelect");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");

// Load saved scripts
chrome.storage.local.get("scripts", (data) => {
  const scripts = data.scripts || {};
  Object.keys(scripts).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    scriptSelect.appendChild(option);
  });
});

// Run selected script
document.getElementById("runBtn").addEventListener("click", () => {
  const selectedScript = scriptSelect.value;
  if (!selectedScript) return;
  chrome.storage.local.get("scripts", (data) => {
    const scripts = data.scripts || {};
    const script = scripts[selectedScript];
    if (!script || !script.selector || !script.action) return;
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, {
        type: "RUN_SELECTOR_ACTION",
        selector: script.selector,
        action: script.action,
        value: script.value,
      });
    });
  });
});

// Save new script
saveBtn.addEventListener("click", () => {
  const selector = document.getElementById("selector").value.trim();
  const action = document.getElementById("action").value;
  const value = document.getElementById("value").value;
  if (!selector || !action) return;

  chrome.storage.local.get("scripts", (data) => {
    const scripts = data.scripts || {};
    const scriptName = `${selector}-${action}-${value}`;
    scripts[scriptName] = {
      selector,
      action,
      value,
    };
    chrome.storage.local.set({ scripts }, () => location.reload());
  });
});
