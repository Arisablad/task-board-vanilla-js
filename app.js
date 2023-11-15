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

function toggleMenu() {
  boardListWrapper.classList.toggle("boards-list-hidden");
  boardListWrapper.classList.toggle("boards-list");
}

function addBoardToTheList() {
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
    removeBoardButton.innerText = "X";
    removeBoardButton.addEventListener("click", (event) => {
        event.stopPropagation()
       
        // TARGETING TO SELECT FIRST BOARD AFTER REMOVING AVAILABLE ON LIST
        if(event.target.parentElement.parentElement.firstChild && boards.length > 1){
            console.log("exist")
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
        console.log("clicked" )
      currentBoard = boards.find(
        (board) => board.boardId === previousBoard.getAttribute("board-id")
      );
      renderHeaderForCurrentBoard();
      renderCardsForCurrentBoard();
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
            toast.classList.toggle("red")
            
        }
        case "success": {
            toast.classList.toggle("green")
            break
        }
    }

    setTimeout(()=>{
        toast.classList.toggle("toast-hidden")
        toast.classList.toggle("toast")
    }, 5000)
}

function addCardForCurrentBoard() {
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
  cardHeader.appendChild(cardTitle);
  cardHeader.appendChild(cardOptions);
  cardItem.appendChild(cardHeader);
  const cardTasks = document.createElement("div");
  cardTasks.classList.add("tasks-wrapper");
  cardTasks.setAttribute("card-tasks-wrapper-id", card.cardId);
  const tasksList = document.createElement("div");
  tasksList.classList.add("tasks-list");
  tasksList.setAttribute("card-tasks-list-id", card.cardId);
  const addTaskInput = document.createElement("input");
  addTaskInput.classList.add("add-input");
  addTaskInput.setAttribute("add-task-input-id", card.cardId);
  addTaskInput.setAttribute("placeholder", "add-task");
  const addTaskButton = document.createElement("button");
  addTaskButton.classList.add("add-task");
  addTaskButton.setAttribute("add-task-button-id", card.cardId);
  addTaskButton.innerText = "Add Task";
  cardTasks.appendChild(tasksList);
  cardTasks.appendChild(addTaskInput);
  cardTasks.appendChild(addTaskButton);
  cardItem.appendChild(cardTasks);
  return cardItem;
}

function clearInputField(inputField) {
  inputField.value = "";
}

function addListenersForAddTaskButton() {
  cardsList.querySelectorAll(".add-task").forEach((button) => {
    button.addEventListener("click", (event) => {
      addTaskToCard(event);
    });
  });
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
  const taskTitle = document.createElement("p");
  taskTitle.textContent = task.taskName;
  taskTitle.classList.add("task-title");
  taskTitle.setAttribute("task-title-id", task.taskId);


  const taskOptionsWrapper = document.createElement("div");
  taskOptionsWrapper.classList.add("task-options-wrapper");
  taskOptionsWrapper.setAttribute("task-options-wrapper-id", task.taskId);
    
    // TODO ADD EVENT LISTENERS HERE FOR EDITING
    const editTaskButton = document.createElement("button");
    editTaskButton.textContent = "edit";
    editTaskButton.classList.add("edit-task-button");
    editTaskButton.setAttribute("edit-task-button-id", task.taskId);
    


    const removeTaskButton = document.createElement("button")
    removeTaskButton.textContent = "remove"
    removeTaskButton.classList.add("remove-task-button")
    removeTaskButton.setAttribute("remove-task-button-id", task.taskId) 


    // listeners for buttons
    removeTaskButton.addEventListener("click", (event)=>{
        removeTask(event, card, task)
        renderTasksForCard(card)
    })



    // APPENDING ELEMENTS IN CORRECT ORDER
    taskOptionsWrapper.appendChild(editTaskButton)
    taskOptionsWrapper.appendChild(removeTaskButton)
    
    taskElement.appendChild(taskTitle)
    taskElement.appendChild(taskOptionsWrapper)

    return taskElement
}

    function removeTask(event, cardToRemove, taskToRemove){
        cardToRemove.tasks = cardToRemove.tasks.filter((task) => task.taskId !== taskToRemove.taskId)
    }




// EVENT LISTENERS 
expandBoardsButton.addEventListener("click", toggleMenu)
menuToggleButton.addEventListener("click", toggleMenu)
addBoardButton.addEventListener("click", addBoardToTheList)
addCardButton.addEventListener("click", addCardForCurrentBoard)
addListenersForBoards()



// Init
renderCardsForCurrentBoard()