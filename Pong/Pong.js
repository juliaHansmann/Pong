var XOne=100;
var YOne= 100;
var XTwo=500;
var YTwo=100;
var XBall=300;
var YBall=120;
var ballDirection= "right";
var ball;
var paddleOne;
var paddleTwo;
var WKey;
var SKey;
var UpKey;
var DownKey;







function setup() {   
    createCanvas (600,600);
}



background(0,0,0);








function draw () {
    clear ();
    fill (255,100,100);
    rect(XOne,YOne,10,50);
    rect(XTwo,YTwo,10,50);
    fill(255,255,255);
    circle (XBall,YBall,10);

    if(ballDirection.localeCompare("right")=== 0)
    {
        
        if(XBall >= XTwo) {
            
            if(YBall>=YTwo-25 && YBall<=YTwo+25)
            {
                ballDirection = "left";

            }
        }    
        
        else {XBall+=5;}
    }

    if(ballDirection.localeCompare("left")=== 0)
    {
        
        if(XBall <= XOne+10) {
            if(YBall>=YOne-25 && YBall<=YOne+25)
            {
                ballDirection = "right";
            }
        }    
        
        else {XBall-=5;}
    }

    if(WKey === true )
    {
        YOne-=8;
    }

    if(SKey === true)
    {
        YOne+=8;
    }

    if(UpKey === true){
        YTwo-=8;
    }

    if(DownKey === true){
        YTwo+=8;
    }


   


}

function keyReleased(){
    if (keyCode === 87){
        WKey = false;

    }

    if(keyCode === 83){
        SKey = false;
        
    }

    if(keyCode === 38){
        UpKey = false;
    }

    if(keyCode === 40){
        DownKey = false;
    }

}

function keyPressed(){
    if(keyCode === 87){
        WKey = true;
    }

    if(keyCode === 83){
        SKey = true;
    }

    if(keyCode === 38){
        UpKey = true;
    }

    if(keyCode === 40){
        DownKey = true;
    }
}



// //x Position aendern
// if (bewegung_x == 1) {
//     pos_x = pos_x + 0.5; //neue Position + Geschwindigkeit x + Richtung
//   } else if (bewegung_x == 2) {
//     pos_x = pos_x + 0;
//   } else if (bewegung_x == 3) {
//     pos_x = pos_x - 0.5;


