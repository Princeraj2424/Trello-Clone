let draggedCard=null;
function addTask(columnId){
    const input = document.getElementById(`${columnId.toLowerCase()}-input`);
    const taskText = input.value.trim();

    if (taskText===""){
        return;
    }


    const taskElement = createTaskElement(taskText);
    document.getElementById(`${columnId.toLowerCase()}-tasks`).appendChild(taskElement);
    input.value="";
}

function createTaskElement(taskText){
    const taskElement = document.createElement("div");
    taskElement.textContent=taskText;
    taskElement.classList.add("card");
   // taskElement.setAttribute("draggable",true);
    taskElement.draggable=true;
    taskElement.addEventListener("dragstart", dragStart);
    taskElement.addEventListener("dragend",dragEnd);
    return taskElement;

}

function dragStart(){
    this.classList.add("dragging");
    draggedCard=this;

}

function dragEnd(){
    this.classList.remove("dragging");
    draggedCard = null;
}
const column = document.querySelectorAll(".column .tasks" );
column.forEach((column =>{
    column.addEventListener("dragover", dragOver);
}));


function dragOver(event){
    event.preventDefault();
    this.appendChild(draggedCard);
}



