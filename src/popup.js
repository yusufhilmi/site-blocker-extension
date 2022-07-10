const handleToggle = (el, habit) => {
  el.addEventListener("change", (e) => {
    if (e.target.checked) {
      habit.completed = true;
    } else {
      habit.completed = false;
    }

    // sync storage
    // chrome.storage.sync.set({ habits: habits });
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
  // console.log(habit, habitId, el);
  // get the index and cut it out from the habits array
  let index = habits.findIndex((habit) => habit.id === habitId);
  habits.splice(index, 1);

  // sync it with storage
  // chrome.storage.sync.set({ habits: habits });

  el.removeEventListener("blur", editHabit);

  // focus on previous parents previous sibling
  focusOnPrevious(el);

  el.parentElement.remove();
};

const addHabit = (id, habit, isNew = false) => {
  let newHabitListItem = document.createElement("li");
  newHabitListItem.innerHTML = `
  <input type="checkbox" class="habitToggle" id="habit${id}" ${
    habit.completed ? "checked" : ""
  } /> <span contenteditable="true"${
    isNew ? "data-placeholder=" + habit.title : ""
  } data-habit=${id} data-for="habit${id}">${isNew ? "" : habit.title}</span>`;

  // if (habitsList.children.length === 0) hideAddNewHabitButton()
  habitsList.appendChild(newHabitListItem);
  if (isNew) {
    habits.push(habit);
    // chrome.storage.sync.set({ habits: habits });
    newHabitListItem.children[1].focus();
    // console.log("Habit after add: ", habits);
  }

  // add toggle listener
  handleToggle(newHabitListItem.children[0], habit);

  // add title update/edit listener
  handleEditHabit(newHabitListItem.children[1]);
};

const editHabit = (e) => {
  const habitId = Number(e.target.getAttribute("data-for").substring(5));
  const habit = habits.find((habit) => habit.id === habitId);
  if (!e.target.textContent) {
    deleteHabit(e.target);
    return;
  }
  habit.title = e.target.textContent;
  // console.log("from edit target text content:", e.target);
  // sync storage
  // chrome.storage.sync.set({ habits: habits });
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
    // console.log("New Domain Added: ", domains);
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

  console.log(domains);
  // sync storage
  // chrome.storage.sync.set({ domains: domains });
};

const deleteDomain = (el, id) => {
  const domainIndex = domains.findIndex((domain) => domain.id === id);
  domains.splice(domainIndex, 1);
  // sync storage
  // chrome.storage.sync.set({ domains: domains });
  // console.log(domains);

  // will come into play with the keyboard shortcuts and tricks
  el.removeEventListener("blur", editDomain);
  el.parentElement.remove();
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

window.addEventListener("DOMContentLoaded", () => {
  // chrome.storage.sync.get(["habits"], (res) => {
  // habits = res.habits;
  habits = [
    {
      id: 1,
      title: "Read Book for 30 min",
      completed: false,
    },
  ];

  habits.forEach((habit) => {
    addHabit(habit.id, habit);
  });
  // }); // end of habits storage sync

  domains = [
    { id: 1, host: "youtube.com" },
    { id: 2, host: "instagram.com" },
    { id: 3, host: "netflix.com" },
    { id: 4, host: "dizibox" },
  ];

  domains.forEach((domain) => {
    addDomain(domain);
  });
});

const addHabitButton = document.getElementById("add-habit");

// add habit
addHabitButton.addEventListener("click", () => {
  let id = getNewId(habits);
  let habit = {
    id: id,
    title: "To-do",
    completed: false,
  };

  addHabit(id, habit, true);
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
};

const activateDefault = () => {
  customRedirectButton.setAttribute("data-active", false);
  defaultRedirectButton.setAttribute("data-active", true);
  customRedirectLinkInput.classList.add("hidden");
  customRedirectLinkError.classList.add("hidden");
};

// read chrome storage here activate accoridingly.

const validateURL = () => {
  let isValid = customRedirectLinkInput.checkValidity();
  if (!isValid) {
    customRedirectLinkError.classList.remove("hidden");
  } else {
    customRedirectLinkError.classList.add("hidden");
    // set chrome storage here
  }
};

customRedirectButton.addEventListener("click", (e) => {
  console.log("clicked custom");
  isActive = e.target.getAttribute("data-active");
  if (isActive === "true") {
    activateDefault();
  } else if (isActive === "false") {
    activateCustom();
  }
});

defaultRedirectButton.addEventListener("click", (e) => {
  console.log("clicked default");
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
  console.log(domains);
  if (isSettingsOpen) {
    if (e.code === "BracketLeft") {
      e.preventDefault();
      closeSettings();
    }
  } else {
    if (e.code === "BracketRight") {
      e.preventDefault();
      openSettings();
    }
  }

  let habit = {
    id: null,
    title: "To-do",
    completed: false,
  };
  let selection = window.getSelection();

  if (e.code === "Enter") {
    // if one of the todos contenteditables are focused
    //  when caret is at the end and 'Enter' is pressed, create a new todo underneath
    if (document.activeElement.hasAttribute("data-habit")) {
      // disable new line by enter
      e.preventDefault();

      // check the checkbox with cmd+enter combination
      if (e.metaKey || e.ctrlKey) {
        // console.log(e.target.previousElementSibling);
        let inp = e.target.previousElementSibling;
        if (inp.checked) {
          inp.checked = false;
        } else {
          inp.checked = true;
        }
        return;
      }

      if (
        selection.focusNode?.nodeType === 3 &&
        selection.focusOffset === selection.focusNode.length
      ) {
        // irrelevant note: I have an urge to create my own framework 3 July 2022 11:56pm
        habit.id = getNewId(habits);
        addHabit(habit.id, habit, true);
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
    let id = getNewId(habits);
    habit.id = id;
    addHabit(id, habit, true);
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

/* TODO:
[] while closing the blocker for a domain take text input saying "I want to be lazy" or "I will be closer to my targets"
    point is get some text input, don't blame but increase awareness, set a timer boom ure in!

It was fun to try building with bare js,html,css it was also helpful to learn what goes into a web framework like React.
*/
