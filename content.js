// set domains in install to storage, through background.js

// in here read those domains and if they match block the site
// keep the checklist in there as well
// if the checklist is fully complete, ask if sure? allow : close the tab

const body = `
<h1> Here I should have the basics <h1>

<div>
  <label for="code-time">4 commits to side projects</label>
  <input type="checkbox" id="code-time" />
</div>
`;

let domains;

// get the hostname
const hostname = window.location.hostname;

/* if we were to go with the server side
// check if we still block
if (hostname === "myhostname") {
  const blockToday = window.localStorage.getItem("blockToday");

  // allow once
  const allowOnce = window.localStorage.getItem("allowOnce");
  if (allowOnce) {
    // go back before redirect
  }

  if (blockToday) {
    // set chrome sync storage accordingly
  } else {
    //
  }
}

// check block today and let it go if its ok
// chrome.storage.sync.get(["blockToday"], (result) => {
//   console.log("codetime value is: ", result.blockToday);
// });
*/

chrome.storage.sync.get(["domains"], (res) => {
  domains = res.domains;

  console.log("domains that are going to be blocked: ", domains);

  domains.forEach((domain) => {
    if (hostname.includes(domain)) {
      chrome.runtime.sendMessage({ redirect: "https://google.com" });
    }
  });
});

// read,edit delete it from content

chrome.storage.sync.get(["codetime"], (result) => {
  console.log("codetime value is: ", result.codetime);
});

// document.querySelector('#code-time').addEventListener('change', (e) => {
//   // console.log(e.target.checked)
//   // if(e.target.checked){
//   //   chrome.storage.sync.set({codetime: true}, (res) => {
//   //     console.log('codetime value is set to: ', true)
//   //   })
//   // }else {
//   //   chrome.storage.sync.set({codetime: false}, (res) => {
//   //     console.log('codetime value is set to: ', false)
//   //   })
//   // }
// })
