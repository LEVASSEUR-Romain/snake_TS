"use strict";
let SNAKECOLOR;
let EATCOLOR;
let WITHPIXEL;
let HEIGHTPIXEL;
let FASTSNAKEMILLISECOND;
let EATSCORE = 3;
let score = 0;
let lenghtStart;
let timer;
const positionStart = { x: 0, y: 0 };
let allPositionSnake = [];
let positionEat;
let directionSnake = "right";
const canvasElement = document.getElementById("canvas");
const scoreElement = document.getElementById("score");
const startElement = document.getElementById("start");
const inputChangement = document.getElementById("changement");
const buttonDefault = document.getElementById("default");
const cutInput = document.getElementById("taille");
const snakeColorInput = document.getElementById("colorSnake");
const miamColorInput = document.getElementById("colorMiam");
const speedInput = document.getElementById("speed");
const wSInput = document.getElementById("widthSnake");
const hSInput = document.getElementById("heightSnake");
const defaultConst = () => {
    SNAKECOLOR = "#FF0000";
    EATCOLOR = "#0000FF";
    WITHPIXEL = 10;
    HEIGHTPIXEL = 8;
    FASTSNAKEMILLISECOND = 150;
    lenghtStart = 3;
    snakeColorInput.value = SNAKECOLOR;
    miamColorInput.value = EATCOLOR;
    wSInput.value = WITHPIXEL.toString();
    hSInput.value = HEIGHTPIXEL.toString();
    speedInput.value = FASTSNAKEMILLISECOND.toString();
    cutInput.value = lenghtStart.toString();
};
defaultConst();
const updateConstFormulaire = () => {
    SNAKECOLOR = snakeColorInput.value;
    EATCOLOR = miamColorInput.value;
    WITHPIXEL = parseInt(wSInput.value);
    HEIGHTPIXEL = parseInt(hSInput.value);
    FASTSNAKEMILLISECOND = parseInt(speedInput.value);
    lenghtStart =
        parseInt(cutInput.value) < 9 ? parseInt(cutInput.value) : lenghtStart;
};
// ALL EVENT LISTENER
startElement === null || startElement === void 0 ? void 0 : startElement.addEventListener("click", () => {
    play();
});
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowDown":
            directionSnake = directionSnake == "top" ? "top" : "bottom";
            break;
        case "ArrowUp":
            directionSnake = directionSnake == "bottom" ? "bottom" : "top";
            break;
        case "ArrowLeft":
            directionSnake = directionSnake == "right" ? "right" : "left";
            break;
        case "ArrowRight":
            directionSnake = directionSnake == "left" ? "left" : "right";
            break;
    }
});
inputChangement.addEventListener("click", updateConstFormulaire);
buttonDefault.addEventListener("click", defaultConst);
// FUNCTION GAMEPLAY
const play = () => {
    gameRefrech();
    let drawSnakeStrat = canvasElement.getContext("2d");
    if (drawSnakeStrat) {
        drawSnakeStrat.fillStyle = SNAKECOLOR;
        drawSnakeStrat.fillRect(positionStart.x, positionStart.y, WITHPIXEL * lenghtStart, HEIGHTPIXEL);
        for (let i = 0; i < lenghtStart; i++) {
            setSnake({
                x: positionStart.x + i * WITHPIXEL,
                y: positionStart.y * HEIGHTPIXEL,
            });
        }
    }
    makeEatForSnake();
    timer = setTimeout(moveSnakeTo, FASTSNAKEMILLISECOND);
};
const moveSnakeTo = () => {
    switch (directionSnake) {
        case "right":
            drawAndStockSnakeAndVerifIsLoseOrIsEat({
                x: getHeadSnakePosition().x + WITHPIXEL,
                y: getHeadSnakePosition().y,
            });
            break;
        case "left":
            drawAndStockSnakeAndVerifIsLoseOrIsEat({
                x: getHeadSnakePosition().x - WITHPIXEL,
                y: getHeadSnakePosition().y,
            });
            break;
        case "top":
            drawAndStockSnakeAndVerifIsLoseOrIsEat({
                x: getHeadSnakePosition().x,
                y: getHeadSnakePosition().y - HEIGHTPIXEL,
            });
            break;
        case "bottom":
            drawAndStockSnakeAndVerifIsLoseOrIsEat({
                x: getHeadSnakePosition().x,
                y: getHeadSnakePosition().y + HEIGHTPIXEL,
            });
            break;
    }
};
const drawAndStockSnakeAndVerifIsLoseOrIsEat = (position) => {
    let drawSnakeNewPosition = canvasElement.getContext("2d");
    if (drawSnakeNewPosition) {
        drawSnakeNewPosition.fillStyle = SNAKECOLOR;
        drawSnakeNewPosition.fillRect(position.x, position.y, WITHPIXEL, HEIGHTPIXEL);
        if (snakeIsLose(position)) {
            gameLose();
        }
        else {
            timer = setTimeout(moveSnakeTo, FASTSNAKEMILLISECOND);
        }
        if (snakeIsGoEatAndUpdateScore(position)) {
            makeEatForSnake();
        }
        else {
            if (!snakeIsLose(position)) {
                removeLastPostion();
            }
        }
        setSnake({
            x: position.x,
            y: position.y,
        });
    }
};
const makeEatForSnake = () => {
    let drawEatNewPosition = canvasElement.getContext("2d");
    if (drawEatNewPosition) {
        drawEatNewPosition.fillStyle = EATCOLOR;
        const x = Math.floor((Math.random() * canvasElement.width) / WITHPIXEL);
        const y = Math.floor((Math.random() * canvasElement.height) / HEIGHTPIXEL);
        if (!isOnTheSnake({ x: x * WITHPIXEL, y: y * HEIGHTPIXEL })) {
            drawEatNewPosition.fillRect(x * WITHPIXEL, y * HEIGHTPIXEL, WITHPIXEL, HEIGHTPIXEL);
            positionEat = { x: x * WITHPIXEL, y: y * HEIGHTPIXEL };
        }
        else {
            makeEatForSnake();
        }
    }
};
const gameLose = () => {
    alert("Perdu Dommage votre score est de " + score);
};
const updateScore = () => {
    score += EATSCORE;
    scoreElement.innerText = score.toString();
};
const deleteScore = () => {
    score = 0;
    scoreElement.innerText = score.toString();
};
const gameRefrech = () => {
    emptyDrawElement();
    allPositionSnake = [];
    deleteScore();
    directionSnake = "right";
    clearTimeout(timer);
    timer = 0;
    positionEat = undefined;
};
const emptyDrawElement = () => {
    let draw = canvasElement.getContext("2d");
    draw === null || draw === void 0 ? void 0 : draw.clearRect(0, 0, canvasElement.width, canvasElement.height);
};
// function POSITION
const setSnake = (add) => {
    allPositionSnake.push(add);
};
const getHeadSnakePosition = () => {
    var _a;
    return (_a = allPositionSnake[allPositionSnake.length - 1]) !== null && _a !== void 0 ? _a : { x: 0, y: 0 };
};
const getEndSnakePosition = () => {
    var _a;
    return (_a = allPositionSnake[0]) !== null && _a !== void 0 ? _a : { x: 0, y: 0 };
};
const removeLastPostion = () => {
    let drawSnakeDeletePosition = canvasElement.getContext("2d");
    if (drawSnakeDeletePosition) {
        drawSnakeDeletePosition.clearRect(getEndSnakePosition().x, getEndSnakePosition().y, WITHPIXEL, HEIGHTPIXEL);
        allPositionSnake.shift();
    }
};
// function BOOLEAN
const isOnTheSnake = (position) => {
    for (const i in allPositionSnake) {
        if (allPositionSnake[i].x === position.x &&
            allPositionSnake[i].y === position.y) {
            return true;
        }
    }
    return false;
};
const isOutOnthePlay = (position) => {
    const borderCanvasTop = 0;
    const borderCanvasLeft = 0;
    if (position.x >= canvasElement.width ||
        position.x < borderCanvasLeft ||
        position.y >= canvasElement.height ||
        position.y < borderCanvasTop) {
        return true;
    }
    return false;
};
const snakeIsLose = (position) => {
    if (isOnTheSnake(position) || isOutOnthePlay(position)) {
        return true;
    }
    return false;
};
const snakeIsGoEatAndUpdateScore = (position) => {
    if (positionEat !== undefined) {
        if (position.x === positionEat.x && position.y === positionEat.y) {
            updateScore();
            return true;
        }
    }
    return false;
};
