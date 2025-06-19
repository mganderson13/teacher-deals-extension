const loggerLabel = "Deals Extension"
console.log(loggerLabel, "running script");
const currentUrl = window.location;
console.log(loggerLabel, "currentURL", currentUrl);
const baseUrl = window.location.origin;
console.log(loggerLabel, "baseURL", baseUrl);
const hostnameUrl = window.location.hostname;
console.log(loggerLabel, "hostnameURL", hostnameUrl);

const data = [
  "www.gap.com",
  "www.anntaylor.com",
  "www.google.com",
  "www.freecodecamp.org"
]

if(data.includes(hostnameUrl)){
  console.log(loggerLabel, "🚨!!DEAL!!🚨");
}else {
  console.log(loggerLabel, "No deal found");
}