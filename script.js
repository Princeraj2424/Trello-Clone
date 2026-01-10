let draggedCard=null;
let draggedCardSourceColumn=null;
let rightClickedCard = null;


function addTask(columnId){
    const input = document.getElementById(`${columnId.toLowerCase()}-input`);
    const taskText = input.value.trim();

    if (taskText===""){
        return;
    }
    const testDate = new Date().toLocaleString();
    const taskElement = createTaskElement(taskText, testDate);
    document.getElementById(`${columnId.toLowerCase()}-tasks`).appendChild(taskElement);
    input.value="";
    updateTaskCount(columnId.toLowerCase());
    saveToLocalStorage(columnId, taskText, testDate);

}

function createTaskElement(taskText, testDate){
    const taskElement = document.createElement("div");
    taskElement.innerHTML=`<span>${taskText}</span><br><small class="time">${testDate}</small>`;
    taskElement.classList.add("card");
   // taskElement.setAttribute("draggable",true);
    taskElement.draggable=true;
    taskElement.addEventListener("dragstart", dragStart);
    taskElement.addEventListener("dragend",dragEnd);
    taskElement.addEventListener("contextmenu", function(event){
        rightClickedCard = this;
        event.preventDefault();
        showContextMenu(event.pageX, event.pageY);

    })
    return taskElement;

}

function dragStart(){
    this.classList.add("dragging");
    draggedCard=this;
    draggedCardSourceColumn = this.parentElement.id.replace("-tasks","");

}

function dragEnd(){
    this.classList.remove("dragging");
    if (draggedCardSourceColumn) {
        updateTaskCount(draggedCardSourceColumn);
    }
    const currentColumn = draggedCard ? draggedCard.parentElement.id.replace("-tasks","") : null;
    if (currentColumn && currentColumn !== draggedCardSourceColumn) {
        updateTaskCount(currentColumn);
    }
    draggedCard = null;
    draggedCardSourceColumn = null;
    updateLocalStorage();
}
const columns = document.querySelectorAll(".column .tasks" );
columns.forEach((column) => {
    column.addEventListener("dragover", dragOver);


});


function dragOver(event){
    event.preventDefault();
    const afterElements = getDragAfterElement(this, event.pageY);
    if (afterElements===null){
        this.appendChild(draggedCard);
    }else{
        this.insertBefore(draggedCard, afterElements);
    }
}

function getDragAfterElement(container, y){
    const draggbleElements = [...container.querySelectorAll(".card:not(.dragging)")];
    let closestElementUnderMouse = {offset: Number.NEGATIVE_INFINITY};
    
    const result = draggbleElements.reduce((closestElementUnderMouse, currentTask)=>{
        const box = currentTask.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closestElementUnderMouse.offset){
            return {offset: offset, element: currentTask};
        }else{
            return closestElementUnderMouse;
        }
    }, closestElementUnderMouse);
    
    return result.element;
}




const contextMenuElement = document.querySelector(".context-menu");

function showContextMenu(x,y){
    contextMenuElement.style.top = `${y}px`;
    contextMenuElement.style.left = `${x}px`;
    contextMenuElement.style.display = "block";
}

document.addEventListener("click",()=>{
    contextMenuElement.style.display ="none";
})

function editTask(){
    const oldSpan = rightClickedCard.querySelector("span");
    const newTaskText = prompt("Edit task:", oldSpan.textContent);
    if (rightClickedCard!==null){

        if (newTaskText!==""){
            
            oldSpan.textContent = newTaskText;

       }
        rightClickedCard=null;

       updateLocalStorage();
    }

}
function deleteTask(){
    if (rightClickedCard!==null){
        const columnId = rightClickedCard.parentElement.id.replace("-tasks","");
        rightClickedCard.remove();
        rightClickedCard=null;
        updateTaskCount(columnId);

    }
    updateLocalStorage();
}
function updateTaskCount(columnId){
    const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
    document.getElementById(`${columnId}-count`).textContent = count;


}
function saveToLocalStorage(columnId, taskText, testDate){
    const task =JSON.parse(localStorage.getItem(columnId))||[];
    task.push({test: taskText, Date: testDate});
    localStorage.setItem(columnId, JSON.stringify(task));
}
function loadFromLocalStorage(){
    ["todo", "doing", "done"].forEach((columnId)=>{
        const tasks = JSON.parse(localStorage.getItem(columnId))||[];
        tasks.forEach(({test, Date})=>{
            const taskElement =createTaskElement(test, Date);
            document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
            updateTaskCount(columnId);
        })
    })
}
function updateLocalStorage(){
    ["todo", "doing", "done"].forEach((columnId)=>{
        const tasks = [];

    document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card)=>{
        const taskText = card.querySelector("span").textContent;
        const testDate = card.querySelector("small").textContent;
        tasks.push({test: taskText,Date: testDate});
    });
    localStorage.setItem(columnId, JSON.stringify(tasks));
    });
}
loadFromLocalStorage();






