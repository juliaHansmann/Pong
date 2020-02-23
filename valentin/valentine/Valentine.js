var heartscale = 1;
var growdirection = 1;
var angle1 = 0;
var angle2 = 0;
var direction1 = 1;
var direction2 = 2;
var heartdispy = 0;
var heartdispx = 0;
let interval= window.setInterval(show_hearts, 4000);
let trigger = false;

function show_hearts(){
  if(trigger === false){
    trigger = true;
  }
  else{
    trigger = false;
  }
}

function draw() {
  rectMode(CENTER);
  clear();
  background(255);


  image(rabbit, 300, 300, 120 , 120);
  image(beatingheart, 430-heartdispx, 306-heartdispy, heartscale*120 , heartscale*120); //growheart
  image(fox, 560, 310, 120 , 120);

  if(trigger === true) {
    image(growheart, 800, 140, 120 , 120);
    image(sparkleheart, 90, 450, 120 , 113);
  }
  else{
    image(sparkleheart, 800, 140, 120 , 120);
    image(growheart, 90, 450, 120 , 113);
  }

  //Rosen
  push();
  translate(210, 180);
  rotate(angle1*Math.PI/180);
  image(rose, -60, -56, 120 , 113);
  pop();
  push();
  translate(700, 90);
  rotate(angle2*Math.PI/180);
  image(rose, -60, -56, 120 , 113);
  pop();
  push();
  translate(800, 560);
  rotate(angle1*Math.PI/180);
  image(rose, -60, -56, 120 , 113);
  pop();

  if(angle1 >= 30){
    direction1 = 2;
  }
  else if(angle1 <= -30){
    direction1 = 1;
  }
  if(direction1 === 1){
    angle1 += 0.15;
  }
  else{
    angle1 -= 0.15;
  }
  
  if(angle2 >= 30){
    direction2 = 2;
  }
  else if(angle2 <= -30){
    direction2 = 1;
  }
  if(direction2 === 1){
    angle2 += 0.15;
  }
  else{
    angle2 -= 0.15;
  }

  if(growdirection === 1){
    heartscale += 0.002;
    heartdispy += 0.2;
    heartdispx += 0.1;
  }
  else if(growdirection === 2){
    heartscale -= 0.002;
    heartdispy -= 0.2;
    heartdispx -= 0.1;
  }

  if(heartscale <= 0.7){
    growdirection = 1;
  }
  else if(heartscale >= 1){
    growdirection = 2;
  }

  push();
  textSize(30);
  fill(0);
  text("Frohen Valentinstag", 350, 260);
  text("von deinem Hasi", 375, 480);
  pop();
 
}
