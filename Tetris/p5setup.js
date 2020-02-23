

var img;
var redeyes;
var yelloweyes;


function preload() {
  
  img = loadImage("tetris background lvl1.jpg");  
  redeyes = loadImage("augen tetris.png");
  yelloweyes = loadImage("gelbe augen.png");
}


function setup() {
  //createCanvas(windowWidth, windowHeight);
  //createCanvas(700, 700);
  createCanvas(1294, 920);
}

function windowResized() {
 
  resizeCanvas(windowsWidth,windowsHeight);
  clear();
}



// new p5();
// var width = windowWidth;
// var height = windowHeight;
