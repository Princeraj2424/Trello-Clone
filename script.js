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
}
const columns = document.querySelectorAll(".column .tasks" );
columns.forEach((column) => {
    column.addEventListener("dragover", dragOver);


});


function dragOver(event){
    event.preventDefault();
    this.appendChild(draggedCard);
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
    const newTaskText =prompt("Edit task-", rightClickedCard.textContent);
    if (rightClickedCard!==null){
        rightClickedCard.textContent=newTaskText;
        if (newTaskText!==""){
            rightClickedCard.textContent= newTaskText;
        }
    }


}
function deleteTask(){
    if (rightClickedCard!==null){
        const columnId = rightClickedCard.parentElement.id.replace("-tasks","");
        rightClickedCard.remove();
        rightClickedCard=null;
        updateTaskCount(columnId);

    }
}
function updateTaskCount(columnId){
    const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
    document.getElementById(`${columnId}-count`).textContent = count;


}






