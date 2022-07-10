chrome.runtime.onInstalled.addListener(async () => {
  // interesting idea is to shoot them into the login page of a web app and handle all logic and data there instead of chrome apis
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);

  let domains, habits;
  chrome.storage.sync.get(["domains", "habits"], (res) => {
    if (!res.domains) {
      // set as default if there wasn't a setting prev.
      domains = [
        { id: 0, host: "netflix.com" },
        { id: 1, host: "instagram.com" },
      ];
    }
    if (!res.habits) {
      // set as default if there wasn't a setting prev.
      habits = [
        {
          id: 0,
          title: "Read Book",
          completed: false,
        },
      ];
    }
  });

  // add them to storage to block 'ems
  chrome.storage.sync.set({ domains, habits });
});

// a helper to track storage changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(`Storage key "${key}" in namespace "${namespace}" changed.`);
    console.log("Old value:", oldValue);
    console.log("New value:", newValue);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.message === "blocked-page-opened") {
    let redirectURL = chrome.runtime.getURL("blocked-page.html");
    chrome.storage.sync.get(["customRedirect"], (res) => {
      if (res.customRedirect) {
        redirectURL = res.customRedirect;
      }
      chrome.tabs.update(sender.tab.id, {
        url: redirectURL,
      });
      console.log("blocked", sender.tab.url);
    });
  }
});

// TODO:
// [x] integrate js state with store
// [x] custom redirect stuff
// [] handle bypass mechanism
