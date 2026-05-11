// Board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

// Cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img, cactus2Img, cactus3Img;

// Physics
let velocityX = -8; 
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Caricamento immagini
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";
    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";
    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); 
    document.addEventListener("keydown", moveDino);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        drawGameOver();
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Dino physics
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Cactus movement and collision
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
        }
    }

    // Score: incrementa solo se il gioco è attivo
    context.fillStyle = "black";
    context.font = "20px Courier New";
    score++; 
    context.fillText("Score: " + score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "Enter") {
            resetGame();
        }
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) return;

    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let chance = Math.random();
    if (chance > .90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    } else if (chance > .70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    }

    cactusArray.push(cactus);
    if (cactusArray.length > 5) cactusArray.shift();
}

function detectCollision(a, b) {
    // Più alzi questi numeri, più "piccolo" diventa il punto d'urto
    let paddingX = 15; // Toglie 15px dai lati
    let paddingY = 10; // Toglie 10px da sopra e sotto

    return a.x + paddingX < b.x + b.width - paddingX &&
           a.x + a.width - paddingX > b.x + paddingX &&
           a.y + paddingY < b.y + b.height - paddingY &&
           a.y + a.height - paddingY > b.y + paddingY;
}

function resetGame() {
    gameOver = false;
    score = 0;
    cactusArray = [];
    velocityY = 0;
    dino.y = dinoY;
    dinoImg.src = "./img/dino.png";
}

function drawGameOver() {
    // Sfondo: il quarto parametro (0.0) indica la trasparenza totale.
    // Se vuoi un velo leggerissimo, usa 0.1 o 0.2 invece di 0.4.
    context.fillStyle = "rgba(0, 0, 0, 0)"; 
    context.fillRect(0, 0, boardWidth, boardHeight);

    // Scritta GAME OVER
    context.fillStyle = "black"; // Cambiato in nero perché lo sfondo ora è chiaro
    context.font = "bold 48px Courier New";
    context.textAlign = "center";
    context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 20);

    // Punteggio finale
    context.font = "20px Courier New";
    context.fillText("Punteggio: " + score, boardWidth / 2, boardHeight / 2 + 15);

    // Istruzione per ricominciare
    context.font = "16px Courier New";
    context.fillStyle = "red"; // Colore acceso per attirare l'attenzione
    context.fillText("Premi SPAZIO per ricominciare", boardWidth / 2, boardHeight / 2 + 45);

    context.textAlign = "left"; // Reset allineamento
    
}