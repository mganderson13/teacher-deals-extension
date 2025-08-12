const loggerLabel = "Deals Extension"
console.log(loggerLabel, "running script");
const hostnameUrl = window.location.hostname;
console.log(loggerLabel, "hostnameURL", hostnameUrl);

let siteData = [];
let optionsArray = [];
let brandsArray = [];
let bannerContent = [];

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

//store selectedOptions in an array from chrome storage
function storeOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ selectedOptions: [] }, (data) => {
      optionsArray = data.selectedOptions;
      console.log(loggerLabel, "optionsArray", optionsArray);
      resolve();
    });
  });
}

function showBanner() {
  const banner = document.createElement("div");
  banner.className = "discount-banner";

  const textContainer = document.createElement("div");

  bannerContent.forEach(object => {
    const p = document.createElement("p");
    // If object has multiple entries, iterate all
    for (const [key, value] of Object.entries(object)) {
      p.innerHTML += `This site has deals for ${key}s at <a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a><br>`;
    }
    textContainer.appendChild(p);
  });

  const dismissButton = document.createElement("button");
  dismissButton.id = "dismiss-banner";
  dismissButton.textContent = "Dismiss";

  banner.appendChild(textContainer);
  banner.appendChild(dismissButton);

  document.body.style.paddingTop = "50px";
  document.body.appendChild(banner);

  dismissButton.addEventListener("click", () => {
    banner.remove();
    document.body.style.paddingTop = "0";
  });
}


getData().then(async () => {
  // find matching brand first
  siteData.forEach((brand) => {
    if (hostnameUrl.toLowerCase().includes(brand.Brand.toLowerCase().replace(/\s/g, ''))) {
      console.log(loggerLabel, "🚨!!DEAL!!🚨");
      brandsArray.push(brand);
    }
  });

  console.log(loggerLabel, "brandsArray:", brandsArray);
  console.log(loggerLabel, "brandsArray[0].Audience:", brandsArray[0]?.Audience);

  // wait for options to load
  await storeOptions();

  if (optionsArray.length > 0 && brandsArray[0]?.Audience) {
      
      optionsArray.forEach((option) => {
      // find object in Audience array where the key matches the option
      const match = brandsArray[0].Audience.find(a => a[option]);
      console.log(loggerLabel, "match:", match);
      if (match) {
        bannerContent.push(match);
      }
      });

      if(bannerContent.length > 0){
          showBanner();
      }

  } else if (optionsArray.length === 0 && brandsArray[0]?.Audience) {
    const audienceArray = brandsArray[0].Audience;

    audienceArray.forEach(audienceObj => {
      bannerContent.push(audienceObj);
    });
    
    showBanner();
  }

  console.log(loggerLabel, "bannerContent:", bannerContent);
});