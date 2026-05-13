// Board
let board, context;
let boardWidth = 750;
let boardHeight = 250;

// Stato Gioco
let playerName = "";
let gameStarted = false;
let gameOver = false;
let score = 0;
let highScore = 0;

// Goku (Personaggio)
let dinoWidth = 70; 
let dinoHeight = 80;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;
let dino = { x: dinoX, y: dinoY, width: dinoWidth, height: dinoHeight };

// Terreno e Ostacoli
let trackImg;
let trackX = 0;
let trackWidth = 2400;

let cactusArray = [];
let cactus1Img, cactus2Img, cactus3Img;
let cactusHeight = 70;

// NUVOLE (Correzione qui)
let cloudImg;
let cloudArray = [];

// Reset
let resetImg;
let resetWidth = 60;
let resetHeight = 60;

// Fisica (Velocità progressiva)
let initialVelocityX = -8; 
let velocityX = initialVelocityX;
let velocityY = 0;
let gravity = 0.45;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Caricamento Asset
    dinoImg = new Image(); dinoImg.src = "./img/dino.png";
    trackImg = new Image(); trackImg.src = "./img/track.png";
    cactus1Img = new Image(); cactus1Img.src = "./img/cactus1.png";
    cactus2Img = new Image(); cactus2Img.src = "./img/cactus2.png";
    cactus3Img = new Image(); cactus3Img.src = "./img/cactus3.png";
    
    cloudImg = new Image(); 
    cloudImg.src = "./img/cloud.png"; // Assicurati che il percorso sia esatto

    resetImg = new Image(); resetImg.src = "./img/reset.png";

    // Play Button Logic
    document.getElementById("play-button").addEventListener("click", function() {
        playerName = document.getElementById("nickname").value || "Goku";
        document.getElementById("game-menu").style.display = "none";
        gameStarted = true;
        
        requestAnimationFrame(update);
        setInterval(placeCactus, 1000);
        setInterval(placeClouds, 2500); // Crea una nuvola ogni 2.5 secondi
    });

    document.addEventListener("keydown", handleInput);
    document.addEventListener("touchstart", function(e) {
        if (gameStarted) handleInput(e);
    }, {passive: false});
};

function handleInput(e) {
    if (e.type === "touchstart" && !gameOver) e.preventDefault();

    if (gameOver) {
        resetGame();
        return;
    }

    if (gameStarted) {
        if ((e.code == "Space" || e.code == "ArrowUp" || e.type === "touchstart") && dino.y == dinoY) {
            velocityY = -11;
        }
    }
}

function update() {
    if (!gameStarted) return;
    requestAnimationFrame(update);
    if (gameOver) {
        drawGameOver();
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // 1. Velocità
    velocityX = initialVelocityX - (Math.floor(score / 100) * 0.4); // Aumenta la velocità ogni 100 punti

    // 2. DISEGNO NUVOLE (Spostato qui per stare dietro a Goku e cactus)
    for (let i = 0; i < cloudArray.length; i++) {
        let cloud = cloudArray[i];
        cloud.x -= 2; // Le nuvole si muovono più lentamente del terreno
        context.drawImage(cloudImg, cloud.x, cloud.y, 100, 40);
    }
    // Rimuovi nuvole fuori schermo
    while (cloudArray.length > 0 && cloudArray[0].x < -100) {
        cloudArray.shift();
    }

    // 3. TERRENO
    trackX += velocityX;
    if (trackX <= -trackWidth / 2) trackX = 0;
    context.drawImage(trackImg, trackX, boardHeight - 20, trackWidth, 20);

    // 4. GOKU E NOME
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    context.fillStyle = "#888888";
    context.font = "14px Arial";
    context.textAlign = "center";
    context.fillText(playerName, dino.x + dino.width/2, dino.y - 10);

    // 5. OSTACOLI
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
        
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            if (score > highScore) highScore = score;
        }
    }

    // 6. SCORE
    score++;
    context.fillStyle = "#535353";
    context.font = "20px Courier New";
    context.textAlign = "left";
    let displayHI = highScore.toString().padStart(5, '0');
    let displayScore = score.toString().padStart(5, '0');
    context.fillText("HI " + displayHI + " " + displayScore, 20, 30);
}

function placeCactus() {
    if (gameOver || !gameStarted) return;
    let cactus = { img: null, x: boardWidth, y: boardHeight - cactusHeight, width: 0, height: cactusHeight };
    let r = Math.random();
    if (r > 0.9) { cactus.img = cactus3Img; cactus.width = 102; }
    else if (r > 0.7) { cactus.img = cactus2Img; cactus.width = 69; }
    else { cactus.img = cactus1Img; cactus.width = 34; }
    cactusArray.push(cactus);
    if (cactusArray.length > 5) cactusArray.shift();
}

function placeClouds() {
    if (gameOver || !gameStarted) return;
    // Aggiunge una nuvola a un'altezza casuale tra 20 e 100 pixel
    cloudArray.push({ 
        x: boardWidth, 
        y: 20 + Math.random() * 80 
    });
}

function detectCollision(a, b) {
    let pX = 12; let pY = 10;
    return a.x + pX < b.x + b.width - pX && a.x + a.width - pX > b.x + pX &&
           a.y + pY < b.y + b.height - pY && a.y + a.height - pY > b.y + pY;
}

function resetGame() {
    gameOver = false;
    score = 0;
    velocityX = initialVelocityX;
    cactusArray = [];
    cloudArray = []; // Svuota anche le nuvole al reset
    velocityY = 0;
    dino.y = dinoY;
}

function drawGameOver() {
    context.textAlign = "center";
    context.fillStyle = "#535353";
    context.font = "bold 30px 'Courier New'";
    context.fillText("G A M E  O V E R", boardWidth / 2, boardHeight / 2 - 40);
    if (resetImg.complete) {
        context.drawImage(resetImg, boardWidth / 2 - 30, boardHeight / 2 - 10, 60, 60);
    }
    context.font = "18px 'Courier New'";
    context.fillText("SCORE: " + score, boardWidth / 2, boardHeight / 2 + 85);
}