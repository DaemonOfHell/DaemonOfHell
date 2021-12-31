let score = 0;
const localStorageKey = "flappybird.highscore";

const FPS = 290;
let GAME_SPEED = 4;
let GAME_BONUS = 0;
let cleared = null;

let v = 0; //net velocity of bird
const g = 10; //acc due to gravity
let d = 0; //net distance travelled in y axis by bird / second wrt flap and gravity
const f = 158; // force of 1 flap
const m = 0.85; // mass of bird in kg

const bgm = new Audio("./res/sounds/bgm.ogg");
const sfx_coin = new Audio("./res/sounds/mariocoin.mp3");
const sfx_gasp = new Audio("./res/sounds/metalclunk.wav");
const sfx_fall = new Audio("./res/sounds/cartoonfall3.wav");

const gamestate = {
  birdvelocity: 0,
  flapping: false,
  birdpositionMT: null,
  pipe1positionML: null,
  pipe2positionML: null,
  score: 0,
  timesincelastrender: 0,
};

bgm.play();

let flapstart = 0;
let flapend = 0;

let flaptime = flapend - flapstart;

let gamestop = false;
let gamepause = true;
let gameover = false;

let previousrendertime;
let timesincelastrender = 0;

const pipes = document.createElement("div");
pipes.classList.add("hurdle");
pipes.innerHTML =
  '<div class="toppipe"></div><div class="gap"></div><div class="bottompipe"></div>';
pipes.style.marginLeft = Math.floor(Math.random() * screen.width) + "px";
document.getElementById("game").appendChild(pipes);

const pipes2 = document.createElement("div");
pipes2.classList.add("hurdle");
pipes2.innerHTML =
  '<div class="toppipe"></div><div class="gap"></div><div class="bottompipe"></div>';
pipes2.style.marginLeft = pipes.offsetLeft + screen.width / 2 + "px";
document.getElementById("game").appendChild(pipes2);

const bird = document.getElementById("bird");
let birdstyle = bird.currentStyle || window.getComputedStyle(bird);

const toppipes = document.getElementsByClassName("toppipe");
const gap = document.getElementsByClassName("gap");
const bottompipes = document.getElementsByClassName("bottompipe");

/**
 * main function
 */
function main(timestamp) {
  const hurdle = document.getElementsByClassName("hurdle");

  if (previousrendertime === undefined) {
    previousrendertime = timestamp;
  }

  /**
   fill the gamestate buffer for pausing and resuming
   * */
  gamestate.birdpositionMT = bird.getBoundingClientRect().top + "px";
  gamestate.pipe1positionML = pipes.getBoundingClientRect().left + "px";
  gamestate.pipe2positionML = pipes2.getBoundingClientRect().left + "px";
  gamestate.score = score;
  gamestate.timesincelastrender = timesincelastrender;
  gamestate.birdvelocity = v;
  gamestate.flapping = flaptime > 0;

  timesincelastrender = (timestamp - previousrendertime) / 1000;
  let reqframe = window.requestAnimationFrame(main);

  if (timesincelastrender < 1 / FPS) return;

  if (gameover) {
    bgm.pause();
    stopgame();
    updateHighScore();
    award();
    showgameoverscreen();

    window.cancelAnimationFrame(reqframe);
    return;
  } else if (gamestop) {
    bgm.pause();
    stopgame();
    document.getElementById("pauseplay").style.visibility = "revert";
    window.cancelAnimationFrame(reqframe);
  } else if (gamepause) {
    document.getElementById("pauseplay").style.visibility = "revert";
    stopgame();
  } else if (pipes.getBoundingClientRect().right < 0) {
    toppipes[0].style.height =
      Math.floor((Math.random() * screen.height) / 2) + "px";
    bottompipes[0].style.height =
      screen.height -
      gap[0].style.height -
      toppipes[0].getBoundingClientRect().bottom +
      "px";
    hurdle[0].style.marginLeft = screen.width + "px";
  } else if (pipes2.getBoundingClientRect().right < 0) {
    toppipes[1].style.height =
      Math.floor((Math.random() * screen.height) / 2) + "px";
    bottompipes[1].style.height =
      screen.height - gap[1].getBoundingClientRect().bottom + "px";
    hurdle[1].style.marginLeft = screen.width + "px";
  }

  hurdle[0].style.marginLeft =
    parseInt(pipes.style.marginLeft.replace("px", "")) - GAME_SPEED + "px";
  hurdle[1].style.marginLeft =
    parseInt(pipes2.style.marginLeft.replace("px", "")) - GAME_SPEED + "px";

  if (flaptime > 0) {
    v = gravity() + flap();
    flapstart = 0;
    flapend = 0;
  } else {
    v = gravity();
  }
  checkgameover();

  previousrendertime = timestamp;
}

function gravity() {
  d = Math.floor(v);
  v = v + g * timesincelastrender;
  bird.style.marginTop =
    parseInt(birdstyle.marginTop.replace("px", "")) + d + "px";
  return v;
}

function flap() {
  v = -(f * timesincelastrender) / m;
  new Audio("./res/sounds/flap.wav").play();
  return v;
}

function stopgame() {
  gamestop = true;
}

function pauseplay() {
  gamepause = !gamepause;
  if (gamepause) {
    gamestop = true;
  } else {
    document.getElementById("pauseplay").style.visibility = "hidden";

    bgm.play();
    v = parseInt(gamestate.birdvelocity);
    flaptime = gamestate.flapping ? 1 : 0;
    bird.style.marginTop = gamestate.birdpositionMT;
    pipes.style.marginLeft = gamestate.pipe1positionML;
    pipes2.style.marginLeft = gamestate.pipe2positionML;
    score = gamestate.score;
    timesincelastrender = gamestate.timesincelastrender;
    previousrendertime = undefined;
    gamestop = false;

    setTimeout(window.requestAnimationFrame(main), 2000);
  }
}

function restart() {
  v = 0;
  d = 0;

  flapstart = 0;
  flapend = 0;
  flaptime = 0;

  gamestop = false;
  gamepause = false;
  gameover = false;

  previousrendertime = undefined;

  gamestate.birdvelocity = 0;
  gamestate.flapping = false;
  gamestate.birdpositionMT = "80px";
  gamestate.pipe1positionML =
    pipes.getBoundingClientRect().left + screen.width + "px";
  gamestate.pipe2positionML =
    pipes2.getBoundingClientRect().left + screen.width + "px";
  gamestate.score = 0;
  gamestate.timesincelastrender = 0;

  timesincelastrender = 0;

  bird.style.marginTop = gamestate.birdpositionMT;
  pipes.style.marginLeft = gamestate.pipe1positionML;
  pipes2.style.marginLeft = gamestate.pipe2positionML;

  bgm.pause();
  document.getElementById("score").innerHTML = "RESTARTING..";

  setTimeout(() => {
    score = 0;
    document.getElementById("score").innerHTML = score;
    document.getElementById("currentscorenumber").innerHTML = score;
    score = 1;
    bgm.currentTime = 0;
    bgm.play();
  }, 200);
}

function checkgameover() {
  if (parseInt(birdstyle.marginTop.replace("px", "")) > screen.height) {
    sfx_fall.play();
    // gamestop = true
    gameover = true;
    // document.getElementById('game').innerHTML = 'gameover'
  }

  collision();
}

function updateHighScore() {
  // Check browser support
  if (typeof Storage !== "undefined") {
    let first = localStorage.getItem(`${localStorageKey}.first`);
    let second = localStorage.getItem(`${localStorageKey}.second`);
    let third = localStorage.getItem(`${localStorageKey}.third`);
    // Store
    if (score > third && score < second) {
      localStorage.setItem(`${localStorageKey}.third`, score);
    } else if (score > second && score < first) {
      localStorage.setItem(
        `${localStorageKey}.third`,
        localStorage.getItem(`${localStorageKey}.second`)
      );
      localStorage.setItem(`${localStorageKey}.second`, score);
    } else if (score > first) {
      localStorage.setItem(
        `${localStorageKey}.second`,
        localStorage.getItem(`${localStorageKey}.first`)
      );
      localStorage.setItem(`${localStorageKey}.first`, score);
    }

    // Retrieve
    document.getElementsByClassName("bestscorenumber")[0].innerHTML =
      localStorage.getItem(`${localStorageKey}.first`);
    let scorelist = document.querySelectorAll(".highscorediv ol li");
    scorelist[0].innerHTML = localStorage.getItem(`${localStorageKey}.first`);
    scorelist[1].innerHTML = localStorage.getItem(`${localStorageKey}.second`);
    scorelist[2].innerHTML = localStorage.getItem(`${localStorageKey}.third`);
  } else {
    // document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
  }
}

function collision() {
  let birdrect = bird.getBoundingClientRect();

  let pipe1top = toppipes[0].getBoundingClientRect();
  let pipe2top = toppipes[1].getBoundingClientRect();

  let pipe1bottom = bottompipes[0].getBoundingClientRect();
  let pipe2bottom = bottompipes[1].getBoundingClientRect();

  if (
    birdrect.top + birdrect.width / 3 < pipe1top.bottom &&
    birdrect.right - birdrect.width / 3 > pipe1top.left &&
    birdrect.left + birdrect.width / 3 < pipe1top.right
  ) {
    sfx_gasp.play();
    gameover = true;
  } else if (
    birdrect.top + birdrect.width / 3 < pipe2top.bottom &&
    birdrect.right - birdrect.width / 3 > pipe2top.left &&
    birdrect.left + birdrect.width / 3 < pipe2top.right
  ) {
    sfx_gasp.play();
    gameover = true;
  } else if (
    birdrect.bottom - birdrect.width / 3 > pipe1bottom.top &&
    birdrect.right - birdrect.width / 3 > pipe1bottom.left &&
    birdrect.left + birdrect.width / 3 < pipe1bottom.right
  ) {
    sfx_gasp.play();
    gameover = true;
  } else if (
    birdrect.bottom - birdrect.width / 3 > pipe2bottom.top &&
    birdrect.right - birdrect.width / 3 > pipe2bottom.left &&
    birdrect.left + birdrect.width / 3 < pipe2bottom.right
  ) {
    sfx_gasp.play();
    gameover = true;
  }
  updateScore();
}

function updateScore() {
  let birdrect = bird.getBoundingClientRect();

  let gap1 = gap[0].getBoundingClientRect();
  let gap2 = gap[1].getBoundingClientRect();

  if (birdrect.right - birdrect.width / 3 < gap1.left && cleared === null) {
    cleared = 0;
  } else if (birdrect.right - birdrect.width / 3 > gap1.left && cleared === 0) {
    cleared = 1;
  } else if (birdrect.left + birdrect.width / 3 > gap1.right && cleared === 1) {
    cleared = 2;
  }

  if (birdrect.right - birdrect.width / 3 < gap2.left && cleared === null) {
    cleared = 10;
  } else if (
    birdrect.right - birdrect.width / 3 > gap2.left &&
    cleared === 10
  ) {
    cleared = 11;
  } else if (
    birdrect.left + birdrect.width / 3 > gap2.right &&
    cleared === 11
  ) {
    cleared = 12;
  } else if (cleared === 2 || cleared === 12) {
    score = score + GAME_BONUS + 1;
    document.getElementById("score").innerHTML = score;
    document.getElementsByClassName("currentscorenumber")[0].innerHTML = score;
    cleared = null;
    sfx_coin.play();
    raiseLevel();
  }
}

function showgameoverscreen() {
  document.getElementById("gameoverscreen").style.display = "block";
}

function award() {
  if (score > 50) {
    document.getElementsByClassName("badge")[0].style.backgroundImage =
      "url('../res/sprites/bronze.png')";
  } else if (score > 140) {
    document.getElementsByClassName("badge")[0].style.backgroundImage =
      "url('../res/sprites/silver.png')";
  } else if (score > 370) {
    document.getElementsByClassName("badge")[0].style.backgroundImage =
      "url('../res/sprites/gold.png')";
  }
}

function raiseLevel() {
  if (score === 21 && score) {
    GAME_SPEED = 5;
    GAME_BONUS = 1;
  } else if (score >= 30 && score < 60) {
    GAME_SPEED = 7;
    GAME_BONUS = 3;
  } else if (score >= 60 && score < 90) {
    GAME_SPEED = 9;
    GAME_BONUS = 5;
  } else if (score >= 90 && score < 200) {
    GAME_SPEED = 13;
    GAME_BONUS = 7;
  } else if (score >= 200) {
    GAME_SPEED = 15;
    GAME_BONUS = 10;
  }
}

window.requestAnimationFrame(main);

window.addEventListener("mousedown", () => {
  flapstart = new Date().getMilliseconds;
  flap();
});

window.addEventListener("mouseup", () => {
  flapend = new Date().getMilliseconds;
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    pauseplay();
  }
});

//play button
document.getElementsByClassName("playbtn")[0].addEventListener("click", () => {
  window.location.reload("/");
});

//exit button
document.getElementsByClassName("exitbtn")[0].addEventListener("click", () => {
  window.location.replace("https://daemonofhell.github.io/leapfrog-intern/#");
});

/**
 * toggle high scores
 */
document
  .getElementsByClassName("highscoresbtn")[0]
  .addEventListener("click", () => {
    if (
      document.getElementsByClassName("highscorediv")[0].style.display !==
      "block"
    ) {
      document.getElementsByClassName("highscorediv")[0].style.display =
        "block";
    } else {
      document.getElementsByClassName("highscorediv")[0].style.display = "none";
    }
  });
