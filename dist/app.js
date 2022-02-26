"use strict";
const SNAKECOLOR = "red";
const EATCOLOR = "green";
const WITHPIXEL = 10;
const HEIGHTPIXEL = 8;
const FASTSNAKE = 1;
const positionStart = { x: 0, y: 0 };
let allPositionSnake = [];
let positionEat;
const lenghtStart = 1;
let directionSnake = "right";
const canvasElement = document.getElementById("canvas");
const startElement = document.getElementById("start");
startElement === null || startElement === void 0 ? void 0 : startElement.addEventListener("click", () => {
    play();
});
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowDown":
            moveSnakeTo("bottom");
            break;
        case "ArrowUp":
            moveSnakeTo("top");
            break;
        case "ArrowLeft":
            moveSnakeTo("left");
            break;
        case "ArrowRight":
            moveSnakeTo("right");
            break;
    }
});
const play = () => {
    let drawSnakeStrat = canvasElement.getContext("2d");
    if (drawSnakeStrat) {
        drawSnakeStrat.fillStyle = SNAKECOLOR;
        drawSnakeStrat.fillRect(positionStart.x * WITHPIXEL, positionStart.y * HEIGHTPIXEL, WITHPIXEL, HEIGHTPIXEL);
        for (let i = 0; i < lenghtStart; i++) {
            setSnake({
                x: positionStart.x + i * WITHPIXEL,
                y: positionStart.y * HEIGHTPIXEL,
            });
        }
    }
    moveSnakeTo(directionSnake);
    makeEatForSnake();
};
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
const drawAndStockSnake = (position) => {
    let drawSnakeNewPosition = canvasElement.getContext("2d");
    if (drawSnakeNewPosition) {
        drawSnakeNewPosition.fillStyle = SNAKECOLOR;
        drawSnakeNewPosition.fillRect(position.x, position.y, WITHPIXEL, HEIGHTPIXEL);
        setSnake({
            x: position.x,
            y: position.y,
        });
        removeLastPostion();
    }
};
const removeLastPostion = () => {
    let drawSnakeDeletePosition = canvasElement.getContext("2d");
    if (drawSnakeDeletePosition) {
        drawSnakeDeletePosition.clearRect(getEndSnakePosition().x, getEndSnakePosition().y, WITHPIXEL, HEIGHTPIXEL);
        allPositionSnake.shift();
        positionEat = undefined;
    }
};
const moveSnakeTo = (direction) => {
    directionSnake = direction;
    switch (direction) {
        case "right":
            drawAndStockSnake({
                x: getHeadSnakePosition().x + WITHPIXEL,
                y: getHeadSnakePosition().y,
            });
            break;
        case "left":
            drawAndStockSnake({
                x: getHeadSnakePosition().x - WITHPIXEL,
                y: getHeadSnakePosition().y,
            });
            break;
        case "top":
            drawAndStockSnake({
                x: getHeadSnakePosition().x,
                y: getHeadSnakePosition().y - HEIGHTPIXEL,
            });
            break;
        case "bottom":
            drawAndStockSnake({
                x: getHeadSnakePosition().x,
                y: getHeadSnakePosition().y + HEIGHTPIXEL,
            });
            break;
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
const isOnTheSnake = (position) => {
    for (const i in allPositionSnake) {
        if (allPositionSnake[i].x === position.x &&
            allPositionSnake[i].y === position.y) {
            return true;
        }
    }
    return false;
};
//function SnakeIsLose position x y en paramétre vérifier sur le bord ou sur le snake
//facteur temps qui fait bougé le snake qui apelle la function moveSnake
