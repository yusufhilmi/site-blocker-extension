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
  el.addEventListener("blur", (e) => {
    const habitId = Number(e.target.getAttribute("data-for").substring(5));
    const habit = habits.find((habit) => habit.id === habitId);
    habit.title = e.target.textContent;
    // if (e.target.textContent === "") {
    //   const habitIndex = habits.findIndex((habit) => habit.id === habitId);
    //   habits.slice(habitIndex, 1);
    //   el.parentElement.remove();
    // }

    // sync storage
    // chrome.storage.sync.set({ habits: habits });
  });
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
    let habitListItem = document.createElement("li");
    habitListItem.innerHTML = `
        <input type="checkbox" class="habitToggle" id="habit${habit.id}" ${
      habit.completed ? "checked" : ""
    } /> <span contenteditable="true" data-for="habit${habit.id}">${
      habit.title
    }</span> <span class="delete" data-for="habit${habit.id}">X</span>`;
    habitsList.append(habitListItem);

    // add toggle listener
    handleToggle(habitListItem.children[0], habit);

    // add title update/edit listener
    handleEditHabit(habitListItem.children[1]);

    // add click listener to remove a habit
    handleDelete(habitListItem.children[2]);
  });
  // }); // end of habits sync

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

  let newHabitListItem = document.createElement("li");
  newHabitListItem.innerHTML = `
  <input type="checkbox" class="habitToggle" id="habit${id}" ${
    habit.completed ? "checked" : ""
  } /> <span contenteditable="true" data-placeholder="${
    habit.title
  }" data-for="habit${id}"></span> <span class="delete" data-for="habit${id}">X</span>`;

  habits.push(habit);
  // chrome.storage.sync.set({ habits: habits });
  habitsList.appendChild(newHabitListItem);
  newHabitListItem.children[1].focus();

  console.log("Habit after add: ", habits);

  // add toggle listener
  handleToggle(newHabitListItem.children[0], habit);

  // add title update/edit listener
  handleEditHabit(newHabitListItem.children[1]);

  // add click listener to remove a habit
  handleDelete(newHabitListItem.children[2]);
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

settingsButton.addEventListener("click", () => {
  if (!isSettingsOpen) {
    settingsContainer.classList.remove("hidden");
    isSettingsOpen = true;
  }
});

backButton.addEventListener("click", () => {
  if (isSettingsOpen) {
    settingsContainer.classList.add("hidden");
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
});
