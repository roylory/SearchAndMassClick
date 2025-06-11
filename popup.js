const searchTextarea = document.getElementById("searchTextarea");
const findBtn = document.getElementById("findBtn");
const massClickBtn = document.getElementById("massClickBtn");

findBtn.addEventListener("click", () => {
  try {
    const searchText = searchTextarea.value.trim();
    const searchTextList = searchText
      .split(/[\r\n]+/)
      .map((line) => line.trim().toLowerCase())
      .filter((s) => s);
    if (searchTextList.length === 0) {
      alert("Please enter some text to search for.");
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, {
        type: "FIND_AND_HIGHLIGHT_TEXT",
        searchTextList,
      });
    });
  } catch (error) {
    console.error("Error during search:", error);
    alert(error.message || "An error occurred during the search.");
  }
});

massClickBtn.addEventListener("click", () => {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { type: "MASS_CLICK_ELEMENTS" });
    });
  } catch (error) {
    console.error("Error during mass click:", error);
    alert(error.message || "An error occurred during the mass click.");
  }
});
