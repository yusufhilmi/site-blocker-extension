chrome.runtime.onInstalled.addListener(async () => {
  // interesting idea is to shoot them into the login page of a web app and handle all logic and data there instead of chrome apis
  let url = "https://yusufhilmi.com/site-blocker";
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);

  let domains, habits;
  let bypassUntil = new Date();
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
    // add them to storage to block 'ems
    chrome.storage.sync.set({
      domains,
      habits,
      bypassUntil: bypassUntil.toISOString(),
    });
  });
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
    chrome.storage.sync.get(["customRedirect", "bypassUntil"], (res) => {
      if (res.customRedirect) {
        redirectURL = res.customRedirect;
      }

      let until = new Date(res.bypassUntil);
      // console.log(res.bypassUntil);
      // console.log(until);

      if (new Date() > until) {
        chrome.tabs.update(sender.tab.id, {
          url: redirectURL,
        });
        chrome.storage.sync.set({
          lastBlocked: {
            tabId: sender.tab.id,
            url: sender.tab.url,
          },
        });
        console.log("blocked", sender.tab.url);
      } else {
        console.log("not blocking it until", until);
      }
    });
  }

  if (request.message === "let-in") {
    // open the gates
    chrome.storage.sync.set({ bypassUntil: request.until });

    chrome.storage.sync.get(["lastBlocked"], (res) => {
      if (res.lastBlocked?.tabId === sender.tab.id) {
        setTimeout(() => {
          // console.log("will redirect you in 2 seconds");
          chrome.tabs.update(sender.tab.id, {
            url: res.lastBlocked.url,
          });
        }, 1000);
      }
    });
  }
});
