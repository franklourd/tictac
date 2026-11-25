const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const newMatchBtn = document.getElementById('newMatchBtn');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreDrawDisplay = document.getElementById('scoreDraw');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill("");
let scores = { X: 0, O: 0, draw: 0 };
let roundStarter = 'X';

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const cell = e.currentTarget;
  const index = Number(cell.dataset.index);
  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('filled');
  if (currentPlayer === 'O') cell.classList.add('o');
  cell.setAttribute('aria-label', `Cell ${index + 1}, ${currentPlayer}`);

  const winningLine = getWinningLine();
  if (winningLine) {
    scores[currentPlayer]++;
    updateScores();
    statusDisplay.innerHTML = `<span class="turn-mark ${currentPlayer === 'O' ? 'o' : ''}">${currentPlayer}</span><span>Player ${currentPlayer} wins!</span>`;
    winningLine.forEach(position => {
      const winningCell = board.querySelector(`[data-index="${position}"]`);
      winningCell.classList.add('winner');
      if (currentPlayer === 'O') winningCell.classList.add('o');
    });
    gameActive = false;
    resetBtn.textContent = 'Next round';
    return;
  }

  if (!gameState.includes("")) {
    scores.draw++;
    updateScores();
    statusDisplay.innerHTML = '<span class="turn-mark">=</span><span>It’s a draw!</span>';
    gameActive = false;
    resetBtn.textContent = 'Next round';
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurn();
}

function getWinningLine() {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return condition;
    }
  }
  return null;
}

function updateTurn() {
  statusDisplay.innerHTML = `<span class="turn-mark ${currentPlayer === 'O' ? 'o' : ''}">${currentPlayer}</span><span>Player ${currentPlayer} turn</span>`;
  playerXScore.classList.toggle('active', currentPlayer === 'X');
  playerOScore.classList.toggle('active', currentPlayer === 'O');
}

function updateScores() {
  scoreXDisplay.textContent = scores.X;
  scoreODisplay.textContent = scores.O;
  scoreDrawDisplay.textContent = scores.draw;
}

function startRound() {
  gameState = Array(9).fill("");
  roundStarter = roundStarter === 'X' ? 'O' : 'X';
  currentPlayer = roundStarter;
  gameActive = true;
  resetBtn.textContent = 'Restart round';
  createBoard();
  updateTurn();
}

function restartRound() {
  gameState = Array(9).fill("");
  currentPlayer = roundStarter;
  gameActive = true;
  resetBtn.textContent = 'Restart round';
  createBoard();
  updateTurn();
}

function startMatch() {
  scores = { X: 0, O: 0, draw: 0 };
  roundStarter = 'O';
  updateScores();
  startRound();
}

resetBtn.addEventListener('click', () => {
  if (gameActive) {
    restartRound();
  } else {
    startRound();
  }
});
newMatchBtn.addEventListener('click', startMatch);

createBoard();
