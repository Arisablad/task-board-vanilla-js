// ELEMENTS

// Buttons
const expandBoardsButton = document.querySelector(".expand-boards");
const menuToggleButton = document.querySelector(".close-menu")
const addBoardButton = document.getElementById("add-board-button");
const addCardButton = document.querySelector(".add-card-button");
// Containers
const boardListWrapper = document.getElementById("board-list-wrapper");




// GLOBALS
let boards = []
let currentBoard = null



function toggleMenu() {
        if(boardListWrapper.classList.contains("boards-list-hidden"))
        {
        boardListWrapper.classList.remove("boards-list-hidden");
        boardListWrapper.classList.add("boards-list")
        }
    
        else{
        boardListWrapper.classList.remove("boards-list")
        boardListWrapper.classList.add("boards-list-hidden");
        }
}

function addBoardToTheList(){
    const boardNameInput = document.querySelector("#add-board-input");
    const boardName = boardNameInput.value.trim();
    if(boardName !==""){
        boards.push({
            boardId: generateRandomId(),
            boardName:  boardName,
            cards: []
    })
    }
    // Clear input field
    boardNameInput.value = "";

    // updateBoardList
    updateBoardList()
}

function generateRandomId(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


function updateBoardList(){
    const boardsList = document.getElementById("boards");
    boardsList.innerHTML = "";
    
    for(let i = 0; i < boards.length; i++){
        const boardItem = document.createElement("div")
        boardItem.classList.add("board-name")
        boardItem.setAttribute("board-id", boards[i].boardId)
        boardItem.innerText = boards[i].boardName
        boardsList.appendChild(boardItem)
    }
    addListenersForBoards()
}


function addListenersForBoards(){
const boardNames = document.querySelectorAll(".board-name");
boardNames.forEach(previousBoard => {
    previousBoard.addEventListener("click", () => {
        currentBoard = boards.find(board => board.boardId === previousBoard.getAttribute("board-id"))
        renderHeaderForCurrentBoard()
        renderCardsForCurrentBoard()
    })
})
}


function renderHeaderForCurrentBoard(){
    const currentHeader = document.getElementById("board-name-header");
    currentHeader.textContent = currentBoard.boardName;
}


function addCardForCurrentBoard(){
    const cardNameInput = document.querySelector("#add-card-input");
    const cardName = cardNameInput.value.trim();
    if(cardName !==""){
        currentBoard.cards.push({
            cardId: generateRandomId(),
            cardName: cardName,
            tasks: []
        })
    // Clear input field
    cardNameInput.value = "";
    }
    renderCardsForCurrentBoard()
}


function renderCardsForCurrentBoard(){
    const cardsList = document.getElementById("cards-list");
    cardsList.innerHTML = "";
  
    currentBoard.cards.forEach((card) => {
      const cardItem = createCardElement(card);
      cardsList.appendChild(cardItem);
    });
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




// EVENT LISTENERS 
expandBoardsButton.addEventListener("click", toggleMenu)
menuToggleButton.addEventListener("click", toggleMenu)
addBoardButton.addEventListener("click", addBoardToTheList)
addCardButton.addEventListener("click", addCardForCurrentBoard)
addListenersForBoards()
