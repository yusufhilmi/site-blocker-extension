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

const handleEditEnd = (el) => {
  el.addEventListener("blur", (e) => {
    const habitId = Number(e.target.getAttribute("data-for").substring(5));
    const habit = habits.find((habit) => habit.id === habitId);
    habit.title = e.target.textContent;

    // sync storage
    // chrome.storage.sync.set({ habits: habits });
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
    }</span> <span data-for="habit${habit.id}">X</span>`;
    habitsList.append(habitListItem);

    // add toggle listener
    handleToggle(habitListItem.children[0], habit);

    // add title update/edit listener
    handleEditEnd(habitListItem.children[1]);

    // add click listener to remove a habit
    handleDelete(habitListItem.children[2]);
  });
});

const addHabitButton = document.getElementById("add-habit");

addHabitButton.addEventListener("click", () => {
  let id;
  if (habits[habits.length - 1]) {
    id = habits[habits.length - 1].id + 1;
  } else {
    id = 0;
  }
  let habit = {
    id: id,
    title: "To-do",
    completed: false,
  };

  let newHabit = document.createElement("li");
  newHabit.innerHTML = `
  <input type="checkbox" class="habitToggle" id="habit${id}" ${
    habit.completed ? "checked" : ""
  } /> <span contenteditable="true" data-for="habit${id}">${
    habit.title
  }</span> <span data-for="habit${id}">X</span>`;

  habits.push(habit);
  // chrome.storage.sync.set({ habits: habits });
  habitsList.appendChild(newHabit);

  console.log("Habit after add: ", habits);

  // add toggle listener
  handleToggle(newHabit.children[0], habit);

  // add title update/edit listener
  handleEditEnd(newHabit.children[1]);

  // add click listener to remove a habit
  handleDelete(newHabit.children[2]);
});
