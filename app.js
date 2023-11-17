

const removeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M5.75 3V1.5h4.5V3h-4.5Zm-1.5 0V1a1 1 0 0 1 1-1h5.5a1 1 0 0 1 1 1v2h2.5a.75.75 0 0 1 0 1.5h-.365l-.743 9.653A2 2 0 0 1 11.148 16H4.852a2 2 0 0 1-1.994-1.847L2.115 4.5H1.75a.75.75 0 0 1 0-1.5h2.5Zm-.63 1.5h8.76l-.734 9.538a.5.5 0 0 1-.498.462H4.852a.5.5 0 0 1-.498-.462L3.62 4.5Z" clip-rule="evenodd"/></svg>`
const clearIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 1h6v8.5h6V23H3V9.5h6V1Zm2 2v8.5H5V14h14v-2.5h-6V3h-2Zm8 13H5v5h9v-3h2v3h3v-5Z"/></svg>`
const addTaskIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m16 2l5 5v14.008a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 21.008V2.992C3 2.444 3.445 2 3.993 2H16Zm-5 9H8v2h3v3h2v-3h3v-2h-3V8h-2v3Z"/></svg>`
// ELEMENTS
// Buttons
const expandBoardsButton = document.querySelector(".expand-boards");
const menuToggleButton = document.querySelector(".close-menu");
const addBoardButton = document.getElementById("add-board-button");
const addCardButton = document.querySelector(".add-card-button");
// Containers
const boardListWrapper = document.getElementById("board-list-wrapper");
const boardNameInput = document.querySelector("#add-board-input");
const cardNameInput = document.querySelector("#add-card-input");
const boardsList = document.getElementById("boards");
const cardsList = document.getElementById("cards-list");

// GLOBALS
let boards = [];
let currentBoard = null;
let sourceCardId = null

function toggleMenu() {
  boardListWrapper.classList.toggle("hidden")
  boardListWrapper.classList.toggle("boards-list-hidden");
  boardListWrapper.classList.toggle("boards-list");
}

function addBoardToTheList(event) {
  event.preventDefault()
  const boardName = boardNameInput.value.trim();
  if (boardName !== "") {
    boards.push({
      boardId: generateRandomId(),
      boardName: boardName,
      cards: [],
    });
  } else{
    showAlert("No Board Name", "You need to provide name for a Board", "danger")
  }
  clearInputField(boardNameInput);
  // updateBoardList
  updateBoardList();
}

function generateRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function updateBoardList() {
  boardsList.innerHTML = "";
  for (let i = 0; i < boards.length; i++) {
    let removeBoardButton = null
    if (i !== 0){
    removeBoardButton = document.createElement("button");
    removeBoardButton.classList.add("remove-board");
    removeBoardButton.setAttribute("board-id", boards[i].boardId);
    removeBoardButton.innerHTML = (`${removeIcon}`)
    removeBoardButton.addEventListener("click", (event) => {
        event.stopPropagation()
       
        // TARGETING TO SELECT FIRST BOARD AFTER REMOVING AVAILABLE ON LIST
        if(event.target.parentElement.parentElement.firstChild && boards.length > 1){
            event.target.parentElement.parentElement.firstChild.click()
        } else {
            currentBoard = null
            const currentHeader = document.getElementById("board-name-header");
            currentHeader.textContent = ""
            renderCardsForCurrentBoard();
        }


        const boardId = removeBoardButton.getAttribute("board-id");
        boards = boards.filter((board) => board.boardId !== boardId);
        updateBoardList()
    })
}


    const boardItem = document.createElement("div");
    boardItem.classList.add("board-name");
    boardItem.setAttribute("board-id", boards[i].boardId);

    const boardItemText = document.createElement("p");
    boardItemText.classList.add("board-name-text");
    boardItemText.textContent = boards[i].boardName
    boardItemText.dataset.boardName = boards[i].boardName
    


    boardItem.appendChild(boardItemText)
    if (i !== 0 && removeBoardButton){
    boardItem.appendChild(removeBoardButton)
    }
    boardsList.appendChild(boardItem);
  }
  addListenersForBoards();
}

function addListenersForBoards() {
  const boardNames = boardsList.querySelectorAll(".board-name");
  boardNames.forEach((previousBoard) => {
    previousBoard.addEventListener("click", (event) => {
      currentBoard = boards.find(
        (board) => board.boardId === previousBoard.getAttribute("board-id")
      );
      renderHeaderForCurrentBoard();
      renderCardsForCurrentBoard();
      toggleMenu()
      // RENDER TASKS FOR ALL CARDS
      currentBoard.cards.forEach((card) => {
        renderTasksForCard(card);
      });
    });
  });
}

function renderHeaderForCurrentBoard() {
  const currentHeader = document.getElementById("board-name-header");
  currentHeader.textContent = `Current Board: ${currentBoard.boardName}`
}

function showAlert(title, description, severity){
    const toast = document.querySelector(".toast-hidden")
    toast.classList.toggle("toast-hidden")
    toast.classList.toggle("toast")

    document.querySelector(".toast-title").innerText = title
    document.querySelector(".toast-description").innerText = description


    switch(severity){
        case "danger": {
            toast.classList.remove("green")
            toast.classList.add("red")
            break;
        }
        case "success": {
            toast.classList.remove("red")
            toast.classList.toggle("green")
            break;
        }
    }

    setTimeout(()=>{
        toast.classList.toggle("toast-hidden")
        toast.classList.toggle("toast")
    }, 5000)
}

function addCardForCurrentBoard(event) {
  event.preventDefault()
  const cardName = cardNameInput.value.trim();
  if (cardName !== "") {
    currentBoard.cards.push({
      cardId: generateRandomId(),
      cardName: cardName,
      tasks: [],
    });
    clearInputField(cardNameInput);
  } else{
    showAlert("No card Name", "please provide card Name", "danger")
  }
  renderCardsForCurrentBoard();
  // Render tasks once more after adding new card
  currentBoard.cards.forEach((card) => {
    renderTasksForCard(card);
  });
}

function renderCardsForCurrentBoard() {
  cardsList.innerHTML = "";
  if (!currentBoard) {
    renderHtmlIfNoBoard(cardsList);
  } else {
    const addCard = document.querySelector(".add-card");
    addCard.classList.remove("hidden");
    currentBoard.cards.forEach((card) => {
      const cardItem = createCardElement(card);
      cardsList.appendChild(cardItem);
    });
  }
  addListenersForAddTaskButton();
}

function renderHtmlIfNoBoard(cardsList) {
  const noBoardSelected = document.createElement("div");
  const addCard = document.querySelector(".add-card");
  addCard.classList.add("hidden");
  // Appending div if no cards available
  noBoardSelected.classList.add("no-board-selected");
  noBoardSelected.innerText = "No Board Selected";
  cardsList.appendChild(noBoardSelected);
  return;
}

function createCardElement(card) {
  const cardItem = document.createElement("div");
  cardItem.classList.add("card");
  cardItem.setAttribute("card-id", card.cardId);
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  cardHeader.setAttribute("card-header-id", card.cardId);
  const cardTitle = document.createElement("p");
  cardTitle.classList.add("card-title");
  cardTitle.setAttribute("card-title-id", card.cardId);
  cardTitle.dataset.title = card.cardName
  cardTitle.innerText = card.cardName;
  const cardOptions = document.createElement("button");
  cardOptions.classList.add("card-option");
  cardOptions.setAttribute("card-option-id", card.cardId);
  cardOptions.innerText = "Options";

  cardOptions.addEventListener("click", (event)=>{
    showCardOptions(event, card.cardId)
  })


  cardHeader.appendChild(cardTitle);
  cardHeader.appendChild(cardOptions);
  cardItem.appendChild(cardHeader);
  const cardTasks = document.createElement("div");
  cardTasks.classList.add("tasks-wrapper");
  cardTasks.setAttribute("card-tasks-wrapper-id", card.cardId);
  const tasksList = document.createElement("div");
  tasksList.classList.add("tasks-list");
  tasksList.setAttribute("card-tasks-list-id", card.cardId);



  // Add event listeners to allow drag and drop 
  tasksList.addEventListener("dragover", (event)=>{allowDrop(event)})
  tasksList.addEventListener("drop", (event)=>{drop(event)})



  const formAddTaskWrapper = document.createElement("form")
  formAddTaskWrapper.classList.add("form-add-task")


  const addTaskInput = document.createElement("input");
  addTaskInput.classList.add("add-input");
  addTaskInput.setAttribute("add-task-input-id", card.cardId);
  addTaskInput.setAttribute("placeholder", "Type your task name");
  const addTaskButton = document.createElement("button");
  addTaskButton.classList.add("add-task");
  addTaskButton.setAttribute("add-task-button-id", card.cardId);
  addTaskButton.innerHTML = `${addTaskIcon}`;
  addTaskButton.type = "submit"

  
  cardTasks.appendChild(tasksList);
  formAddTaskWrapper.appendChild(addTaskInput)
  formAddTaskWrapper.appendChild(addTaskButton)

  // cardTasks.appendChild(addTaskInput);
  cardItem.appendChild(cardTasks);
  cardItem.appendChild(formAddTaskWrapper);
  return cardItem;
}

function clearInputField(inputField) {
  inputField.value = "";
}

function addListenersForAddTaskButton() {
  cardsList.querySelectorAll(".add-task").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault()
      addTaskToCard(event);
    });
  });
}

function showCardOptions(event, cardId){
  const clickedCard = event.target.parentElement
  const clickedButton = event.target
  const optionsCardList = document.createElement("div")
  optionsCardList.classList.add("options-card-list-wrapper")
  optionsCardList.setAttribute("options-card-list-wrapper-id", cardId)
  clickedButton.classList.add("hidden")


  optionsCardList.appendChild(createRemoveCardOptionButton(cardId))
  optionsCardList.appendChild(createClearCardOptionButton(cardId))
  optionsCardList.appendChild(createCancelCardOptionButton(cardId,clickedButton))


  clickedCard.appendChild(optionsCardList)
  // optionsCardList.setAttribute("options-card-list-id")
}



function createRemoveCardOptionButton(cardId){
    const removeCardOption = document.createElement("button")
    removeCardOption.innerHTML = `${removeIcon}`
    removeCardOption.setAttribute("remove-card-option-id", cardId)
    removeCardOption.classList.add("remove-card-button")

    removeCardOption.addEventListener("click", ()=>{
      currentBoard.cards = currentBoard.cards.filter((card) => card.cardId !== cardId)
      renderCardsForCurrentBoard();
      currentBoard.cards.forEach((card) => {
        renderTasksForCard(card);
      });
    })
    return removeCardOption
}

function createClearCardOptionButton(cardId){
  const clearCardOption = document.createElement("button")
  clearCardOption.innerHTML = (`${clearIcon}`)
  clearCardOption.setAttribute("clear-card-option-id", cardId)
  clearCardOption.classList.add("clear-card-button")

  clearCardOption.addEventListener("click", ()=>{
    const cardToRerender = currentBoard.cards.find((card) => card.cardId === cardId);
    cardToRerender.tasks = []
    renderTasksForCard(cardToRerender)
  })

  return clearCardOption
}

function createCancelCardOptionButton(cardId,buttonToShow){
  const cancelCardOption = document.createElement("button")
  cancelCardOption.innerText = "Cancel"
  cancelCardOption.setAttribute("cancel-card-option-id", cardId)
  cancelCardOption.classList.add("cancel-card-button")

  cancelCardOption.addEventListener("click", (event)=>{
    const divToRemove = document.querySelector(`[options-card-list-wrapper-id="${cardId}"]`)
    divToRemove.remove()
    buttonToShow.classList.remove("hidden")
  })
  return cancelCardOption
}



function addTaskToCard(event) {
  const inputElementFromCurrentCard = event.target.parentElement.querySelector(
    ".add-input"
  );
  const inputElementValue = inputElementFromCurrentCard.value.trim();
  if (inputElementValue.length === 0) {
    showAlert("Task Name", "please provide a task Name", "danger")
    return;
  }
  const clickedButton = event.target;
  const clickedButtonId = clickedButton.getAttribute("add-task-button-id");
  const cardForCurrentTask = currentBoard.cards.find(
    (card) => card.cardId === clickedButtonId
  );
  cardForCurrentTask.tasks.push({
    taskId: generateRandomId(),
    taskName: inputElementValue,
  });
  renderTasksForCard(cardForCurrentTask);
  clearInputField(inputElementFromCurrentCard);
}

function renderTasksForCard(card) {
  const tasksList = document.querySelector(
    `[card-tasks-list-id="${card.cardId}"]`
  );
  tasksList.innerHTML = "";
  // RENDER SOME INFO ELEMENT IF CARD DOESNT HAVE TASKS YET
  if (card.tasks.length === 0) {
    const noTasksElement = document.createElement("p");
    noTasksElement.innerText = "No tasks";
    tasksList.appendChild(noTasksElement);
    return;
  }
  card.tasks.forEach((task) => {
    tasksList.appendChild(createTaskElement(task, card));
  });
}

function createTaskElement(task, card) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.setAttribute("task-element-id", task.taskId);
  taskElement.setAttribute("draggable", true)
  const taskTitle = document.createElement("p");
  taskTitle.textContent = task.taskName;
  taskTitle.classList.add("task-title");
  taskTitle.setAttribute("task-title-id", task.taskId);


  const taskOptionsWrapper = document.createElement("div");
  taskOptionsWrapper.classList.add("task-options-wrapper");
  taskOptionsWrapper.setAttribute("task-options-wrapper-id", task.taskId);
    
    // TODO ADD EVENT LISTENERS HERE FOR EDITING
    // const editTaskButton = document.createElement("button");
    // editTaskButton.textContent = "edit";
    // editTaskButton.classList.add("edit-task-button");
    // editTaskButton.setAttribute("edit-task-button-id", task.taskId);
    


    const removeTaskButton = document.createElement("button")
    removeTaskButton.textContent = "X"
    removeTaskButton.classList.add("remove-task-button")
    removeTaskButton.setAttribute("remove-task-button-id", task.taskId) 


    // listeners for buttons
    removeTaskButton.addEventListener("click", (event)=>{
        removeTask(event, card, task)
        renderTasksForCard(card)
    })


    // APPENDING ELEMENTS IN CORRECT ORDER
    // taskOptionsWrapper.appendChild(editTaskButton)
    taskOptionsWrapper.appendChild(removeTaskButton)
    
    taskElement.appendChild(taskTitle)
    taskElement.appendChild(taskOptionsWrapper)


    // Listener that allows task being dragged
    taskElement.addEventListener("dragstart", (event)=>{
      sourceCardId = event.target.parentElement.getAttribute("card-tasks-list-id")
      drag(event)
      setTimeout(()=>taskElement.classList.add("dragging"),0)
    })
    taskElement.addEventListener("dragend", (event)=>{
      taskElement.classList.remove("dragging")
    })


    return taskElement
}

    function removeTask(event, cardToRemove, taskToRemove){
        cardToRemove.tasks = cardToRemove.tasks.filter((task) => task.taskId !== taskToRemove.taskId)
    }




    // DRAGABLE
    function allowDrop(event) {
      event.preventDefault();

      const bottomTask = insertAboveTask(event.target, event.clientY)
      const curTask = document.querySelector(".dragging")



      if(!bottomTask && event.target.classList.contains("tasks-list")){
        event.target.appendChild(curTask)
      } else if(bottomTask && event.target.classList.contains("tasks-list")){
        event.target.insertBefore(curTask, bottomTask)
      }

      const draggedIntoCardId = curTask.parentElement.getAttribute("card-tasks-list-id")
      // if(cardWithNewTask.tasks.some(task => task.taskId === curTask.getAttribute("task-element-id"))){
      //   return 
      // }else{
      //   cardWithNewTask.task.s
      // }

    }

    function insertAboveTask(zone, mouseY){
      const els = zone.querySelectorAll(".task:not(.dragging)")
      let closestTask = null
      let closestTaskOffset = Number.NEGATIVE_INFINITY

      els.forEach((task)=>{
          const {top} = task.getBoundingClientRect()
          const offset = mouseY - top
          if(offset < 0 && offset > closestTaskOffset){
            closestTask = task
            closestTaskOffset = offset
          }
      })
      return closestTask
    }

    function drag(event) {
      event.dataTransfer.setData("todo-item", event.target.getAttribute("task-element-id"));
      event.dataTransfer.setData("source-card", event.target.parentElement.getAttribute("card-tasks-list-id"));
    }


    function drop(event){
      event.preventDefault();
      const taskId = event.dataTransfer.getData("todo-item");
      // const targetBoardId = event.target.getAttribute("board-id");
      let targetCardId = event.target.getAttribute("card-tasks-list-id");
      if(!targetCardId){
        targetCardId = event.target.parentElement.getAttribute("card-tasks-list-id")
      }
    
      const sourceBoard = boards.find((board) =>
        board.cards.some((card) => card.cardId === sourceCardId)
      );



    
      const sourceCard = sourceBoard.cards.find(
        (card) => card.cardId === sourceCardId
      );
      const targetCard = currentBoard.cards.find(
        (card) => card.cardId === targetCardId
      );
    
      const task = sourceCard.tasks.find((task) => task.taskId === taskId);
    
      // Remove task from source card
      sourceCard.tasks = sourceCard.tasks.filter(
        (task) => task.taskId !== taskId
      );
    
      // Add task to target card
      targetCard.tasks.push(task);
    
      // Re-render both cards
      renderTasksForCard(sourceCard);
      renderTasksForCard(targetCard);
    }
    



// EVENT LISTENERS 
expandBoardsButton.addEventListener("click", toggleMenu)
menuToggleButton.addEventListener("click", toggleMenu)
addBoardButton.addEventListener("click", (event)=>{addBoardToTheList(event)})
addCardButton.addEventListener("click", (event)=>{
  addCardForCurrentBoard(event)
})
addListenersForBoards()



// Init
renderCardsForCurrentBoard()