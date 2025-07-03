const excludedTags = new Set([
  "SCRIPT",
  "STYLE",
  "META",
  "LINK",
  "HEAD",
  "NOSCRIPT",
  "TITLE",
]);

function findNearestCheckbox(startElement) {
  let current = startElement;

  while (current) {
    const checkbox = current.querySelector('input[type="checkbox"]');
    if (checkbox) return checkbox;

    current = current.parentElement;
  }

  return null; // No checkbox found
}

function findAndMassClick(searchTextList) {
  const matchedElements = [...document.querySelectorAll("*")].filter((el) => {
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

  // Copy the matched elements to clipboard
  // TODO: Only copy Sabangnet Order Numbers
  const textToCopy = matchedElements
    .map((el) => el.textContent.trim())
    .join("\n");
  navigator.clipboard.writeText(textToCopy);

  if (matchedElements.length === 0) {
    alert("No elements found containing the specified text.");
    return;
  }

  const checkboxElements = matchedElements
    .map((el) => {
      const checkbox = findNearestCheckbox(el);
      if (checkbox) {
        checkbox.checked = true; // Check the checkbox if found
        return checkbox;
      }
      return null; // No checkbox found for this element
    })
    .filter(Boolean); // Filter out null values

  alert(`Found ${checkboxElements.length} checkboxes near the specified text.`);

  matchedElements.forEach((el) => {
    el.style.backgroundColor = "yellow"; // Highlight found elements
  });

  matchedElements[0].scrollIntoView({ behavior: "smooth" }); // Scroll to the first found element

  checkboxElements.forEach((checkbox) => {
    checkbox.style.boxShadow = "0 0 3px yellow"; // Highlight the checkbox
    checkbox.click(); // Simulate a click on the checkbox
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "FIND_AND_MASS_CLICK") {
    findAndMassClick(msg.searchTextList);
  }
});
