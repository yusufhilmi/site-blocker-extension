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
  habit.title = e.target.textContent;
  console.log("from edit target text content:", e.target);
  // if (e.target.textContent === "") {
  //   const habitIndex = habits.findIndex((habit) => habit.id === habitId);
  //   habits.slice(habitIndex, 1);
  //   el.parentElement.remove();
  // }

  // sync storage
  // chrome.storage.sync.set({ habits: habits });
};

const handleEditHabit = (el) => {
  el.addEventListener("blur", editHabit);
};

const handleEditDomain = (el, id) => {
  el.addEventListener("blur", (e) => {
    // if (e.target.textContent === "") el.remove();

    const domain = domains.find((domain) => domain.id === id);

    domain.host = e.target.textContent;

    console.log(domains);
    // sync storage
    // chrome.storage.sync.set({ domains: domains });
  });
};

// there is a hidden bug in these indexes, it will change when in use
const handleDeleteDomain = (el, id) => {
  el.addEventListener("click", (e) => {
    const domainIndex = domains.findIndex((domain) => domain.id === id);
    domains.splice(domainIndex, 1);
    // sync storage
    // chrome.storage.sync.set({ domains: domains });
    console.log(domains);
    el.parentElement.remove();
  });
};

const handleDelete = (el) => {
  el.addEventListener("click", (e) => {
    const habitId = Number(e.target.getAttribute("data-for").substring(5));
    const habit = habits.find((habit) => habit.id === habitId);
    // additional check in case unrealized bugs pop up
    if (habit.title === el.previousElementSibling.textContent) {
      // get the index and cut it out from the habits array
      let index = habits.findIndex((habit) => habit.id === habitId);
      habits.splice(index, 1);

      // sync it with storage
      // chrome.storage.sync.set({ habits: habits });
      el.parentElement.remove();
    }
  });
};

// TODO:
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
  } data-habit=${id} data-for="habit${id}">${
    isNew ? "" : habit.title
  }</span> <span class="delete" data-for="habit${id}">X</span>`;

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

  // add click listener to remove a habit
  handleDelete(newHabitListItem.children[2]);
};

const addDomain = () => {};

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

  domains.forEach((domain, i) => {
    let domainListItem = document.createElement("li");
    domainListItem.innerHTML = `
    <span contenteditable="true">${domain.host}</span> <span class="delete">X</span>
  `;
    domainsList.append(domainListItem);

    // handle edits
    handleEditDomain(domainListItem.children[0], domain.id);

    // handle delete
    handleDeleteDomain(domainListItem.children[1], domain.id);
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
  let newHost = "ie. instagram or netflix.com";
  let id;
  if (domains[domains.length - 1]) {
    // this op is ok since it is ordered but be careful
    id = domains[domains.length - 1].id + 1;
  } else {
    id = 0;
  }
  let newDomainListItem = document.createElement("li");
  newDomainListItem.innerHTML = `
  <span contenteditable="true" data-placeholder="${newHost}"></span> <span class="delete">X</span>
  `;

  domains.push({ id: id, host: "" });
  domainsList.appendChild(newDomainListItem);
  newDomainListItem.children[0].focus();

  console.log("New Domain Added: ", domains);

  // handle edits
  handleEditDomain(newDomainListItem.children[0], id);

  // handle delete
  handleDeleteDomain(newDomainListItem.children[1], id);
});

let isSettingsOpen = false;
const settingsButton = document.querySelector("#settings");
const backButton = document.querySelector(".back-button");
const settingsContainer = document.querySelector(".settings-container");
const mainContainer = document.querySelector(".container");

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
  console.log(e);
  if (isSettingsOpen) {
    if (e.code === "BracketLeft") {
      settingsContainer.classList.add("hidden");
      isSettingsOpen = false;
    }
  } else {
    if (e.code === "BracketRight") {
      settingsContainer.classList.remove("hidden");
      isSettingsOpen = true;
    }
  }

  if (e.code === "Enter") {
    // if one of the todos contenteditables are focused
    //  when 'Enter' is pressed create a new todo underneath
    if (document.activeElement.hasAttribute("data-habit")) {
      // disable new line by enter
      e.preventDefault();

      let id = document.activeElement.getAttribute("data-habit");
      let index = null;
      // get habits, insert into the index after the click
      habits.filter((habit, i) => {
        if (habit.id === Number(id)) {
          index = i;
          return true;
        }
        return false;
      });

      let habit = {
        id: id,
        title: "To-do",
        completed: false,
      };

      habits.splice(index, 0, habit);
      // irrelevant note: I have an urge to create my own framework 3 July 2022 11:56pm

      addHabit(id, habit, true);

      console.log();
      console.log("Enter has been pressed while editing todos");
      console.log(habits);
    }

    console.log(document.activeElement);
  }

  if (e.code === "Backspace") {
    let selection = window.getSelection();
    let id = document.activeElement.getAttribute("data-habit");
    if (id && selection.focusNode?.nodeType === 1) {
      deleteHabit(e.target);
    }
  }
});

/* TODOS:
[] To add new todo after Enter. need a mechanism to render. Don't wanna use React yet, just clean the code for f*s sake.
  - add new habit, should both change the state and render the ui
  - remove new habit, same
[] delete the todo with Backspace when it is empty
[] discard empty todo if no input is given.
[] add a 6 dot icon to the left


It was fun to try building with bare js,html,css it was also helpful to learn what goes into a web framework like React.
*/
