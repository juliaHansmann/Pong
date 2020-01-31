

var img;
var redeyes;
var yelloweyes;


function preload() {
  img = loadImage("tetris background lvl1.jpg");
  redeyes = loadImage("augen tetris.png");
  yelloweyes = loadImage("gelbe augen.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth - p5rulersize, windowHeight - p5rulersize);
  clear();
}



new p5();
var width = windowWidth;
var height = windowHeight;
