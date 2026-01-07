document.querySelectorAll('.add-task').forEach((button, index) => {
    const columns = ['todo', 'doing', 'done'];
    const columnId = columns[index];
    
    button.addEventListener('click', () => {
        const input = document.getElementById(`${columnId}-input`);
        const tasksContainer = document.getElementById(`${columnId}-tasks`);
        
        if (input.value.trim() === '') return;
        
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.textContent = input.value;
        taskEl.draggable = true;
        
        tasksContainer.appendChild(taskEl);
        input.value = '';
    });
});