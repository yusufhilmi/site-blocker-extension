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

chrome.storage.sync.get(["domains"], (res) => {
  domains = res.domains;

  console.log("domains that are going to be blocked: ", domains);

  domains.forEach((domain) => {
    if (hostname.includes(domain)) {
      document.body.innerHTML = body;
      document.head.innerHTML = "";
      console.log(hostname);
    }
  });
});

// read,edit delete it from content

// chrome.storage.sync.get(['codetime'], (result)=> {
//   console.log('codetime value is: ', result.codetime)
// })

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
