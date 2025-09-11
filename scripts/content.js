const loggerLabel = "Deals Extension"
console.log(loggerLabel, "running script");
const hostnameUrl = window.location.hostname;
console.log(loggerLabel, "hostnameURL", hostnameUrl);

let siteData = [];
let optionsArray = [];
let brandsArray = [];
let bannerContent = [];
let dismissed;

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
  // Create a container in the page to host the shadow root
  const container = document.createElement("div");
  document.body.appendChild(container)
  const shadow = container.attachShadow({ mode: "open" });

  // Add external CSS file from extension
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("styles/banner.css"); 
  shadow.appendChild(link);

  const banner = document.createElement("div");
  banner.className = "discount-banner";
  
  const iconTextContainer = document.createElement("div");
  iconTextContainer.id= "iconTextContainer";
  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("icons/icon16.png"); 
  icon.alt="Deal Finder";

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

  iconTextContainer.appendChild(icon);
  iconTextContainer.appendChild(textContainer);
  banner.appendChild(iconTextContainer);
  banner.appendChild(dismissButton);
  shadow.appendChild(banner);

  document.body.style.paddingTop = "50px";

dismissButton.addEventListener("click", () => {
  const timestamp = Date.now(); // current time in ms
  chrome.storage.local.set({ [`dismissed_${hostnameUrl}`]: timestamp }, () => {
    console.log(loggerLabel, `Dismissed banner for ${hostnameUrl} at ${new Date(timestamp)}`);
  });
  container.remove();
  document.body.style.paddingTop = "0";
});

}

function checkDismissed() {
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in ms

  return new Promise((resolve) => {
    chrome.storage.local.get(`dismissed_${hostnameUrl}`, (result) => {
      const lastDismissed = result[`dismissed_${hostnameUrl}`];
      if (lastDismissed) {
        const age = Date.now() - lastDismissed;
        if (age < ONE_DAY) {
          console.log(loggerLabel, `Banner dismissed ${Math.round(age / 1000)}s ago, not showing again yet.`);
          resolve(true); // still within 24h, suppress banner
          return;
        }
      }
      resolve(false); // expired or never dismissed
    });
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

  // wait for dismissal check
  dismissed = await checkDismissed();

  if (optionsArray.length > 0 && brandsArray[0]?.Audience) {
      
      optionsArray.forEach((option) => {
      // find object in Audience array where the key matches the option
      const match = brandsArray[0].Audience.find(a => a[option]);
      console.log(loggerLabel, "match:", match);
      if (match) {
        bannerContent.push(match);
      }
      });

      

      if(bannerContent.length > 0 && !dismissed){
          showBanner();
      }

  } else if (optionsArray.length === 0 && brandsArray[0]?.Audience) {
    const audienceArray = brandsArray[0].Audience;

    audienceArray.forEach(audienceObj => {
      bannerContent.push(audienceObj);
    });
    
    if (!dismissed) {
    showBanner();
    }
  }

  console.log(loggerLabel, "bannerContent:", bannerContent);
});