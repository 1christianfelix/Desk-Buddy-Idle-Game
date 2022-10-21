const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();

console.log(image);

const playerImage = new Image();

// calling smaller item so that loading doesn't get interrupted by delay in larger item. Map might load in and get placed while player is loading, which will stop it.
playerImage.src = "./char/char_down.png";
image.src = "./img/Room Map.png";
// onload is an event listener that executes a function when item is loaded
console.log(playerImage.width, playerImage.height);

////////////////////
/*  PLAYER CLASS  */
////////////////////

class Player {
  constructor() {
    let playerReference = this;
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

    this.moveDirection = {
      currentPosition: playerReference.drawProperties.position,
      moveUp() {
        console.log(this.currentPosition);
      },
    };
  }

  startingPoint(image, startFrame, startPosition, scale) {
    // console.log("t", image);
    // console.log(playerImage);
    this.drawProperties["image"] = image;
    console.log("g ", this.drawProperties["image"]);
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

// Player initializing
let playerStartFrame = [0, 0, 64, 96];
let playerStartPosition = [676, 416];
let player = new Player();
player.startingPoint(
  playerImage,
  playerStartFrame,
  playerStartPosition,
  [64, 96]
);

player.moveDirection.moveUp();

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

// console.log(player.direction.get("right"));
// playerImage.src = player.direction.get("left");

function animate() {
  window.requestAnimationFrame(animate);
  // z-index position bottom to top
  c.drawImage(image, 256, 64);
  // c.drawImage(playerImage, 196, 0, 64, 96, 676, 416, 64, 96);
  player.draw(player.drawParameters());

  // if (keys.w.pressed) {
  //   playerImage.src = player.direction.get("up");
  // }
  // if (keys.a.pressed) {
  //   playerImage.src = player.direction.get("left");
  // }
  // if (keys.s.pressed) {
  //   playerImage.src = player.direction.get("down");
  // }
  // if (keys.d.pressed) {
  //   playerImage.src = player.direction.get("right");
  // }
}
animate();
console.log(player.drawProperties["position"]);

console.log(keys);
window.addEventListener("keydown", (keyPressed) => {
  console.log(keyPressed.key);
  keys[`${keyPressed.key}`].pressed = true;
  playerImage.src = player.faceDirection.get(`${keyPressed.key}`);
  player.drawParameters;
  console.log("key: ", keys[`${keyPressed.key}`]);
});

window.addEventListener("keyup", (keyPressed) => {
  keys[`${keyPressed.key}`].pressed = false;
  console.log("key: ", keys[`${keyPressed.key}`]);
});

// window.addEventListener("keydown", (keyPressed) => {
//   switch (keyPressed.key) {
//     case "w":
//       keys.w.pressed = true;
//       break;
//     case "a":
//       keys.a.pressed = true;
//       break;
//     case "s":
//       keys.s.pressed = true;
//       break;
//     case "d":
//       keys.d.pressed = true;
//       break;
//   }
// });

// window.addEventListener("keyup", (keyPressed) => {
//   switch (keyPressed.key) {
//     case "w":
//       keys.w.pressed = false;
//       break;
//     case "a":
//       keys.a.pressed = false;
//       break;
//     case "s":
//       keys.s.pressed = false;
//       break;
//     case "d":
//       keys.d.pressed = false;
//       break;
//   }
// });
