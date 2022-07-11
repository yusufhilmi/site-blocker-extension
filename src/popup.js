const handleToggle = (el, habit) => {
  el.addEventListener("change", (e) => {
    if (e.target.checked) {
      habit.completed = true;
    } else {
      habit.completed = false;
    }

    // sync storage
    chrome.storage.sync.set({ habits });
  });
};

const handleEditHabit = (el) => {
  el.addEventListener("blur", editHabit);
};

const handleEditDomain = (el) => {
  el.addEventListener("blur", editDomain);
};

// there is a hidden bug in these indexes, it will change when in use
const handleDeleteDomain = (el, id) => {
  el.addEventListener("click", (e) => deleteDomain(el, id));
};

const deleteHabit = (el) => {
  const habitId = Number(el.getAttribute("data-habit"));
  // get the index and cut it out from the habits array
  let index = habits.findIndex((habit) => habit.id === habitId);
  habits.splice(index, 1);

  // sync it with storage
  chrome.storage.sync.set({ habits });

  el.removeEventListener("blur", editHabit);

  // focus on previous parents previous sibling
  focusOnPrevious(el);

  el.parentElement.remove();
};

const addHabit = (habit = {}, isNew = false) => {
  let id;
  if (isNew) {
    id = getNewId(habits);
    habit = {
      id: id,
      title: "",
      completed: false,
    };
  } else {
    if (typeof habit.id !== "number") {
      console.error("can't add empty habit");
      return;
    }
  }

  let newHabitListItem = document.createElement("li");
  newHabitListItem.innerHTML = `
  <input type="checkbox" class="habitToggle"${
    habit.completed ? "checked" : ""
  } /> <span contenteditable="true"${
    isNew ? "data-placeholder=To-do" : ""
  } data-habit=${habit.id} ">${isNew ? "" : habit.title}</span>`;

  habitsList.appendChild(newHabitListItem);
  if (isNew) {
    habits.push(habit);
    chrome.storage.sync.set({ habits });
    newHabitListItem.children[1].focus();
  }

  // add toggle listener
  handleToggle(newHabitListItem.children[0], habit);

  // add title update/edit listener
  handleEditHabit(newHabitListItem.children[1]);
};

const editHabit = (e) => {
  const habitId = Number(e.target.getAttribute("data-habit"));
  const habit = habits.find((habit) => habit.id === habitId);
  if (!e.target.textContent) {
    deleteHabit(e.target);
    return;
  }
  habit.title = e.target.textContent;
  // sync storage
  chrome.storage.sync.set({ habits });
};

const addDomain = (domain, isNew = false) => {
  let newHost = "e.g. instagram or netflix.com";

  let domainListItem = document.createElement("li");
  domainListItem.innerHTML = `
  <span contenteditable="true" data-domain=${domain.id} ${
    isNew ? "data-placeholder='" + newHost + "'" : ""
  }>${
    isNew ? "" : domain.host
  }</span><button class="delete w-6 h-6 outline-none p-1 rounded hover:bg-hab-300 focus-visible:bg-hab-300 dark:hover:bg-hab-600/50 dark:focus-visible:bg-hab-600/50 focus-visible:scale-110 hover:scale-110 transition ease-in-out duration-150"><img src="./trash-can.svg"/></button>
`;
  domainsList.append(domainListItem);

  // handle edits
  handleEditDomain(domainListItem.children[0]);

  // handle delete
  handleDeleteDomain(domainListItem.children[1], domain.id);

  if (isNew) {
    domains.push(domain);
    domainListItem.children[0].focus();
    chrome.storage.sync.set({ domains });
  }
};

const editDomain = (e) => {
  const id = Number(e.target.getAttribute("data-domain"));
  const domain = domains.find((domain) => domain.id === id);

  if (!e.target.textContent) {
    deleteDomain(e.target, id);
    return;
  }

  domain.host = e.target.textContent;

  // sync storage
  chrome.storage.sync.set({ domains });
};

const deleteDomain = (el, id) => {
  const sure = prompt(
    "Are you sure you want to delete this domain? \n Write DELETE DOMAIN to delete it."
  );

  if (sure === "DELETE DOMAIN") {
    const domainIndex = domains.findIndex((domain) => domain.id === id);
    domains.splice(domainIndex, 1);
    // sync storage
    chrome.storage.sync.set({ domains });

    // will come into play with the keyboard shortcuts and tricks
    el.removeEventListener("blur", editDomain);
    el.parentElement.remove();
  }
};

const getNewId = (arr) => {
  // array of objects with ID { id: 0, ...}
  if (arr[arr.length - 1]) {
    // this op is ok since it is ordered but be careful
    return arr[arr.length - 1].id + 1;
  } else {
    return 0;
  }
};

const focusOnPrevious = (el) => {
  el.parentElement.previousElementSibling?.children[1].focus();
  let selection = document.getSelection();
  selection.collapse(selection.focusNode, selection.focusNode.length);
};

const domainsList = document.getElementById("domains");
const habitsList = document.getElementById("habits");
let habits = [];
let domains = [];
let customRedirectURL = null;

const getChromeStorage = () => {
  chrome.storage.sync.get(["habits", "domains"], (res) => {
    habits = res.habits;
    habits.forEach((habit) => {
      addHabit(habit);
    });

    domains = res.domains;
    domains.forEach((domain) => {
      addDomain(domain);
    });
  });
};

window.addEventListener("DOMContentLoaded", () => {
  getChromeStorage();
});

const addHabitButton = document.getElementById("add-habit");

// add habit
addHabitButton.addEventListener("click", () => {
  addHabit({}, true);
});

const addDomainButton = document.querySelector("#add-domain");

// add new domain to block
addDomainButton.addEventListener("click", () => {
  let id = getNewId(domains);
  addDomain({ id: id, host: "" }, true);
});

// handle settings internal nav
let isSettingsOpen = false;
const settingsButton = document.querySelector("#settings");
const backButton = document.querySelector(".back-button");
const settingsContainer = document.querySelector(".settings-container");
const mainContainer = document.querySelector(".main-container");

const openSettings = () => {
  settingsContainer.classList.remove("hidden");
  mainContainer.classList.add("hidden");
  getCustomRedirect();
  isSettingsOpen = true;
};
const closeSettings = () => {
  settingsContainer.classList.add("hidden");
  mainContainer.classList.remove("hidden");
  isSettingsOpen = false;
};

settingsButton.addEventListener("click", () => {
  if (!isSettingsOpen) {
    openSettings();
  }
});

backButton.addEventListener("click", () => {
  if (isSettingsOpen) {
    closeSettings();
  }
});

// handle custom redirects
const defaultRedirectButton = document.querySelector("#redirect-default");
const customRedirectButton = document.querySelector("#redirect-custom");
const customRedirectLinkInput = document.querySelector("#redirect-link");
const customRedirectLinkError = document.querySelector("#redirect-link-error");

// cant do simple toggle because input will be bound to custom
const activateCustom = () => {
  customRedirectButton.setAttribute("data-active", true);
  defaultRedirectButton.setAttribute("data-active", false);
  customRedirectLinkInput.classList.remove("hidden");
  validateURL();
  customRedirectLinkInput.focus();
};

const activateDefault = () => {
  customRedirectButton.setAttribute("data-active", false);
  defaultRedirectButton.setAttribute("data-active", true);
  customRedirectLinkInput.classList.add("hidden");
  customRedirectLinkError.classList.add("hidden");
  customRedirectLinkInput.value = "";
  chrome.storage.sync.set({ customRedirect: null });
};

// read chrome storage, called in DOMContentLoaded
const getCustomRedirect = () => {
  chrome.storage.sync.get(["customRedirect"], (res) => {
    customRedirectURL = res.customRedirect;
    if (customRedirectURL) {
      activateCustom();
      customRedirectLinkInput.value = customRedirectURL;
    } else {
      activateDefault();
    }
  });
};

const validateURL = () => {
  let isValid = customRedirectLinkInput.checkValidity();
  if (!isValid) {
    customRedirectLinkError.classList.remove("hidden");
  } else {
    let inputValue = customRedirectLinkInput.value;

    customRedirectLinkError.classList.add("hidden");
    // set chrome storage here
    chrome.storage.sync.set({ customRedirect: inputValue });
  }
};

customRedirectButton.addEventListener("click", (e) => {
  isActive = e.target.getAttribute("data-active");
  if (isActive === "true") {
    activateDefault();
  } else if (isActive === "false") {
    activateCustom();
  }
});

defaultRedirectButton.addEventListener("click", (e) => {
  isActive = e.target.getAttribute("data-active");
  if (isActive === "true") {
    activateCustom();
  } else if (isActive === "false") {
    activateDefault();
  }
});

customRedirectLinkInput.addEventListener("blur", (e) => {
  validateURL();
});

// handle keyboard events
window.addEventListener("keydown", (e) => {
  if (isSettingsOpen) {
    if (e.code === "BracketLeft") {
      e.preventDefault();
      closeSettings();
    }
  } else {
    if (e.code === "BracketRight") {
      if (location.href.split("/").slice(-1)[0] === "blocked-page.html") return;
      e.preventDefault();
      openSettings();
    }
  }

  let selection = window.getSelection();

  if (e.code === "Enter") {
    // if one of the todos contenteditables are focused
    //  when caret is at the end and 'Enter' is pressed, create a new todo underneath
    if (document.activeElement.hasAttribute("data-habit")) {
      // disable new line by enter
      e.preventDefault();

      // check the checkbox with cmd+enter combination
      if (e.metaKey || e.ctrlKey) {
        let inp = e.target.previousElementSibling;
        if (inp.checked) {
          inp.checked = false;
        } else {
          inp.checked = true;
        }
        // dispatch the event
        var event = new Event("change");
        inp.dispatchEvent(event);
        return;
      }

      if (
        selection.focusNode?.nodeType === 3 &&
        selection.focusOffset === selection.focusNode.length
      ) {
        // irrelevant note: I have an urge to create my own framework 3 July 2022 11:56pm
        addHabit({}, true);
      }
    }
    if (document.activeElement.hasAttribute("data-domain")) {
      e.preventDefault();
      if (
        selection.focusNode?.nodeType === 3 &&
        selection.focusOffset === selection.focusNode.length
      ) {
        let domain = { id: getNewId(domains), host: "" };
        addDomain(domain, true);
      }
    }
  }

  let isHabit = document.activeElement.getAttribute("data-habit");

  if (e.code === "Backspace") {
    let isDomain = document.activeElement.getAttribute("data-domain");
    if ((isHabit || isDomain) && selection.focusNode?.nodeType === 1) {
      e.preventDefault();
      isHabit ? deleteHabit(e.target) : null;
      isDomain ? deleteDomain(e.target, Number(isDomain)) : null;
    }
  }

  if (
    !isSettingsOpen &&
    document.activeElement === document.body &&
    e.code === "KeyN"
  ) {
    e.preventDefault();
    addHabit({}, true);
  }

  if (e.code === "Escape") {
    document.activeElement.blur();
  }

  // watch out this part for domains
  if (e.code === "ArrowUp") {
    isHabit
      ? document.activeElement.parentElement?.previousElementSibling?.children[1]?.focus()
      : document.activeElement.parentElement?.previousElementSibling?.children[0]?.focus();
  }

  if (e.code === "ArrowDown") {
    isHabit
      ? document.activeElement.parentElement?.nextElementSibling?.children[1]?.focus()
      : document.activeElement.parentElement?.nextElementSibling?.children[0]?.focus();
  }
});

/*
It was fun to try building with bare js,html,css it was also helpful to learn what goes into a web framework like React.
*/

// bypass mechanism
// let's keep it only for default page for now, this is the worst way you can do this tbh

const toggleDataActiveButton = (e) => {
  if (e.target.hasAttribute("data-active")) {
    const isActive = e.target.getAttribute("data-active");
    if (isActive === "true") {
      e.target.setAttribute("data-active", false);
      return false;
    } else {
      e.target.setAttribute("data-active", true);
      return true;
    }
  } else {
    console.log("toggling wrong button");
  }
};

if (location.href.split("/").slice(-1)[0] === "blocked-page.html") {
  const bypassButton = document.querySelector("#bypass-button");
  const bypassOptions = document.querySelector("#bypass-options");

  // friction level 1
  bypassButton.addEventListener("click", (e) => {
    let isActive = toggleDataActiveButton(e);
    isActive
      ? bypassOptions.classList.remove("hidden")
      : bypassOptions.classList.add("hidden");
  });

  console.log(bypassOptions.children);
  options = Array.from(bypassOptions.children);
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      let isActive = toggleDataActiveButton(e);
      let interval = Number(e.target.getAttribute("data-time"));
      let until = new Date();
      until.setMinutes(until.getMinutes() + interval);
      if (isActive) {
        let sure = prompt(
          "Are you sure you want to go in there? \n Write I AM SURE THAT WILL BE A GOOD CHOICE"
        );
        if (sure === "I AM SURE THAT WILL BE A GOOD CHOICE") {
          chrome.runtime.sendMessage({ message: "let-in", until: until });
        }
      }
    });
  });
}
