const ACTIONS = {
  click: (el) => el.click(),
  setText: (el, value) => (el.textContent = value),
  setValue: (el, value) => (el.value = value),
  highlight: (el, color = "yellow") => (el.style.backgroundColor = color),
  scrollIntoView: (el) => el.scrollIntoView({ behavior: "smooth" }),
  remove: (el) => el.remove(),
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "RUN_SELECTOR_ACTION") return;

  const elements = document.querySelectorAll(msg.selector);
  if (!elements.length) {
    console.warn("[ScriptRunner] No elements matched selector:", msg.selector);
    return;
  }

  elements.forEach((el) => {
    const action = ACTIONS[msg.action];
    if (action) action(el, msg.value);
  });
});
