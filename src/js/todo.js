const state = [];
const tasks = document.querySelector('#tasks');
const submitButton = document.querySelector('#submitButton');
const newTask = document.querySelector('#newTask');
const eraseButton = document.querySelector('#clearStorage');
const defaultHtml = `
  <div class="tasks__title pending">To do:</div>
  <div class="tasks__title finished">Finished:</div>
  <div class="task__erase erase-button" onclick="emptyState()">Delete browser storage</div>
`;

function saveState() {
  window.localStorage.setItem('state', JSON.stringify(state));
}

function setDeleteListener() {
  const delButtons = document.querySelectorAll('.tasks__delete');
  for (let i = 0; i < delButtons.length; i += 1) {
    delButtons[i].addEventListener('click', () => {
      const itemId = delButtons[i].parentNode.getAttribute('itemId');
      const pos = state.map((e) => e.id).indexOf(itemId);
      state.splice(pos, 1);
      saveState();
      delButtons[i].parentNode.classList.toggle('delete');
      setTimeout(() => { delButtons[i].parentNode.remove(); }, 500);
    });
  }
}

function setCheckmarkListener() {
  const checkmarks = document.querySelectorAll('.tasks__item');
  for (let i = 0; i < checkmarks.length; i += 1) {
    checkmarks[i].addEventListener('click', () => {
      const itemId = checkmarks[i].getAttribute('itemId');
      const pos = state.map((e) => e.id).indexOf(itemId);
      if (pos !== -1) {
        state[pos].done = !state[pos].done;
        saveState();
        checkmarks[i].classList.toggle('tasks--done');
        checkmarks[i].classList.toggle('tasks--pending');
      }
    });
  }
}

function render(item) {
  if (item.done) {
    tasks.innerHTML += `
    <div class="tasks__item tasks--done" itemId=${item.id}>
      <i class="fas fa-trash-alt tasks__delete"></i>
      <i class="far fa-check-circle tasks__checkmark"></i>
      <h3 class="tasks__text">${item.text}</h3>
    </div>`;
  } else {
    tasks.innerHTML += `
    <div class="tasks__item tasks--pending" itemId=${item.id}>
      <i class="fas fa-trash-alt tasks__delete"></i>
      <i class="far fa-check-circle tasks__checkmark"></i>
      <h3 class="tasks__text">${item.text}</h3>
    </div>`;
  }
  setCheckmarkListener();
  setDeleteListener();
}

window.addEventListener('statechangeDefault', () => {
  const savedState = JSON.parse(window.localStorage.getItem('state'));
  if (savedState) {
    savedState.forEach((item) => {
      state.push(item);
      render(item);
    });
  }
});

window.addEventListener('statechangeAdd', () => {
  render(state[state.length - 1]);
});

function update(text) {
  state.push({ text, done: false, id: `id${Date.now()}` });
  saveState();
  newTask.value = '';
  window.dispatchEvent(new Event('statechangeAdd'));
}

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (newTask.value !== '') {
    update(newTask.value);
  }
});

function emptyState() {
  state.splice(0, state.length);
  saveState();
  tasks.innerHTML = defaultHtml;
  window.dispatchEvent(new Event('statechangeDefault'));
}

eraseButton.addEventListener('click', () => {
  emptyState();
});

window.dispatchEvent(new Event('statechangeDefault'));
