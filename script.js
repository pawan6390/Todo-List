// Task Constructor
class Task {
    constructor(id, description, dueDate, priority, category, completed = false) {
        this.id = id;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.category = category;
        this.completed = completed;
    }
}

// Get tasks from local storage
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('task-input').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority-select').value;
    const category = document.getElementById('category-input').value;

    if (taskInput && dueDate) {
        const tasks = getTasks();
        const newTask = new Task(Date.now(), taskInput, dueDate, priority, category);
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();
        clearForm();
    }
}

// Clear form fields
function clearForm() {
    document.getElementById('task-input').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('priority-select').value = 'low';
    document.getElementById('category-input').value = '';
}

// Render tasks
function renderTasks(filter = 'all') {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const tasks = getTasks();

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task');
        if (task.completed) taskItem.classList.add('completed');

        taskItem.innerHTML = `
            <div>
                <strong>${task.description}</strong> 
                <em>Due: ${task.dueDate}</em> 
                [${task.priority}] - ${task.category}
            </div>
            <div class="task-buttons">
                <button class="complete-btn" onclick="toggleComplete(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// Toggle task complete
function toggleComplete(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
}

// Edit task
function editTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);

    document.getElementById('task-input').value = task.description;
    document.getElementById('due-date').value = task.dueDate;
    document.getElementById('priority-select').value = task.priority;
    document.getElementById('category-input').value = task.category;

    deleteTask(id);
}

// Delete task
function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    renderTasks();
}

// Filter tasks
document.getElementById('all-tasks-btn').addEventListener('click', () => renderTasks('all'));
document.getElementById('completed-tasks-btn').addEventListener('click', () => renderTasks('completed'));
document.getElementById('pending-tasks-btn').addEventListener('click', () => renderTasks('pending'));

// Add task event listener
document.getElementById('add-task-btn').addEventListener('click', addTask);

// Initial render
document.addEventListener('DOMContentLoaded', () => renderTasks());
