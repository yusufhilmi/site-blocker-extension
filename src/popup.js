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

const editHabit = (e) => {
  const habitId = Number(e.target.getAttribute("data-for").substring(5));
  const habit = habits.find((habit) => habit.id === habitId);
  if (!e.target.textContent) {
    deleteHabit(e.target);
    return;
  }
  habit.title = e.target.textContent;
  console.log("from edit target text content:", e.target);
  // sync storage
  // chrome.storage.sync.set({ habits: habits });
};

const handleEditHabit = (el) => {
  el.addEventListener("blur", editHabit);
};

const handleEditDomain = (el, id) => {
  el.addEventListener("blur", (e) => editDomain(e, id));
};

// there is a hidden bug in these indexes, it will change when in use
const handleDeleteDomain = (el, id) => {
  el.addEventListener("click", (e) => deleteDomain(el, id));
};

// TODO: not sure if add new button should always be there or not
// const showAddNewHabitButton = () => {
//   console.log("show the add new button now");
// };
// const hideAddNewHabitButton = () => {
//   console.log("hide the add new button now");
// };

const deleteHabit = (el) => {
  const habitId = Number(el.getAttribute("data-for").substring(5));
  const habit = habits.find((habit) => habit.id === habitId);
  console.log(habit, habitId, el);
  // get the index and cut it out from the habits array
  let index = habits.findIndex((habit) => habit.id === habitId);
  habits.splice(index, 1);

  // sync it with storage
  // chrome.storage.sync.set({ habits: habits });

  el.removeEventListener("blur", editHabit);

  // focus on previous parents previous sibling
  el.parentElement.previousElementSibling?.children[1].focus();
  let selection = document.getSelection();
  selection.collapse(selection.focusNode, selection.focusNode.length);
  console.log(selection);
  // document.getSelection().collapse(this.target, pos)
  // if (habitsList.children.length === 1) showAddNewHabitButton();
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
    console.log("Habit after add: ", habits);
  }

  // add toggle listener
  handleToggle(newHabitListItem.children[0], habit);

  // add title update/edit listener
  handleEditHabit(newHabitListItem.children[1]);
};

const addDomain = (domain, isNew = false) => {
  let newHost = "e.g. instagram or netflix.com";

  let domainListItem = document.createElement("li");
  domainListItem.innerHTML = `
  <span contenteditable="true" data-domain=${domain.id} ${
    isNew ? "data-placeholder='" + newHost + "'" : ""
  }>${
    isNew ? "" : domain.host
  }</span><button class="delete w-6 h-6 outline-none p-1 rounded hover:bg-hab-300 focus-visible:bg-hab-300 focus-visible:scale-110 hover:scale-110 transition ease-in-out duration-200"><img src="./trash-can.svg"/></button>
`;
  domainsList.append(domainListItem);

  // handle edits
  handleEditDomain(domainListItem.children[0], domain.id);

  // handle delete
  handleDeleteDomain(domainListItem.children[1], domain.id);

  if (isNew) {
    domains.push(domain);
    domainListItem.children[0].focus();
    console.log("New Domain Added: ", domains);
  }
};

const editDomain = (e, id) => {
  // if (e.target.textContent === "") el.remove();
  const domain = domains.find((domain) => domain.id === id);

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
  console.log(domains);

  // will come into play with the keyboard shortcuts and tricks
  // el.previousElementSibling.removeEventListener("blur", (e) =>
  //   editDomain(e, id)
  // );
  el.parentElement.remove();
};

// const getLastId = (arr) => {
//   // array of objects with ID { id: 0, ...}
//   if (arr[arr.length - 1]) {
//     // this op is ok since it is ordered but be careful
//     return arr[arr.length - 1].id + 1;
//   } else {
//     return 0;
//   }
// };

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
  let id;
  if (habits[habits.length - 1]) {
    // this op is ok since it is ordered but be careful
    id = habits[habits.length - 1].id + 1;
  } else {
    id = 0;
  }
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
  let id;
  if (domains[domains.length - 1]) {
    // this op is ok since it is ordered but be careful
    id = domains[domains.length - 1].id + 1;
  } else {
    id = 0;
  }
  addDomain({ id: id, host: "" }, true);
});

let isSettingsOpen = false;
const settingsButton = document.querySelector("#settings");
const backButton = document.querySelector(".back-button");
const settingsContainer = document.querySelector(".settings-container");
const mainContainer = document.querySelector(".main-container");

settingsButton.addEventListener("click", () => {
  if (!isSettingsOpen) {
    settingsContainer.classList.remove("hidden");
    mainContainer.classList.add("hidden");
    isSettingsOpen = true;
  }
});

backButton.addEventListener("click", () => {
  if (isSettingsOpen) {
    settingsContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    isSettingsOpen = false;
  }
});

window.addEventListener("keydown", (e) => {
  console.log(domains);
  if (isSettingsOpen) {
    if (e.code === "BracketLeft") {
      e.preventDefault();
      settingsContainer.classList.add("hidden");
      mainContainer.classList.remove("hidden");
      isSettingsOpen = false;
    }
  } else {
    if (e.code === "BracketRight") {
      e.preventDefault();
      settingsContainer.classList.remove("hidden");
      mainContainer.classList.add("hidden");
      isSettingsOpen = true;
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
    //  when 'Enter' is pressed create a new todo underneath
    if (document.activeElement.hasAttribute("data-habit")) {
      // disable new line by enter
      e.preventDefault();

      // check the checkbox with cmd+enter combination
      if (e.metaKey || e.ctrlKey) {
        console.log(e.target.previousElementSibling);
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
        let maxIndex = 0;
        // get habits, just insert to the bottom
        habits.filter((habit, i) => {
          if (habit.id >= maxIndex) {
            maxIndex = habit.id;
            return true;
          }
          return false;
        });

        // irrelevant note: I have an urge to create my own framework 3 July 2022 11:56pm
        habit.id = maxIndex + 1;
        addHabit(habit.id, habit, true);
      }
    }
  }

  if (e.code === "Backspace") {
    let isHabit = document.activeElement.getAttribute("data-habit");
    let isDomain = document.activeElement.getAttribute("data-domain");
    if ((isHabit || isDomain) && selection.focusNode?.nodeType === 1) {
      e.preventDefault();
      isHabit ? deleteHabit(e.target) : null;
      // isDomain ? deleteDomain(e.target, Number(isDomain)) : null;
    }
  }

  if (document.activeElement === document.body && e.code === "KeyN") {
    e.preventDefault();
    habit.id = 0;
    addHabit(0, habit, true);
  }

  if (e.code === "Escape") {
    document.activeElement.blur();
  }

  // watch out this part for domains
  if (e.code === "ArrowUp") {
    document.activeElement.parentElement?.previousElementSibling?.children[1]?.focus();
  }

  if (e.code === "ArrowDown") {
    document.activeElement.parentElement?.nextElementSibling?.children[1]?.focus();
  }
});

/* TODO:
[x] clear ui, delete X button.
[x]focus on previous habit after delete
[] apply same edits to domain (Enter -> new domain, backspace -> delete, N -> new domain)


It was fun to try building with bare js,html,css it was also helpful to learn what goes into a web framework like React.
*/
