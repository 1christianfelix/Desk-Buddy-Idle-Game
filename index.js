const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

console.log(collisions);

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

const collisionMap = [];
for (let i = 0; i < collisions.length; i += 16) {
  collisionMap.push(collisions.slice(i, 16 + i));
}

const offset = {
  x: 256,
  y: 64,
  char_x: -32,
  char_y: -64,
};

const boundaries = [];

collisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 413761) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.height + offset.x,
            y: i * Boundary.width + offset.y,
          },
        })
      );
    }
  });
});

const image = new Image();
const playerImage = new Image();
const foregroundImage = new Image();

// calling smaller item so that loading doesn't get interrupted by delay in larger item. Map might load in and get placed while player is loading, which will stop it.
playerImage.src = "./char/char_down.png";
foregroundImage.src = "./img/Chair Back Rest.png";
image.src = "./img/Room Map.png";
// onload is an event listener that executes a function when item is loaded

/////////////////////////
/*  PLAYER DEVELOPMENT */
/////////////////////////

let playerStartFrame = [0, 0, 64, 96];
let playerStartPosition = [384, 352];
let player = new Player();
player.startingPoint(
  playerImage,
  playerStartFrame,
  playerStartPosition,
  [64, 96]
);

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastKey = "";

function animate() {
  window.requestAnimationFrame(animate);
  c.drawImage(image, 256, 64);
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw(player.drawParameters());
  c.drawImage(foregroundImage, 256, 64);

  // Move if WASD is pressed
  if (lastKey != "" && keys[lastKey].pressed) {
    player.move(lastKey);
  }
  if (player.moveState == false) player.frameIdle();
  // console.log(player.frameCount);
  if (player.gotoState == true)
    player.goto(goto_pos[0], goto_pos[1], playerImage);
}
animate();

////////////////////////////
/*  MOVEMENT DEVELOPMENT  */
////////////////////////////

let goto_pos = [];
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  console.log(rect);
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log("x: " + x + " y: " + y);
  goto_pos = [x, y];
}

canvas.addEventListener("click", function (e) {
  player.gotoState = true;
  getCursorPosition(canvas, e);
});

window.addEventListener("keydown", (keyPressed) => {
  if (player.moveState == false) {
    console.log("t");
    player.frameCount = 0;
    player.moveState = true;
  }

  //  Only proceed checking if WASD was pressed
  //  REGEX Explaination:
  //  /pattern/flags
  //  ^ first character contains
  //  $ last character before newline contains
  //  [] character class to search from
  //  wasd characters (not a string because of [])

  if (/^[wasd]$/i.test(keyPressed.key)) {
    keys[`${keyPressed.key}`].pressed = true;
    if (keyPressed.key != lastKey) {
      playerImage.src = player.faceDirection.get(`${keyPressed.key}`);
      lastKey = `${keyPressed.key}`;
    }
  }
});

window.addEventListener("keyup", (keyPressed) => {
  player.frameCount = 0;
  player.moveState = false;
  player.frameMove();
  if (/^[wasd]$/i.test(keyPressed.key)) {
    keys[`${keyPressed.key}`].pressed = false;
  }
});
