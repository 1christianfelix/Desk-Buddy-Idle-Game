const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

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

  move(key) {
    console.log("test");
    let [x, y] = this.drawProperties.position;
    let arr = [x, y];

    if (keys[`${key}`].pressed) {
      console.log("aaaa");

      switch (key) {
        case "w":
          y -= 4;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
        case "a":
          x -= 4;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
        case "s":
          y += 4;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
        case "d":
          x += 4;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
      }
    }
    console.log(this.drawProperties.position);
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
      curPosX,
      curPosY,
      scaleX,
      scaleY
    );
  }
}

let playerStartFrame = [0, 0, 64, 96];
let playerStartPosition = [676, 416];
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
  player.draw(player.drawParameters());

  console.log("test");
  let [x, y] = player.drawProperties.position;
  let arr = [x, y];

  if (/^[wasd]$/i.test(lastKey)) player.move(lastKey);
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
