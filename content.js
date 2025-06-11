let matchedElements = [];

const excludedTags = new Set([
  "SCRIPT",
  "STYLE",
  "META",
  "LINK",
  "HEAD",
  "NOSCRIPT",
  "TITLE",
]);

function findAndHighlight(searchTextList) {
  matchedElements = [...document.querySelectorAll("*")].filter((el) => {
    if (excludedTags.has(el.tagName)) return false;
    if (getComputedStyle(el).display === "none") return false;

    const matches = searchTextList.some((text) =>
      el.textContent.toLowerCase().includes(text)
    );

    if (!matches) return false;

    // Exclude if any child also matches (we want the deepest match)
    return ![...el.children].some((child) =>
      searchTextList.some((text) =>
        child.textContent.toLowerCase().includes(text)
      )
    );
  });

  if (matchedElements.length === 0) {
    alert("No elements found containing the specified text.");
    return;
  }

  alert(
    `Found ${matchedElements.length} elements containing the specified text.`
  );

  matchedElements.forEach((el) => {
    el.style.backgroundColor = "yellow"; // Highlight found elements
    el.scrollIntoView({ behavior: "smooth" }); // Scroll to the first found element
  });
}

function massClickElements() {
  if (matchedElements.length === 0) {
    alert("No elements to click. Please perform a search first.");
    return;
  }

  matchedElements.forEach((el) => {
    el.click(); // Simulate a click on each matched element
  });

  alert(`Clicked on ${matchedElements.length} elements.`);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "FIND_AND_HIGHLIGHT_TEXT") {
    findAndHighlight(msg.searchTextList);
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "MASS_CLICK_ELEMENTS") {
    massClickElements();
  }
});
