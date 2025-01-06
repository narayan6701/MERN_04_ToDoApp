document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('tasks');
    const filters = document.querySelectorAll('.filter');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
    
        tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        }).forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
                <button class="delete-task">Delete</button>
            `;
            taskList.appendChild(li);
    
            li.querySelector('input').addEventListener('change', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });

            li.querySelector('.delete-task').addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks(filter);
            });
        });
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    addTaskButton.addEventListener('click', () => {
        const taskName = newTaskInput.value.trim();
        if (taskName) {
            tasks.push({ name: taskName, completed: false });
            saveTasks();
            renderTasks();
            newTaskInput.value = '';
        }
    });

    filters.forEach(button => {
        button.addEventListener('click', () => {
            filters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    renderTasks();
});
