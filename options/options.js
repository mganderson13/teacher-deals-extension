document.addEventListener("DOMContentLoaded", () => {
  restoreOptions(); // Load saved deals when the page opens
  document.getElementById("save").addEventListener("click", saveOptions);
});

const saveOptions = () => {
    const selector = document.getElementById("audienceSelector");
    const selectedDeals = Array.from(selector.selectedOptions).map(option => option.value);

    chrome.storage.sync.set(
        //chosenDeals is object with key chosenDeals and value of array with selections
        {selectedDeals}, () => {
            const status = document.getElementById("status");
            status.textContent = "Deal Options Saved";
                  setTimeout(() => {
                    status.textContent = "";}, 750);
        }
    )
}

// Restores selected options
const restoreOptions = () => {
chrome.storage.sync.get({ selectedDeals: [] }, (data) => {
    const selector = document.getElementById("audienceSelector");

    // Clear any pre-selected values
    Array.from(selector.options).forEach(option => {
      option.selected = false;
    });

    // Set saved selections
    data.selectedDeals.forEach(savedValue => {
      const match = Array.from(selector.options).find(option => option.value === savedValue);
      if (match) {
        console.log("Deals Extension", match)
        match.selected = true;
      }
    });
  });
}
