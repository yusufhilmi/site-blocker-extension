document.getElementById("tex").addEventListener("click", () => {
  chrome.storage.sync.get(["domains"], (res) => {
    domains = res.domains;

    console.log("domains that are going to be blocked: ", domains);
  });
});
