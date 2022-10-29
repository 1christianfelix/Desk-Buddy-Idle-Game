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

    this.frameCount = 0;
    this.moveState = false;
    this.gotoState = false;
  }
  //  box is 32x32, [0,0] starts at stop left of box
  //  player model bottom left foot is [-32,-32], top half of head is 12px above the 32x32 box;

  // TODO:: REWORK SO THAT WE CONVERT DES[X,Y] POSITIONS TO BE [0,0] OF BLOCKS
  //SO THAT ALL MOVEMENT IS STRAIGHT
  goto(des_x, des_y, playerImage) {
    let [x, y] = this.drawProperties.position;
    // console.log(des_x, x);
    // console.log(this.frameCount);
    if (this.moveState == false) {
      this.frameCount = 0;
    }
    this.moveState = true;
    this.frameMove();
    this.frameCount++;
    console.log(des_x > x);

    if (des_x > x) {
      x++;
      playerImage.src = "./char/char_right.png";
    } else {
      x--;
      playerImage.src = "./char/char_left.png";
    }

    if (des_x == x) {
      if (des_y > y) {
        console.log(des_x, x);
        console.log("d");
        console.log(playerImage.src);
        y++;
        playerImage.src = "./char/char_down.png";
      } else {
        console.log("u");
        y--;
        playerImage.src = "./char/char_up.png";
      }
    }
    this.drawProperties.position = [x, y];
    this.drawProperties.image = playerImage;
    if (des_x == x && des_y == y) {
      this.frameCount = 0;
      this.gotoState = false;
      this.moveState = false;
    }
  }

  move(key) {
    this.moveState = true;
    let [x, y] = this.drawProperties.position;
    let arr = [x, y];

    this.frameMove();

    // WASD MOVEMENT
    if (keys[`${key}`].pressed) {
      this.frameCount++;
      switch (key) {
        case "w":
          if (
            boundaries.some(function (boundary, index) {
              if (y >= boundary.position.y + 64) {
                console.log(x, y);
                console.log("ttt", boundary.position);
                return (
                  y - 1 < boundary.position.y + 64 &&
                  x >= boundary.position.x - 12 &&
                  x < boundary.position.x + 48
                );
              }
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
              if (x >= boundary.position.x) {
                console.log(x, y);
                console.log("ttt", boundary.position);
                return (
                  x - 1 < boundary.position.x + 48 &&
                  y > boundary.position.y &&
                  y < boundary.position.y + 64
                );
              }
            })
          ) {
            break;
          }
          x -= 1;
          arr = [x, y];
          this.drawProperties.position = arr;
          break;
        case "s":
          if (
            boundaries.some(function (boundary, index) {
              if (y <= boundary.position.y) {
                console.log(x, y);
                console.log("ttt", boundary.position);
                return (
                  y + 1 > boundary.position.y &&
                  x >= boundary.position.x - 12 &&
                  x < boundary.position.x + 48
                );
              }
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
              if (x <= boundary.position.x) {
                console.log(x, y);
                console.log("ttt", boundary.position);
                return (
                  x + 1 > boundary.position.x - 16 &&
                  y > boundary.position.y &&
                  y < boundary.position.y + 64
                );
              }
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
  }

  // movement frame utilizes the position of the cropStartX parameter. [0->64->128->192]
  // idle movement should utilize cropStartY
  // frame changes upon time change between keydown and keyup
  // new time == last time >
  frameMove() {
    switch (this.frameCount) {
      case 0:
        this.drawProperties["moveFrame"] = [0, 0, 64, 96];
        break;
      case 15:
        this.drawProperties["moveFrame"] = [64, 0, 64, 96];
        break;
      case 30:
        this.drawProperties["moveFrame"] = [128, 0, 64, 96];
        break;
      case 45:
        this.drawProperties["moveFrame"] = [192, 0, 64, 96];
        this.frameCount = 0;
        break;
    }
  }

  frameIdle() {
    if (this.moveState == false) {
      this.frameCount++;
      switch (this.frameCount) {
        case 120:
          this.drawProperties["moveFrame"] = [0, 0, 64, 96];
          break;
        case 240:
          this.drawProperties["moveFrame"] = [0, 2, 64, 96];
          this.frameCount = 0;
          break;
      }
    }
  }

  frameSleep() {}

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
