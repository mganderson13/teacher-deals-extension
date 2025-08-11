const loggerLabel = "Deals Extension"
console.log(loggerLabel, "running script");
const currentUrl = window.location;
console.log(loggerLabel, "currentURL", currentUrl);
const baseUrl = window.location.origin;
console.log(loggerLabel, "baseURL", baseUrl);
const hostnameUrl = window.location.hostname;
console.log(loggerLabel, "hostnameURL", hostnameUrl);

let siteData = [];

async function getData() {
  const jsonURL = chrome.runtime.getURL("data/deals.json");
  try {
    const response = await fetch(jsonURL);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    siteData = await response.json(); // assign to outer variable
  } catch (err) {
    console.error("Error loading JSON:", err.message);
  }
}

function showBanner() {
  const banner = document.createElement("div");
  banner.className = "discount-banner";

  banner.innerHTML = `
    <strong>Good news!</strong> This site has discounts for community heros.
    <button id="dismiss-banner">Dismiss</button>
  `;

  document.body.style.paddingTop = "50px"; // Prevent content from being covered
  document.body.appendChild(banner);

  document.getElementById("dismiss-banner").addEventListener("click", () => {
    banner.remove();
    document.body.style.paddingTop = "0";
  });
}


getData().then(() => {
  siteData.forEach((brand)=> {
if (hostnameUrl.toLowerCase().includes(brand.Brand.toLowerCase().replace(/\s/g, ''))) {
    console.log(loggerLabel, "🚨!!DEAL!!🚨");
    showBanner();
    return;
    }
  })
});

//OPTIONS
//Save options in options.js - access in content.js
// function getOptions() {
//   chrome.storage.sync.get({ selectedDeals: [] }, (data) => {
//     if (data.selectedDeals.length > 0) {
//       const showDeals = data.selectedDeals;
//       return showDeals;
//     } else {
//       return;
//     }
//   }
// )
// }


//what if no options selected?
//If no options are currently selected, the collection is empty and returns a length of 0.

