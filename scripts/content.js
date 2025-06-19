console.log("running script");
const currentUrl = window.location;
console.log("currentURL", currentUrl);
const baseUrl = window.location.origin;
console.log("baseURL", baseUrl);
const hostnameUrl = window.location.hostname;
console.log("hostnameURL", hostnameUrl);

const data = [
  "www.gap.com",
  "www.anntaylor.com",
  "www.google.com",
  "www.freecodecamp.org"
]

if(data.includes(hostnameUrl)){
  console.log("🚨!!DEAL!!🚨");
}