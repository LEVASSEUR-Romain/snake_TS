//DECLARATION VARIABLE
interface positionXY {
  x: number;
  y: number;
}

let SNAKECOLOR: string;
let EATCOLOR: string;
let WITHPIXEL: number;
let HEIGHTPIXEL: number;
let FASTSNAKEMILLISECOND: number;
let EATSCORE: number = 3;
let score: number = 0;
let lenghtStart: number;
let timer: number;
const positionStart: positionXY = { x: 0, y: 0 };
let allPositionSnake: positionXY[] = [];
let positionEat: positionXY | undefined;
let directionSnake: string = "right";
const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const scoreElement = document.getElementById("score") as HTMLSpanElement;
const startElement = document.getElementById("start") as HTMLButtonElement;
const inputChangement = document.getElementById(
  "changement"
) as HTMLButtonElement;
const buttonDefault = document.getElementById("default") as HTMLButtonElement;
const cutInput = document.getElementById("taille") as HTMLInputElement;
const snakeColorInput = document.getElementById(
  "colorSnake"
) as HTMLInputElement;
const miamColorInput = document.getElementById("colorMiam") as HTMLInputElement;
const speedInput = document.getElementById("speed") as HTMLInputElement;
const wSInput = document.getElementById("widthSnake") as HTMLInputElement;
const hSInput = document.getElementById("heightSnake") as HTMLInputElement;
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
startElement?.addEventListener("click", () => {
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
const play = (): void => {
  gameRefrech();
  let drawSnakeStrat = canvasElement.getContext("2d");
  if (drawSnakeStrat) {
    drawSnakeStrat.fillStyle = SNAKECOLOR;
    drawSnakeStrat.fillRect(
      positionStart.x,
      positionStart.y,
      WITHPIXEL * lenghtStart,
      HEIGHTPIXEL
    );
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
const moveSnakeTo = (): void => {
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
const drawAndStockSnakeAndVerifIsLoseOrIsEat = (position: positionXY): void => {
  let drawSnakeNewPosition = canvasElement.getContext("2d");
  if (drawSnakeNewPosition) {
    drawSnakeNewPosition.fillStyle = SNAKECOLOR;
    drawSnakeNewPosition.fillRect(
      position.x,
      position.y,
      WITHPIXEL,
      HEIGHTPIXEL
    );
    if (snakeIsLose(position)) {
      gameLose();
    } else {
      timer = setTimeout(moveSnakeTo, FASTSNAKEMILLISECOND);
    }
    if (snakeIsGoEatAndUpdateScore(position)) {
      makeEatForSnake();
    } else {
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
const gameLose = (): void => {
  alert("Perdu Dommage votre score est de " + score);
};
const updateScore = (): void => {
  score += EATSCORE;
  scoreElement.innerText = score.toString();
};
const deleteScore = (): void => {
  score = 0;
  scoreElement.innerText = score.toString();
};
const gameRefrech = (): void => {
  emptyDrawElement();
  allPositionSnake = [];
  deleteScore();
  directionSnake = "right";
  clearTimeout(timer);
  timer = 0;
  positionEat = undefined;
};
const emptyDrawElement = (): void => {
  let draw = canvasElement.getContext("2d");
  draw?.clearRect(0, 0, canvasElement.width, canvasElement.height);
};

// function POSITION
const setSnake = (add: positionXY): void => {
  allPositionSnake.push(add);
};
const getHeadSnakePosition = (): positionXY => {
  return allPositionSnake[allPositionSnake.length - 1] ?? { x: 0, y: 0 };
};
const getEndSnakePosition = (): positionXY => {
  return allPositionSnake[0] ?? { x: 0, y: 0 };
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
  }
};
// function BOOLEAN
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

const isOutOnthePlay = (position: positionXY): boolean => {
  const borderCanvasTop = 0;
  const borderCanvasLeft = 0;
  if (
    position.x >= canvasElement.width ||
    position.x < borderCanvasLeft ||
    position.y >= canvasElement.height ||
    position.y < borderCanvasTop
  ) {
    return true;
  }
  return false;
};
const snakeIsLose = (position: positionXY): boolean => {
  if (isOnTheSnake(position) || isOutOnthePlay(position)) {
    return true;
  }
  return false;
};
const snakeIsGoEatAndUpdateScore = (position: positionXY): boolean => {
  if (positionEat !== undefined) {
    if (position.x === positionEat.x && position.y === positionEat.y) {
      updateScore();
      return true;
    }
  }
  return false;
};
