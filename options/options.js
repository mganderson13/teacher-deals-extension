document.addEventListener("DOMContentLoaded", () => {
  restoreOptions(); // Load saved deals when the page opens
});

document.getElementById("audienceSelector").addEventListener("submit", function(event) {
  event.preventDefault();
  saveOptions();
});

const saveOptions = () => {
    const checkboxes = document.querySelectorAll('input[name="dealOptions"]:checked');
    const selectedOptions = Array.from(checkboxes).map(cb => cb.value);
    console.log("Deals Extension", "Selected options:", selectedOptions);

    chrome.storage.sync.set(
        {selectedOptions}, () => {
            const status = document.getElementById("status");
            status.textContent = "Deal Options Saved";
                  setTimeout(() => {
                    status.textContent = "";}, 750);
        }
    )
}

// Restores selected options
// Restores selected options
const restoreOptions = () => {
  chrome.storage.sync.get({ selectedOptions: [] }, (data) => {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[name="dealOptions"]');

    // Clear all checkboxes
    checkboxes.forEach(cb => cb.checked = false);
    // Check the ones that were saved
    data.selectedOptions.forEach(savedValue => {
      const match = Array.from(checkboxes).find(cb => cb.value === savedValue);
      if (match) {
        match.checked = true;
      }
    });
  });
};