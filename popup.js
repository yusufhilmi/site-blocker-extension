// document.getElementById("tex").addEventListener("click", () => {
//   chrome.storage.sync.get(["domains"], (res) => {
//     domains = res.domains;

//     console.log("domains that are going to be blocked: ", domains);
//   });
// });

const domainsList = document.getElementById("domains");
const habitsList = document.getElementById("habits");
let habits = [];

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["habits"], (res) => {
    habits = res.habits;
    console.log(habits);

    habits.forEach((habit, i) => {
      let habitListItem = document.createElement("li");
      habitListItem.innerHTML = `
        <input type="checkbox" class="habitToggle" id="habit${i}" ${
        habit.completed ? "checked" : ""
      } /> <span contenteditable="true" data-for="habit${i}">${
        habit.title
      }</span> <span data-for="habit${i}">X</span>`;
      habitsList.append(habitListItem);

      // add toggle listener
      habitListItem.firstElementChild.addEventListener("change", (e) => {
        if (e.target.checked) {
          habit.completed = true;
        } else {
          habit.completed = false;
        }
        chrome.storage.sync.set({ habits: habits });
      });

      // add title update/edit listener
      habitListItem.children[1].addEventListener("blur", (e) => {
        const habitId = e.target.getAttribute("data-for").substring(5);
        habits[habitId].title = e.target.textContent;
        chrome.storage.sync.set({ habits: habits });
      });

      habitListItem.children[2].addEventListener("click", (e) => {
        const habitId = e.target.getAttribute("data-for").substring(5);
        habits.splice(habitId, 1);
        chrome.storage.sync.set({ habits: habits });
        habitListItem.remove();
      });
    });
  });
});

const addHabitButton = document.getElementById("add-habit");

addHabitButton.addEventListener("click", () => {
  let habit = { title: "To-do", completed: false };
  let i = habits.length;
  let newHabit = document.createElement("li");
  newHabit.innerHTML = `
  <input type="checkbox" class="habitToggle" id="habit${i}" ${
    habit.completed ? "checked" : ""
  } /> <span contenteditable="true" data-for="habit${i}">${
    habit.title
  }</span> <span data-for="habit${i}">X</span>`;

  //// REPEATED CODE
  // toggle the item
  newHabit.firstElementChild.addEventListener("change", (e) => {
    if (e.target.checked) {
      habit.completed = true;
    } else {
      habit.completed = false;
    }
    chrome.storage.sync.set({ habits: habits });
  });

  //// REPEATED CODE
  newHabit.children[1].addEventListener("blur", (e) => {
    const habitId = e.target.getAttribute("data-for").substring(5);
    console.log(habitId);
    console.log(habits[habitId]);

    habits[habitId].title = e.target.textContent;
    chrome.storage.sync.set({ habits: habits });
  });

  //// REPEATED CODE
  newHabit.children[2].addEventListener("click", (e) => {
    const habitId = e.target.getAttribute("data-for").substring(5);
    habits.splice(habitId, 1);
    chrome.storage.sync.set({ habits: habits });
    newHabit.remove();
  });

  habits.push(habit);
  chrome.storage.sync.set({ habits: habits });
  habitsList.appendChild(newHabit);
});
