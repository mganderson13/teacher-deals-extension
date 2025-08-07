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
//Save options in options.js - access in content.js??
// function dealsOptions() {
//   const optionsSelector = document.getElementById("audience");
//   const selectedOptions = optionsSelector.selectedOptions;
//   const chosenDeals = Array.from(selectedOptions).map(option => option.value);
// }
//receive options from options.html
//save options in array
//if hostnameURL is in Brand then check
//for each Option - 
//Audience has key matching options
//if at least one audience key exists, show banner
//show text "this site has deals for ${Option}, click on this link ${Options key value} to access deal"

//what if no options selected?
//what if multiple options selected?
  //save options in array, for each option do the above
