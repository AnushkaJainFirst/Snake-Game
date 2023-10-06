let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let start = true;

function startGame() {
    let boardWidth = 1000;
    let boardHeight = 600;
    let cellSize = 50;

    let snakeCells = [[0, 0]];
    let foodCells = generateRandomFoodCell();

    let gameOver = false;
    let direction = "right";
    let score = 0;

    //sounds
    const foodSound = new Audio("./music/food.mp3");
    const gameOverSound = new Audio("./music/gameover.mp3");
    const moveSound = new Audio("./music/move.mp3");
    const musicSound = new Audio("./music/music.mp3");
    function sound(e) {
        moveSound.play();
        if (e.key === "ArrowLeft") {
            direction = "left";
        } else if (e.key === "ArrowDown") {
            direction = "down";
        } else if (e.key === "ArrowUp") {
            direction = "up";
        } else if (e.key === "ArrowRight") {
            direction = "right";
        }
    }
    document.addEventListener("keydown", sound);


    function draw() {
        if (gameOver === true) {
            clearInterval(intervalID);
            document.removeEventListener("keydown", sound)
            musicSound.pause();
            gameOverSound.play();
            ctx.fillStyle = "red";
            ctx.font = "50px sans-serif";
            ctx.fillText("Game Over!!", 200, 200);
            ctx.fillText("Press ENTER key to restart the game", 100, 400);
            start = true;
            return;
        }

        //To clear canvas
        ctx.clearRect(0, 0, boardWidth, boardHeight);

        // draw snake
        for (let item of snakeCells) {
            if (item === snakeCells[snakeCells.length - 1]) {
                ctx.fillStyle = "orange";
                ctx.fillRect(item[0], item[1], cellSize, cellSize);
                ctx.strokeStyle = "golden";
                ctx.strokeRect(item[0], item[1], cellSize, cellSize);
            } else {
                ctx.fillStyle = "brown";
                ctx.fillRect(item[0], item[1], cellSize, cellSize);
                ctx.strokeStyle = "golden";
                ctx.strokeRect(item[0], item[1], cellSize, cellSize);
            }
        }

        //draw food
        ctx.fillStyle = "yellow";
        ctx.fillRect(foodCells[0], foodCells[1], cellSize, cellSize);

        //draw score
        ctx.fillStyle = "aquamarine";
        ctx.font = "22px cursive";
        ctx.fillText(`Score: ${score}`, 30, 30);
    }


    function update() {
        let headX = snakeCells[snakeCells.length - 1][0];
        let headY = snakeCells[snakeCells.length - 1][1];

        let newHeadX;
        let newHeadY;
        //acc to direction
        if (direction === "left") {
            newHeadX = headX - cellSize;
            newHeadY = headY;
            if (newHeadX < 0 || checkMate(newHeadX, newHeadY)) gameOver = true;
        } else if (direction === "up") {
            newHeadX = headX;
            newHeadY = headY - cellSize;
            if (newHeadY < 0 || checkMate(newHeadX, newHeadY)) gameOver = true;
        } else if (direction === "down") {
            newHeadX = headX;
            newHeadY = headY + cellSize;
            if (newHeadY === boardHeight || checkMate(newHeadX, newHeadY))
                gameOver = true;
        } else if (direction === "right") {
            newHeadX = headX + cellSize;
            newHeadY = headY;
            if (newHeadX === boardWidth || checkMate(newHeadX, newHeadY))
                gameOver = true;
        }

        snakeCells.push([newHeadX, newHeadY]);
        if (newHeadX === foodCells[0] && newHeadY === foodCells[1]) {
            foodSound.play();
            foodCells = generateRandomFoodCell();
            score += 1;
        } else {
            snakeCells.shift();
        }
    }


    function generateRandomFoodCell() {
        return [
            Math.round((Math.random() * (boardWidth - cellSize)) / cellSize) *
            cellSize,
            Math.round((Math.random() * (boardHeight - cellSize)) / cellSize) *
            cellSize,
        ];
    }

    
    function checkMate(newHeadX, newHeadY) {
        for (let item of snakeCells) {
            if (item[0] === newHeadX && item[1] === newHeadY) {
                return true;
            }
        }
        return false;
    }


    let intervalID = setInterval(function () {
        musicSound.play();
        update();
        draw();
    }, 200);
}


ctx.fillStyle = "red";
ctx.font = "50px sans-serif";
ctx.fillText("Press ENTER key to play the game", 100, 100);
document.addEventListener("keydown", function (e) {
    console.log(e)
    if (e.which === 13) {
        if (start) {
            startGame()
            start = false;
        }
    }
})






