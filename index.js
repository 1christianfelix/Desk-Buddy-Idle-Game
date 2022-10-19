const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "/img/Room Map.png";

console.log(image);

image.onload = () => {
  c.drawImage(image, 256, 64);
};
