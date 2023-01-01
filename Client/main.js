todoForm.title.addEventListener('keypad', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));


todoForm.addEventListener('submit', onSubmit);

const api  = new Api('http://localhost:5000/tasks');
const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;


function validateField(field) {

  const { name, value } = field;

  let = validationMessage = '';

  switch (name) {

    case 'title': {
      if (value.length < 2) {
        titleValid = false;
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "The 'Title' field must not contain more than 100 characters";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "The 'Description' field must not contain more than 500 characters";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "The field 'Completed latest' is mandatory.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}



function onSubmit(e) { // for submting 

  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');
    saveTask();
  }
}

function saveTask() { // for saving the tasks 
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };


   api.create(task).then((task) => { // creating tasks 
    if (task) {
      renderList();
    }
  });
 }

 
function renderList() {
  console.log('rendering');
  api.getAll().then((tasks) => {
    todoListElement.innerHTML = '';
    if (tasks && tasks.length > 0) {
      sorTasks(tasks);
        tasks.forEach((task) => {
          todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
        });
        const taskCheckboxes = document.querySelectorAll('.checkbox');
        taskCheckboxes.forEach(cb => {
        cb.addEventListener('click', () => {
       updateTask(cb.id, { completed: cb.checked });
  });
});
}
    });
}


const renderTask = ({ id, title, description, dueDate, completed }) => {
  let html = `
  <li class="select-none mt-2 py-2 px-2 border-b border--600 ${completed ? 'bg-blue-500 bg-opacity-30' : ''}">
    <div class="flex items-center">
      <h3 class="mb-3 flex-1 text-2xl font-bold text-green-800 uppercase ${completed ? 'line-through text-opacity-50' : ''}">${title}</h3>
      <div class="flex flex-col w-32">
        <span class="basis-full">${dueDate}</span>
        <div class="flex basis-full my-2">
          <label for="${id}" class="flex-1">Klar</label>
          <input type="checkbox" id="${id}" name="checkbox" class="checkbox flex-1" ${completed ? 'checked' : ''}>
        </div>
        <button onclick="deleteTask(${id})" class="inline-block w-full bg-yellow-600 text-sm text-black border border-white px-3 py-1 rounded-md my-2">Ta bort</button>
      </div>
    </div>`;

  if (description) {
    html += `<p class="ml-8 mt-2 text-xs italic">${description}</p>`;
  }
  html += '</li>';
  return html;
};

function deleteTask(id) { // Delete Task
  
    api.remove(id).then((result) => { 
    if (result) {
    renderList();
    }
  });

}

function sorTasks(tasks) { // Sort Tasks
  
    tasks.sort((a, b) => {
    return a.completed && !b.completed ? 1 : !a.completed && b.completed ? -1 :
      a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
  });

}

const updateTask = (id, data) => { // Update Task

  api.update(id, data).then((result) => {
  
  });
};

renderList(); // calling it 