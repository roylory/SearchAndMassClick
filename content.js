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

function copyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (err) {
    console.error('document.execCommand("copy") failed:', err);
  }

  document.body.removeChild(textArea);
  return success;
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

  // Copy the Sabangnet Order Number if found
  let copySuccess = false;
  const directChildDivs = matchedElements
    .map((el) => el.querySelector(":scope > div"))
    .filter(Boolean);
  const textToCopy = directChildDivs
    .map((el) => el.textContent.trim())
    .join("\n");
  if (textToCopy) {
    copySuccess = copyTextToClipboard(textToCopy);
  }

  if (copySuccess) {
    alert(
      `Found ${checkboxElements.length} checkboxes near the specified text. \nCopied Sabangnet Order Numbers to clipboard.`
    );
  } else {
    alert(
      `Found ${checkboxElements.length} checkboxes near the specified text.`
    );
  }

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
