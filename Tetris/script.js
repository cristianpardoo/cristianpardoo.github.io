// Menu Logic:

function updateSpeedIndicator(speedText) {
  document.getElementById('selected-speed').innerText = speedText;
}

const fastspeed = 80
const medspeed = 160
const slowspeed = 600


// Add event listeners for the game over screen buttons
const slowButton = document.getElementById('slow-button');
const mediumButton = document.getElementById('medium-button');
const fastButton = document.getElementById('fast-button');

// Update the speed indicator in each button event listener
slowButton.addEventListener('click', () => {
  curspeed = slowspeed;
  slowButton.classList.add('selected');
  mediumButton.classList.remove('selected');
  fastButton.classList.remove('selected');
  updateSpeedIndicator('Slow');
  // startGame();
  // showGameScreen();
});

mediumButton.addEventListener('click', () => {
  curspeed = medspeed;
  slowButton.classList.remove('selected');
  mediumButton.classList.add('selected');
  fastButton.classList.remove('selected');
  updateSpeedIndicator('Medium');
  // startGame();
  // showGameScreen();
});

fastButton.addEventListener('click', () => {
  curspeed = fastspeed;
  slowButton.classList.remove('selected');
  mediumButton.classList.remove('selected');
  fastButton.classList.add('selected');
  updateSpeedIndicator('Fast');
  // startGame();
  // showGameScreen();
});






// initialize variables
const canvas = document.getElementById("canvas");
const gameview = document.getElementById("game-screen");
const ctx = canvas.getContext("2d");
const blockSize = 20;
const boardWidth = canvas.width / blockSize;
const boardHeight = canvas.height / blockSize;
const colors = [
  "purple", "green", "yellow", "red", "cyan", "orange", "darkBlue"
];
// tetrominoes
const tetrominoes = [
  [[0, 1, 0], [1, 1, 1]],
  [[0, 2, 2], [2, 2, 0]],
  [[3, 3], [3, 3]],
  [[4, 4, 0], [0, 4, 4]],
  [[0,0,0,0], [5, 5, 5, 5]],
  [[0, 0, 6], [6, 6, 6]],
  [[7,0,0], [7,7,7]]
  ];
let board = [];
let score = 0;
let curspeed = 1000;

let currentTetromino = createTetromino();
let paused = false
let heldTetromino = null;
let canHold = true;
let isgameover = false;

// Add touch events for mobile users
const minTouchDistance = 50;
let touchStartX = null;
let touchStartY = null;
  window.addEventListener('touchstart', (evt) => {
  touchStartX = evt.touches[0].clientX;
  touchStartY = evt.touches[0].clientY;
  });

window.addEventListener('touchmove', (evt) => {
   if (!isgameover) {
    const touchEndX = evt.touches[0].clientX;
  const touchEndY = evt.touches[0].clientY;
  const touchDistanceX = touchEndX - touchStartX;
  const touchDistanceY = touchEndY - touchStartY;

  if (Math.abs(touchDistanceX) > Math.abs(touchDistanceY)) {
  // Horizontal swipe
  if (touchDistanceX > minTouchDistance) {
  moveRight();
  } else if (touchDistanceX < -minTouchDistance) {
  moveLeft();
  }
  } else {
  // Vertical swipe
  if (touchDistanceY > minTouchDistance) {
  moveDown();
  } else if (touchDistanceY < -minTouchDistance) {
  drop();
  }
  }
   }
  
});

// Button Listeners


  document.getElementById("rotate-clockwise").addEventListener("click", () => {
    rotate("clockwise");
  });

  document.getElementById("rotate-counterclockwise").addEventListener("click", () => {
    rotate("clockwise");
    rotate("clockwise");
    rotate("clockwise");


  });


  document.getElementById("move-left").addEventListener("click", moveLeft);
  document.getElementById("move-right").addEventListener("click", moveRight);
  document.getElementById("move-down").addEventListener("click", moveDown);
  document.getElementById("drop").addEventListener("click", drop);
  document.getElementById("hold-button").addEventListener("click", holdPiece);
  document.getElementById("pause-button").addEventListener("click", () => {
    paused = !paused;
    if (paused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Paused", canvas.width/2 - 45, canvas.height/2);
    } else {
      drawBoard();
  }
  });

//   document.getElementById("hold").addEventListener("click", holdPiece());





document.addEventListener("keydown", event => {

  if (!isgameover){
    if (event.code === "KeyA" || event.code === "ArrowLeft") { // A key or Left arrow key
      moveLeft();
  } 
  else if (event.code === "KeyD" || event.code === "ArrowRight") { // D key or Right arrow key
      moveRight();
  } 
  else if (event.code === "KeyS" || event.code === "ArrowDown") { // S key or Down arrow key
      moveDown();
  }
  else if (event.code === "KeyW" || event.code === "ArrowUp") { // W key or Up arrow key
      drop();
      moveDown();
  } 
  else if (event.code === "KeyL") {
      rotate("clockwise");
  } 
  else if (event.code === "KeyK") {
    rotate("clockwise");
    rotate("clockwise");
    rotate("clockwise");
    }
    else if (event.code === "KeyO") {
      holdPiece();
    }
  
  
    else if (event.code === "KeyP")
    if (event.code === "KeyP") {
    paused = !paused;
    if (paused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Paused", canvas.width/2 - 45, canvas.height/2);
    } else {
      drawBoard();
  }
  }}
    
  }
);

// current tetromino
updateScoreDisplay()
// create board
generateBoard()
drawGrid()
// Keypress Event Listener
generateNextTetromino();





// Add the startGame function
function startGame() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  gameInterval = setInterval(() => { // Modify the setInterval() call
    if (!paused) {
      moveDown();
    }
  }, curspeed);
}

// function gameOver() { // WORKING 
//   clearInterval(gameInterval); // Stop the game loop
//   ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   ctx.font = "30px Arial";
//   ctx.fillStyle = "white";
  
//   playGameOverSound();

//   // Gray out game screen
//   let gameScreen = document.getElementById("game-screen");
//   gameScreen.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // gray color with some transparency
//   gameScreen.style.pointerEvents = "none"; // disable any interaction
//     gameScreen.fillText("Game Over", canvas.width / 2 - 45, canvas.height / 2);

// }



// function playGameOverSound() {
//   var mp3 = document.createElement("audio");
//   mp3.setAttribute('src', 'gameover.mp3');
//   mp3.load();
//   document.documentElement.appendChild(mp3);
//   mp3.play();
//   // const gameOverSound = new Audio('gameover.aac');
//   // gameOverSound.play();
// }

function gameOver() {
  isgameover = true;


  playGameOverSound();

  // Gray out and blur game screen
  clearInterval(gameInterval); // Stop the game loop
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
 // gray color with some transparency
  
  //document.getElementById("game-over-screen").style.display = "none";

    // Gray out game screen
    let gameScreen = document.getElementById("game-screen");
    gameScreen.style.backgroundColor = "rgba(0, 0, 0, 20)"; // gray color with some transparency
    gameScreen.style.pointerEvents = "none"; // disable any interaction
    gameScreen.style.filter = "blur(5px)"; // add blur effect
    // Show game over screen
    let gameOverScreen = document.getElementById("game-over-screen");
  
    gameOverScreen.style.display = "flex";
  
}



function playGameOverSound() {
 Sound("gameover.mp3")
}


function Sound(filename) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Load the audio file
  const request = new XMLHttpRequest();
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    // Decode the audio data
    audioContext.decodeAudioData(request.response, function(buffer) {
      // Create a source node
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      // Connect the source node to the audio destination (e.g., speakers)
      source.connect(audioContext.destination);

      // Start playing the audio
      source.start(0);
    });
  };

  request.send();
}

// Add an event listener for the "start" button
document.getElementById("start-button").addEventListener("click", startGame);




// Board Visuals Logic
// Update drawBlock function to use the color parameter
function drawBlock(x, y, color, outlineColor) {
  ctx.fillStyle = color;
  ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

// draw board
function drawBoard() {
  drawGrid();
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      if (board[row][col]) {
        drawBlock(col, row, board[row][col], "black");
      }
    }
  }
}

// draw grid
function drawGrid(){
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      drawBlock(col, row, "white", "black");
    }
  }
}



// Tetrimino Logic
// draw next tetromino
function drawNextTetromino() {
  const canvas = document.getElementById("next-piece");
  const ctx = canvas.getContext("2d"); 
  const blockSize = 20;
  const width = canvas.width / blockSize;
  const height = canvas.height / blockSize;

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    nextTetromino.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
        if (value) {
          ctx.fillStyle = nextTetromino.color;
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            ctx.strokeStyle = "Grey";
            ctx.lineWidth = 2;
            ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
        });
    });
}
// create tetromino
function createTetromino() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  const tetromino = tetrominoes[index];
  const color = colors[index];
  const x = Math.floor((boardWidth - tetromino[0].length) / 2);
  const y = -tetromino.length;
  return { tetromino, color, x, y };
}
// generate next tetromino and draw on canvas
function generateNextTetromino() {
  nextTetromino = createTetromino();
  drawNextTetromino();
}
// Update drawTetromino function to use the currentTetromino.color
function drawTetromino() {
  currentTetromino.tetromino.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(
          currentTetromino.x + x,
          currentTetromino.y + y,
          currentTetromino.color,
          "grey"
        );
      }
    });
  });
}
// erase tetromino
function eraseTetromino() {
  currentTetromino.tetromino.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(currentTetromino.x + x, currentTetromino.y + y, "white", "black");
      }
    });
  });
}

function holdPiece() {
  if (canHold) {
    if (heldTetromino) {
      const tempTetromino = { ...currentTetromino };
      currentTetromino = heldTetromino;
      heldTetromino = tempTetromino;
    } else {
      heldTetromino = currentTetromino;
      currentTetromino = createTetromino();
    }
    drawHeldTetromino();
    canHold = false;
    drawBoard();
  }
}


function drawHeldTetromino() {
  const canvas = document.getElementById("held-piece");
  const ctx = canvas.getContext("2d");
  const blockSize = 20;
  const width = canvas.width / blockSize;
  const height = canvas.height / blockSize;

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (heldTetromino) {
    heldTetromino.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillStyle = heldTetromino.color;
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
          ctx.strokeStyle = "Grey";
          ctx.lineWidth = 2;
          ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      });
    });
  }
}



// FOR THE BOARD
// Update merge function to store tetromino color on the board
  function merge(tetromino, x, y) {
    for (let row = 0; row < tetromino.length; row++) {
      for (let col = 0; col < tetromino[row].length; col++) {
        if (tetromino[row][col]) {
          // console.log("row", row, "col", col, "x ", x," y ", y)
            if(y < 0){
              // console.log("row", row, "col", col, "x ", x," y ", y)
              gameOver()
            } 
              board[row + y][col + x] = currentTetromino.color;

        }
      }
    }
  }
  // check if Tetromino collides with blocks below
  function collides(tetromino, x, y) {

    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
          if (tetromino[row][col] &&
              ((board[row + y] && board[row + y][col + x]) !== undefined &&
              board[row + y][col + x] ||
              col + x < 0 ||
              col + x >= boardWidth ||
              row + y >= boardHeight)) 
              {
                return true;
          }
        }
    }
    return false;
  }
  // check if a row has been completed and
  function checkFullRows() {
  let rowCount = 0;
  for (let row = 0; row < boardHeight; row++) {
    if (board[row].every(value => value !== 0)) {
      board.splice(row, 1);
      board.unshift(new Array(boardWidth).fill(0));
      rowCount++;
    }
  }
  return rowCount;
}
  //Board initialization
  function generateBoard(){
  for (let row = 0; row < boardHeight; row++) {
    board[row] = [];
    for (let col = 0; col < boardWidth; col++) {
      board[row][col] = 0;
    }
  }
}



  // PIECE MOVEMENTS
  // Instantly move piece to lowest space on the grid
  // Piece moves down 1 block continuously until it collides with the board 
    function drop() {
      eraseTetromino();
      while (!collides(currentTetromino.tetromino, currentTetromino.x, currentTetromino.y + 1)) {
          currentTetromino.y++;
      }
      drawTetromino();
    }
    // Piece moves down 1 row
    function moveDown() {
              if (!collides(currentTetromino.tetromino, currentTetromino.x, currentTetromino.y + 1)) {
                  eraseTetromino();
                  currentTetromino.y++;
                  drawTetromino();
                

            } else {

                merge(currentTetromino.tetromino, currentTetromino.x, currentTetromino.y);
                const fullRows = checkFullRows();
                score += fullRows; // You can adjust the scoring system as desired
                updateScoreDisplay();
                currentTetromino = nextTetromino;
                canHold = true
  
                drawBoard();
                generateNextTetromino();
              }

            }
        

    // Piece moves Left
    function moveLeft() {
      if (!collides(currentTetromino.tetromino, currentTetromino.x - 1, currentTetromino.y)) {
        eraseTetromino();
        currentTetromino.x--;
        drawTetromino();
      }
    }
    // Piece moves Right
    function moveRight() {
      if (!collides(currentTetromino.tetromino, currentTetromino.x + 1, currentTetromino.y)) {
        eraseTetromino();
        currentTetromino.x++;
        drawTetromino();
      }
    }
    // Rotate piece
    function rotate(direction) {
      eraseTetromino();
      const oldTetromino = currentTetromino.tetromino;
      const newTetromino = [];

      for (let i = 0; i < oldTetromino[0].length; i++) {
        const newRow = [];
        for (let j = oldTetromino.length - 1; j >= 0; j--) {
          if (direction === 'clockwise') {
            newRow.push(oldTetromino[j][i]);
          } else {

          }
        }
        newTetromino.push(newRow);
      }

      if (!collides(newTetromino, currentTetromino.x, currentTetromino.y)) {
        currentTetromino.tetromino = newTetromino;
      }

      drawTetromino();
    }
  
// FOR ID = "SCORE"
// Update the score
function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.innerText = `Score: ${score}`;
}
  
// TOUCH DISPLAY functions
// start touch event
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}
// determine touch movement
function handleTouchMove(event) {
      if (!touchStartX || !touchStartY) {
          return;
      }

      const touchEndX = event.touches[0].clientX;
      const touchEndY = event.touches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
          if (Math.abs(diffX) > 50) {
          handleSwipe(diffX > 0 ? "left" : "right");
          }
      } else {
          if (Math.abs(diffY) > 50) {
          handleSwipe(diffY > 0 ? "up" : "down");
          }
      }

      touchStartX = null;
      touchStartY = null;
      event.preventDefault(); // Prevent scrolling while swiping on the game
  }
// select which function 
function handleSwipe(direction) {
switch (direction) {
    case "left":
    moveLeft();
    break;
    case "right":
    moveRight();
    break;
    case "up":
    drop();
    break;
    case "down":
    moveDown();
    break;
}
}

// BACKGROUND COLOR MODIFIER

function setBackgroundColor() {
  const currentTime = new Date().getTime();
  const randomSeed = (currentTime % 1000) / 1000;
  const hue = randomSeed * 360;
  const saturation = 50 + randomSeed * 30;
  const lightness = 50 + randomSeed * 10;

  document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

setBackgroundColor();
// End TOUCH DISPLAY functions

// DISABLE ZOOM
window.addEventListener('touchstart', function onFirstTouch() {
  // this will only run once
  window.removeEventListener('touchstart', onFirstTouch, false);

  let lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 250) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}, false);


    document.getElementById('start-button').addEventListener('click', function() {
      document.getElementById('welcome-screen').classList.add('hidden');
      document.getElementById('game-screen').classList.remove('hidden');
    });
