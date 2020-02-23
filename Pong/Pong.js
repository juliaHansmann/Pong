var XOne=100;
var XTwo=500;
var XBall=300;
var YBall=120;
var ballDirection= "right";
var ball;
var paddleOne;
var paddleTwo;






function setup() {   
    createCanvas (600,600);
}



background(0,0,0);








function draw () {
    clear ();
    fill (255,100,100);
    rect(XOne,100,10,50);
    rect(XTwo,100,10,50);
    fill(255,255,255);
    circle (XBall,YBall,10);

    if(ballDirection.localeCompare("right")=== 0)
    {
        XBall++;

    }
   


}



// //x Position aendern
// if (bewegung_x == 1) {
//     pos_x = pos_x + 0.5; //neue Position + Geschwindigkeit x + Richtung
//   } else if (bewegung_x == 2) {
//     pos_x = pos_x + 0;
//   } else if (bewegung_x == 3) {
//     pos_x = pos_x - 0.5;


