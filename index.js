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

class Boundary {
  static width = 32;
  static height = 32;
  constructor({ position }) {
    this.position = position;
    this.width = 32;
    this.height = 32;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
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

let temp = boundaries.filter((boundary) => boundary.position.y);
console.log(temp);
const image = new Image();

const playerImage = new Image();

// calling smaller item so that loading doesn't get interrupted by delay in larger item. Map might load in and get placed while player is loading, which will stop it.
playerImage.src = "./char/char_down.png";
image.src = "./img/Room Map.png";
// onload is an event listener that executes a function when item is loaded

/////////////////////////
/*  PLAYER DEVELOPMENT */
/////////////////////////

class Player {
  constructor() {
    // object for drawImage properties
    this.drawProperties = {
      moveFrame: ["x", "x", "x", "x"],
      position: ["y", "y"],
      image: "image",
      scale: ["z", "z"],
    };

    // map for possible directional input for drawImage
    this.faceDirection = new Map([
      ["a", "./char/char_left.png"],
      ["d", "./char/char_right.png"],
      ["w", "./char/char_up.png"],
      ["s", "./char/char_down.png"],
    ]);
  }

  //  box is 32x32, [0,0] starts at stop left of box
  //  player model bottom left foot is [-32,-32], top half of head is 12px above the 32x32 box;

  move(key) {
    // console.log("test");
    let [x, y] = this.drawProperties.position;
    let arr = [x, y];

    // console.log(y);
    if (keys[`${key}`].pressed) {
      switch (key) {
        case "w":
          if (
            boundaries.some(function (boundary, index) {
              console.log(
                `boundary y: `,
                boundary.position.y,
                `boundary x: `,
                boundary.position.x,
                `y:`,
                y,
                "x:",
                x
              );
              if (y >= boundary.position.y + 64) {
                return (
                  y - 1 < boundary.position.y + 64 &&
                  x >= boundary.position.x - 12 &&
                  x < boundary.position.x + 48
                );
              } else console.log("no");
            })
          ) {
            break;
          }
          y -= 1;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
        case "a":
          if (
            boundaries.some(function (boundary, index) {
              console.log(
                `boundary y: `,
                boundary.position.y,
                `boundary x: `,
                boundary.position.x,
                `y: `,
                y,
                "x",
                x
              );
              if (x >= boundary.position.x) {
                return (
                  x - 1 < boundary.position.x + 48 &&
                  y > boundary.position.y &&
                  y < boundary.position.y + 64
                );
              } else console.log("no");
            })
          ) {
            break;
          }
          x -= 1;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
        case "s":
          console.log("x:", x);
          console.log("y:", y);
          if (
            boundaries.some(function (boundary, index) {
              console.log(
                `boundary y: `,
                boundary.position.y,
                `boundary x: `,
                boundary.position.x,
                `y: `,
                y,
                "x",
                x
              );
              if (y <= boundary.position.y) {
                return (
                  y + 1 > boundary.position.y &&
                  x >= boundary.position.x - 12 &&
                  x < boundary.position.x + 48
                );
              } else console.log("no");
            })
          ) {
            break;
          }
          y += 1;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
        case "d":
          if (
            boundaries.some(function (boundary, index) {
              console.log(
                `boundary y: `,
                boundary.position.y,
                `boundary x: `,
                boundary.position.x,
                `y: `,
                y,
                "x",
                x
              );
              if (x <= boundary.position.x) {
                return (
                  x + 1 > boundary.position.x - 16 &&
                  y > boundary.position.y &&
                  y < boundary.position.y + 64
                );
              } else console.log("no");
            })
          ) {
            break;
          }
          x += 1;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
      }
    }
    // console.log(this.drawProperties.position);
  }

  startingPoint(image, startFrame, startPosition, scale) {
    this.drawProperties["image"] = image;
    this.drawProperties["moveFrame"] = startFrame;
    this.drawProperties["position"] = startPosition;
    this.drawProperties["scale"] = scale;
  }

  drawParameters() {
    let image = this.drawProperties["image"];
    let moveFrame = this.drawProperties["moveFrame"];
    let position = this.drawProperties["position"];
    let scale = this.drawProperties["scale"];
    let drawParameters = [image, ...moveFrame, ...position, ...scale];
    return drawParameters;
  }

  draw([
    image,
    cropStartX,
    cropStartY,
    cropLenX,
    cropLenY,
    curPosX,
    curPosY,
    scaleX,
    scaleY,
  ]) {
    c.drawImage(
      image,
      cropStartX,
      cropStartY,
      cropLenX,
      cropLenY,
      curPosX + offset.char_x,
      curPosY + offset.char_y,
      scaleX,
      scaleY
    );
  }
}

let playerStartFrame = [0, 0, 64, 96];
let playerStartPosition = [600, 400];
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

  if (lastKey != "" && keys[lastKey].pressed) {
    player.move(lastKey);
  }
}
animate();

////////////////////////////
/*  MOVEMENT DEVELOPMENT  */
////////////////////////////

window.addEventListener("keydown", (keyPressed) => {
  /*   
    Only proceed checking if WASD was pressed
    REGEX Explaination:
    /pattern/flags
    ^ first character contains
    $ last character before newline contains
    [] character class to search from 
    wasd characters (not a string because of [])
  */
  if (/^[wasd]$/i.test(keyPressed.key)) {
    keys[`${keyPressed.key}`].pressed = true;
    if (keyPressed.key != lastKey) {
      playerImage.src = player.faceDirection.get(`${keyPressed.key}`);
      lastKey = `${keyPressed.key}`;
    }
    // player.move(keyPressed.key);
  }
});

window.addEventListener("keyup", (keyPressed) => {
  if (/^[wasd]$/i.test(keyPressed.key)) {
    keys[`${keyPressed.key}`].pressed = false;
    // console.log("key: ", keys[`${keyPressed.key}`]);
  }
});
