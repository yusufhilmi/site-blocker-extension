chrome.runtime.onInstalled.addListener(async () => {
  // interesting idea is to shoot them into the login page of a web app and handle all logic and data there instead of chrome apis
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);

  // get the domains
  const json = await fetch(chrome.runtime.getURL("domains.json")).then(
    (response) => response.json()
  );

  const domains = json.domains;

  // add them to storage to block 'em
  chrome.storage.sync.set({ domains }, () => {
    console.log("domains below are blocked", domains);
  });

  const defaultHabit = {
    id: 1,
    title: "Read Book for 30 min",
    completed: false,
  };

  chrome.storage.sync.set({ habits: [defaultHabit] }, () => {
    console.log("default habit added", defaultHabit);
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
  console.log(sender.tab.id);
  console.log(request);
  chrome.tabs.update(sender.tab.id, { url: request.redirect });
});
