// set domains in install to storage, through background.js

// in here read those domains and if they match block the site
// keep the checklist in there as well
// if the checklist is fully complete, ask if sure? allow : close the tab

let domains;

// get the hostname
const hostname = window.location.hostname;

// TODO: switch to id based domain state
chrome.storage.sync.get(["domains"], (res) => {
  domains = res.domains;

  console.log("domains that are going to be blocked: ", domains);

  domains.forEach((domain) => {
    if (hostname.includes(domain)) {
      chrome.runtime.sendMessage({ redirect: "https://google.com" });
    }
  });
});
