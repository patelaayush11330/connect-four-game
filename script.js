const ROWS = 6;
const COLS = 7;
let currentPlayer = "red";
let gameOver = false;
let board = [];

const boardDiv = document.getElementById("gameBoard");
const statusText = document.getElementById("status");

function createBoard() {
  board = [];
  boardDiv.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell", "empty");
      cell.dataset.row = r;
      cell.dataset.col = c;
      boardDiv.appendChild(cell);
      row.push(null);
    }
    board.push(row);
  }
  document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", handleMove);
  });
}

function handleMove(e) {
  if (gameOver) return;

  const col = +e.target.dataset.col;

  // Find lowest empty row in this column
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) {
      board[r][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${col}']`);
      cell.classList.remove("empty");
      cell.classList.add(currentPlayer);
      checkWinner(r, col);
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      if (!gameOver) {
        statusText.innerText = `Player ${currentPlayer === "red" ? 1 : 2}'s Turn (${currentPlayer})`;
      }
      return;
    }
  }
}

function checkWinner(r, c) {
  const directions = [
    [[0, 1], [0, -1]],  // horizontal
    [[1, 0], [-1, 0]],  // vertical
    [[1, 1], [-1, -1]], // diagonal /
    [[1, -1], [-1, 1]]  // diagonal \
  ];

  for (let direction of directions) {
    let count = 1;
    for (let [dr, dc] of direction) {
      let row = r + dr;
      let col = c + dc;
      while (row >= 0 && row < ROWS && col >= 0 && col < COLS && board[row][col] === currentPlayer) {
        count++;
        row += dr;
        col += dc;
      }
    }
    if (count >= 4) {
      statusText.innerText = `Player ${currentPlayer === "red" ? 1 : 2} Wins!`;
      gameOver = true;
      return;
    }
  }

  // Check for draw
  if (board.every(row => row.every(cell => cell !== null))) {
    statusText.innerText = "It's a Draw!";
    gameOver = true;
  }
}

function restartGame() {
  currentPlayer = "red";
  gameOver = false;
  statusText.innerText = "Player 1's Turn (Red)";
  createBoard();
}

createBoard();
