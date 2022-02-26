interface positionXY {
  x: number;
  y: number;
}
const SNAKECOLOR = "red";
const EATCOLOR = "green";
const WITHPIXEL: number = 10;
const HEIGHTPIXEL: number = 8;
const FASTSNAKE: number = 1;
const positionStart: positionXY = { x: 0, y: 0 };
let allPositionSnake: positionXY[] = [];
let positionEat: positionXY | undefined;
const lenghtStart: number = 1;
let directionSnake: string = "right";
const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const startElement = document.getElementById("start");

startElement?.addEventListener("click", () => {
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

const play = (): void => {
  let drawSnakeStrat = canvasElement.getContext("2d");
  if (drawSnakeStrat) {
    drawSnakeStrat.fillStyle = SNAKECOLOR;
    drawSnakeStrat.fillRect(
      positionStart.x * WITHPIXEL,
      positionStart.y * HEIGHTPIXEL,
      WITHPIXEL,
      HEIGHTPIXEL
    );
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
const setSnake = (add: positionXY): void => {
  allPositionSnake.push(add);
};
const getHeadSnakePosition = (): positionXY => {
  return allPositionSnake[allPositionSnake.length - 1] ?? { x: 0, y: 0 };
};
const getEndSnakePosition = (): positionXY => {
  return allPositionSnake[0] ?? { x: 0, y: 0 };
};
const drawAndStockSnake = (position: positionXY): void => {
  let drawSnakeNewPosition = canvasElement.getContext("2d");
  if (drawSnakeNewPosition) {
    drawSnakeNewPosition.fillStyle = SNAKECOLOR;
    drawSnakeNewPosition.fillRect(
      position.x,
      position.y,
      WITHPIXEL,
      HEIGHTPIXEL
    );
    setSnake({
      x: position.x,
      y: position.y,
    });
    removeLastPostion();
  }
};

const removeLastPostion = (): void => {
  let drawSnakeDeletePosition = canvasElement.getContext("2d");
  if (drawSnakeDeletePosition) {
    drawSnakeDeletePosition.clearRect(
      getEndSnakePosition().x,
      getEndSnakePosition().y,
      WITHPIXEL,
      HEIGHTPIXEL
    );
    allPositionSnake.shift();
    positionEat = undefined;
  }
};
const moveSnakeTo = (direction: string): void => {
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

const makeEatForSnake = (): void => {
  let drawEatNewPosition = canvasElement.getContext("2d");
  if (drawEatNewPosition) {
    drawEatNewPosition.fillStyle = EATCOLOR;
    const x: number = Math.floor(
      (Math.random() * canvasElement.width) / WITHPIXEL
    );
    const y: number = Math.floor(
      (Math.random() * canvasElement.height) / HEIGHTPIXEL
    );
    if (!isOnTheSnake({ x: x * WITHPIXEL, y: y * HEIGHTPIXEL })) {
      drawEatNewPosition.fillRect(
        x * WITHPIXEL,
        y * HEIGHTPIXEL,
        WITHPIXEL,
        HEIGHTPIXEL
      );
      positionEat = { x: x * WITHPIXEL, y: y * HEIGHTPIXEL };
    } else {
      makeEatForSnake();
    }
  }
};

const isOnTheSnake = (position: positionXY): boolean => {
  for (const i in allPositionSnake) {
    if (
      allPositionSnake[i].x === position.x &&
      allPositionSnake[i].y === position.y
    ) {
      return true;
    }
  }
  return false;
};

//function SnakeIsLose position x y en paramétre vérifier sur le bord ou sur le snake

//facteur temps qui fait bougé le snake qui apelle la function moveSnake
