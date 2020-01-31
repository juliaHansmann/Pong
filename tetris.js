
	
// let img;
let x = 90; //30 = Mittelpunkt des ersten rect, 10 = Feldrand
let y = 90;
let end = y + 530;
let playing_angle = 0;
let blocks = ["Q", "T", "L", "I", "Z", "mZ", "mL"];
let playing_block = "";
let next_block = "";
// let click; //SOUND
// let looper1;
//10000 = 10sec/1000 = 1sec => Zeit bis Block eins weiter fällt
let timer = 0;
let interval = 0;
//png augen timer
let interval_yellow = window.setInterval(show_red, 5000);
let trigger_yellow = false;
let interval_red = window.setInterval(show_yellow, 4000);
let trigger_red = false;
let block_landed = false;
let started = 0;
let move_ok = true;
let score = 0;
let paused = false;
let collide = [];
let fallen_blocks = [];
   
// function setup() {
//   createCanvas(600, 600);
   
// }
// function preload() {
//   img = loadImage('tetris background lvl1.jpg');
// }
// function setup() {
//   image(img, width, height);
// }
 
 
//SOUND:
 
// function preload() {
//   click = loadSound('assets/drum.mp3');
// }
 
// function setup() {
//   //the looper's callback is passed the timeFromNow
//   //this value should be used as a reference point from
//   //which to schedule sounds
//   looper1 = new p5.SoundLoop(function(timeFromNow){
//     click.play(timeFromNow);
//     background(255 * (looper1.iterations % 2));
//     }, 2);
 
//   //stop after 10 iteratios;
//   looper1.maxIterations = 10;
//   //start the loop
//   looper1.start();
// }
  
function draw() {
  rectMode(CENTER);
  clear();
  image(img,0,0, windowWidth, windowHeight);
 
  //Spielfläche hinterlegen
  push();
  fill(169, 169, 169, 50); //Farbe 50% durchsichtig
  rect(270, 300, 460, 600); //25 auf 31, dunkle Spielfläche
  pop();


 
  //Anzeige für nächsten Block, und Punktzahl
  push();
  textSize(20);
  fill(255);
  text("NEXT", 520, 150);//
  text("SCORE", 520, 100);
  text(score, 520, 125);
  pop();
 
  //Wemm der Timer für red ausgelöst wurde und trigger auf true
  //rote Augen zeichnen
  if(trigger_red === true) {
    // scale*0,5;
    image(redeyes,320,200, 50, 30);
  }
  //gleiches für die gelben Augen
  if(trigger_yellow === true) {
    image(yelloweyes,1450,200, 50,30);
  }
   
  //Startdialog
  if (started === 0) {
    fill(169, 169, 169);
    rect(270, 300, 200, 50); //Box für Startknopf
    fill(255);
    text("START", 255, 305);
  }
  //Spiel läuft
  else if(started === 1) {
    let changed_next_x = (570-10)/20;
    let changed_next_y = (210-10)/20;
    let next_blockdata = drawBlocks(next_block, changed_next_x, changed_next_y, 0); //0 ersetzt playing_angle
    let next_block_positions = next_blockdata[0];
    let next_block_colors = next_blockdata[1];
    drawRects(next_block_positions, next_block_colors);
   
    //Bereits gefallene Blöcke aus collide[] abrufen und zeichnen
    //höher gesetzt, da neuer Block bei Game Over drübergezeichnet wird
    for (let j = 0; j < collide.length; j++){
      let row = collide[j];
      for (let i = 0; i < row.length; i++)
      {
        let placed = row[i];
        if(placed === 1)
        {
          let rect_colors = fallen_blocks[j][i];
          drawRects([i, j], rect_colors);
        }
      }
    }
 
    //Koordinaten umrechnen damit Blöcke leichter gezeichnet werden können
    //drawBlocks() aufrufen um zu wählen welcher Block gezeichnet wird
    //und dann abwarten welche Koordinaten und Farben zurückkommen
    //mit den Koordinaten und Farben dann drawRects() zeichnen lassen
    let changed_coords_x = (x-30)/20;
    let changed_coords_y = (y-10)/20;
    let blockdata = drawBlocks(playing_block, changed_coords_x, changed_coords_y, playing_angle);
    let plyaing_block_positions = blockdata[0];
    let plyaing_block_colors = blockdata[1];
    drawRects(plyaing_block_positions, plyaing_block_colors);
 
    //Kollision für nächste Bewegung prüfen
    checkCollision(changed_coords_x, changed_coords_y, playing_angle);
     
    //Wenn feststeht das Block nicht mehr weiter fallen kann (nachdem es
    //Funktion advance() nochmal versucht hat) Block fixieren lassen durch
    //fixBlocks() und mit checkCompletion() prüfen ob Reihe komplett
    if (block_landed === true) {
      fixBlocks(plyaing_block_positions, plyaing_block_colors);
      checkCompletion();
      playing_angle = 0;
      y = 90;
      x = 90;
 
      //nächsten Block wählen
      playing_block = next_block;
      next_block = random(blocks);
      let changed_coords_goc_x = (x-30)/20;
      let changed_coords_goc_y = (y-10)/20;
      let blockdata_goc = drawBlocks(playing_block, changed_coords_goc_x, changed_coords_goc_y, playing_angle);
      let plyaing_block_positions_goc = blockdata_goc[0];
      let plyaing_block_colors_goc = blockdata_goc[1];
 
      //und Game Over Kollision prüfen
      for(let i = 0; i < (plyaing_block_positions_goc.length-1); i+=2){
        let goc_x = plyaing_block_positions_goc[i];
        let goc_y = plyaing_block_positions_goc[i+1];
        let collision_row_goc = collide[goc_y];
        let placed_goc = collision_row_goc[goc_x];
        //1 ist ein Block, 2 Boden
        if(placed_goc === 1 || placed_goc === 2){
          fixBlocks(plyaing_block_positions_goc, plyaing_block_colors_goc);
          move_ok = false;
          started = 2; //Auf Game Over stellen
          clearInterval(interval);
        }
        else{
          move_ok = true;
        }
      }
       
      block_landed = false;
    }
  } //if(started === 1) ende
  //Game Over
  else if (started === 2) {
    //Bereits gefallene Blöcke aus collide[] abrufen und zeichnen
    //höher gesetzt, da neuer Block bei Game Over drübergezeichnet wird
    for (let j = 0; j < collide.length; j++){
      let row = collide[j];
      for (let i = 0; i < row.length; i++)
      {
        let placed = row[i];
        if(placed === 1)
        {
          let rect_colors = fallen_blocks[j][i];
          drawRects([i, j], rect_colors);
        }
      }
    }
    fill(169, 169, 169);
    rect(270, 250, 200, 50); //Box für Game Over
    rect(270, 300, 200, 50); //Box für Startknopf
    fill(255);
    text("GAME OVER", 235, 255);
    text("RESTART", 245, 305);
  }
} //draw ende
 
//wenn Maus geklickt wird für Spielstart
function mouseClicked() {
  //und im Button ist
  if(mouseX >=170 && mouseX <=370 && mouseY >= 275 && mouseY <= 325 && (started === 0 || started === 2)) {
    started = 1;
    playing_block = random(blocks);
    next_block = random(blocks);
    score = 0;
    clearInterval(interval);
    timer = 550;
    interval = window.setInterval(advance, timer);
    collide = [
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ];
    fallen_blocks = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    playing_angle = 0;
    y = 90;
    x = 90;
    move_ok = true;
    block_landed = false;
  }
}
 
//reference: Nintendo-Online.de Tetris Figuren Vorlage
 
//Funktionen errechnen auf das collide Array bezogen wo
//Rechtecke gezeichnet werden sollen
   
function Q(changed_x, changed_y, angle) {
  let playing_colors = [];
  let playing_coords = [];
  block_color_1 = 255;
  block_color_2 = 255;
  block_color_3 = 255;
  playing_colors.push(block_color_1);
  playing_colors.push(block_color_2);
  playing_colors.push(block_color_3);
  
  playing_coords.push(changed_x, changed_y, changed_x+1, changed_y, changed_x, changed_y+1, changed_x+1, changed_y+1);
  return [playing_coords, playing_colors];
}
   
function T(changed_x, changed_y, angle) {
  let playing_colors = [];
  let playing_coords = [];
  block_color_1 = 150;
  block_color_2 = 150;
  block_color_3 = 0;
  playing_colors.push(block_color_1);
  playing_colors.push(block_color_2);
  playing_colors.push(block_color_3);
    
  if(angle === 0){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y, changed_x+1, changed_y, changed_x, changed_y+1);
  }
  else if(angle === 1){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y, changed_x, changed_y-1, changed_x, changed_y+1);
  }
  else if(angle === 2){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y, changed_x+1, changed_y, changed_x, changed_y-1);
    }
  else if(angle === 3){
    playing_coords.push(changed_x, changed_y-1, changed_x, changed_y, changed_x, changed_y+1, changed_x+1, changed_y);
  }
  return [playing_coords, playing_colors];
}
   
function L(changed_x, changed_y, angle) {
  let playing_colors = [];
  let playing_coords = [];
  block_color_1 = 50;
  block_color_2 = 150;
  block_color_3 = 250;
  playing_colors.push(block_color_1);
  playing_colors.push(block_color_2);
  playing_colors.push(block_color_3);
  
  if(angle === 0){
    playing_coords.push(changed_x-2, changed_y, changed_x-1, changed_y, changed_x, changed_y, changed_x, changed_y+1);
  }
  else if(angle === 1){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y-2, changed_x, changed_y-1, changed_x, changed_y);
  }
  else if(angle === 2){
    playing_coords.push(changed_x, changed_y-1, changed_x, changed_y, changed_x+1, changed_y, changed_x+2, changed_y);
  }
  else if(angle === 3){
    playing_coords.push(changed_x, changed_y+2, changed_x, changed_y+1, changed_x, changed_y, changed_x+1, changed_y);
  }
  return [playing_coords, playing_colors];
}
   
function I(changed_x, changed_y, angle) {
  let playing_colors = [];
  let playing_coords = [];
  block_color_1 = 10;
  block_color_2 = 150;
  block_color_3 = 0;
  playing_colors.push(block_color_1);
  playing_colors.push(block_color_2);
  playing_colors.push(block_color_3);
  
  if(angle === 0){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y, changed_x+1, changed_y, changed_x+2, changed_y);
  }
  else if(angle === 1){
    playing_coords.push(changed_x, changed_y-1, changed_x, changed_y, changed_x, changed_y+1, changed_x, changed_y+2);
  }
  else if(angle === 2){
    playing_coords.push(changed_x-2, changed_y, changed_x-1, changed_y, changed_x, changed_y, changed_x+1, changed_y);
  }
  else if(angle === 3){
    playing_coords.push(changed_x, changed_y-2, changed_x, changed_y-1, changed_x, changed_y, changed_x, changed_y+1);
  }
  return [playing_coords, playing_colors];
}
   
function Z(changed_x, changed_y, angle) {
  let playing_colors = [];
  let playing_coords = [];
  block_color_1 = 0;
  block_color_2 = 250;
  block_color_3 = 200;
  playing_colors.push(block_color_1);
  playing_colors.push(block_color_2);
  playing_colors.push(block_color_3);
  
  if(angle === 0){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y, changed_x, changed_y+1, changed_x+1, changed_y+1);
  }
  else if(angle === 1){
    playing_coords.push(changed_x-1, changed_y, changed_x-1, changed_y+1, changed_x, changed_y, changed_x, changed_y-1);
  }
  else if(angle === 2){
    playing_coords.push(changed_x-1, changed_y-1, changed_x, changed_y-1, changed_x, changed_y, changed_x+1, changed_y);
  }
  else if(angle === 3){
    playing_coords.push(changed_x, changed_y, changed_x, changed_y+1, changed_x+1, changed_y, changed_x+1, changed_y-1);
  }
  return [playing_coords, playing_colors];
}
  
//mirrored Z/L
function mZ(changed_x, changed_y, angle) {
  let playing_colors = [];
  let playing_coords = [];
  block_color_1 = 100;
  block_color_2 = 20;
  block_color_3 = 0;
  playing_colors.push(block_color_1);
  playing_colors.push(block_color_2);
  playing_colors.push(block_color_3);
  
  if(angle === 0){
    playing_coords.push(changed_x-1, changed_y+1, changed_x, changed_y, changed_x, changed_y+1, changed_x+1, changed_y);
  }
  else if(angle === 1){
    playing_coords.push(changed_x-1, changed_y-1, changed_x-1, changed_y, changed_x, changed_y, changed_x, changed_y+1);
  }
  else if(angle === 2){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y, changed_x, changed_y-1, changed_x+1, changed_y-1);
  }
  else if(angle === 3){
    playing_coords.push(changed_x, changed_y-1, changed_x, changed_y, changed_x+1, changed_y, changed_x+1, changed_y+1);
  }
  return [playing_coords, playing_colors];
}
   
function mL(changed_x, changed_y, angle) {
  let playing_colors = [];
  let playing_coords = [];
  block_color_1 = 120;
  block_color_2 = 100;
  block_color_3 = 150;
  playing_colors.push(block_color_1);
  playing_colors.push(block_color_2);
  playing_colors.push(block_color_3);
  
  if(angle === 0){
    playing_coords.push(changed_x-2, changed_y, changed_x-1, changed_y, changed_x, changed_y, changed_x, changed_y-1);
  }
  else if(angle === 1){
    playing_coords.push(changed_x, changed_y, changed_x, changed_y-2, changed_x, changed_y-1, changed_x+1, changed_y);
  }
  else if(angle === 2){
    playing_coords.push(changed_x, changed_y+1, changed_x, changed_y, changed_x+1, changed_y, changed_x+2, changed_y);
  }
  else if(angle === 3){
    playing_coords.push(changed_x-1, changed_y, changed_x, changed_y, changed_x, changed_y+1, changed_x, changed_y+2);
  }
  return [playing_coords, playing_colors];
}
  
//Zeitgesteuerte Funktion
//Funktion wird alle interval = 250 = 0,25 Sekunden aufgerufen
//und lässt Block 20 Pixel fallen oder sorgt bei Kollision
//mit block_landed = true dafür das Block festgesetzt wird
function advance() {
  if(move_ok === true)
  {
    y+=20;
  }
  else
  {
    block_landed = true;
  }
}
 
//Wechselt den Modus für die Anzeige von rot
function show_red() {
  if(trigger_red === false) {
    trigger_red = true;
  }
  else {
    trigger_red = false;
  }
}
 
//Wechselt den Modus für die Anzeige von gelb
function show_yellow() {
  if(trigger_yellow === false) {
    trigger_yellow = true;
  }
  else {
    trigger_yellow = false;
  }
}
  
//Anhand des Wertes in block entscheiden was gezeichnet wird,
//Koordinaten weitergeben und auf Zeichenpunkte und Farbe warten
//die in block_pos_col gespeichert werden
//Diese Werte werden an draw() zurückgegeben mit return
function drawBlocks(block, changed_x, changed_y, angle) {
  let block_pos_col = [];
  if(block.localeCompare("Q") === 0)
  {
    block_pos_col = Q(changed_x, changed_y, angle);
  }
  else if(block.localeCompare("T") === 0)
  {
    block_pos_col = T(changed_x, changed_y, angle);
  }
  else if(block.localeCompare("L") === 0)
  {
    block_pos_col = L(changed_x, changed_y, angle);
  }
  else if(block.localeCompare("I") === 0)
  {
    block_pos_col = I(changed_x, changed_y, angle);
  }
  else if(block.localeCompare("Z") === 0)
  {
    block_pos_col = Z(changed_x, changed_y, angle);
  }
  else if(block.localeCompare("mL") === 0)
  {
    block_pos_col = mL(changed_x, changed_y, angle);
  }
  else if(block.localeCompare("mZ") === 0)
  {
    block_pos_col = mZ(changed_x, changed_y, angle);
  }
  return block_pos_col;
}
  
//Funktion nimmt echte Koordinaten und Farbe und
//zeichnet einfach Rechtecke
function drawRects(rect_places, rect_colors) {
  color1 = rect_colors[0];
  color2 = rect_colors[1];
  color3 = rect_colors[2];
  for (let i = 0; i < rect_places.length-1; i+=2){
    rect_x = rect_places[i];
    let x_real = (rect_x*20)+30;
    rect_y = rect_places[i+1];
    let y_real = (rect_y*20)+10;
    fill(color1, color2, color3);
    rect(x_real, y_real, 20, 20);
  }
}
  
//Auf Kollision prüfen
function checkCollision(changed_x, changed_y, angle){
  let collision_part = [];
  
  if(playing_block.localeCompare("Q") === 0)
  {
    collision_part.push(changed_x, changed_y+2, changed_x+1, changed_y+2);
  }
  else if(playing_block.localeCompare("T") === 0){
    if(angle === 0){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+2, changed_x+1, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+2);
    }
    else if(angle === 2){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+1, changed_x+1, changed_y+1);
    }
    else if(angle === 3){
      collision_part.push(changed_x, changed_y+2, changed_x+1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("L") === 0){
    if(angle === 0){
      collision_part.push(changed_x-2, changed_y+1, changed_x-1, changed_y+1, changed_x, changed_y+2);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+1);
    }
    else if(angle === 2){
      collision_part.push(changed_x, changed_y+1, changed_x+1, changed_y+1, changed_x+2, changed_y+1);
    }
    else if(angle === 3){
      collision_part.push(changed_x, changed_y+3, changed_x+1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("I") === 0){
    if(angle === 0){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+1, changed_x+1, changed_y+1, changed_x+2, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x, changed_y+3);
    }
    else if(angle === 2){
      collision_part.push(changed_x-2, changed_y+1, changed_x-1, changed_y+1, changed_x, changed_y+1, changed_x+1, changed_y+1);
    }
    else if(angle === 3){
      collision_part.push(changed_x, changed_y+2);
    }
  }
  else if(playing_block.localeCompare("Z") === 0){
    if(angle === 0){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+2, changed_x+1, changed_y+2);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y+2, changed_x, changed_y+1);
    }
    else if(angle === 2){
      collision_part.push(changed_x-1, changed_y, changed_x, changed_y+1, changed_x+1, changed_y+1);
    }
    else if(angle === 3){
      collision_part.push(changed_x, changed_y+2, changed_x+1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("mZ") === 0){
    if(angle === 0){
      collision_part.push(changed_x-1, changed_y+2, changed_x, changed_y+2, changed_x+1, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+2);
    }
    else if(angle === 2){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+1, changed_x+1, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x, changed_y+1, changed_x+1, changed_y+2);
    }
  }
  else if(playing_block.localeCompare("mL") === 0){
    if(angle === 0){
      collision_part.push(changed_x-2, changed_y+1, changed_x-1, changed_y+1, changed_x, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x, changed_y+1, changed_x+1, changed_y+1);
    }
    else if(angle === 2){
      collision_part.push(changed_x, changed_y+2, changed_x+1, changed_y+1, changed_x+2, changed_y+1);
    }
    else if(angle === 3){
      collision_part.push(changed_x-1, changed_y+1, changed_x, changed_y+3);
    }
  }
    
  for(let i = 0; i < (collision_part.length-1); i+=2){
    let collide_x = collision_part[i];
    let collide_y = collision_part[i+1];
    let row = collide[collide_y];
    let placed = row[collide_x];
    //1 ist ein Block, 2 Boden
    if(placed === 1 || placed === 2){
      move_ok = false;
    }
  }
}
  
function keyPressed() {
  if (keyCode === UP_ARROW) {
    let changed_coords_x = (x-30)/20;
    let changed_coords_y = (y-10)/20;
    let testangle = playing_angle+1;
  
    //lässt sich alle rect-Koordinaten geben für einen Winkel weiter zum testen
    //schlägt Testrotation wegen Kollision fehl, wird nicht rotiert
    let blockdata = drawBlocks(playing_block, changed_coords_x, changed_coords_y, testangle);
    let rotate_block_positions = blockdata[0];
    let rotate_ok = true;
    for(let i = 0; i < (rotate_block_positions.length-1); i+=2){
      let collide_x = rotate_block_positions[i];
      let collide_y = rotate_block_positions[i+1];
      let row = collide[collide_y];
      let placed = row[collide_x];
      //1 ist ein Block, 2 Boden
      if(placed === 1 || placed === 2){
        rotate_ok = false;
      }
    }
      
    //ist der Test geglückt wird Winkel eins weiter gedreht
    if(rotate_ok === true){
      playing_angle++;
      if(playing_angle === 4){
        playing_angle = 0;
      }
    }
  }
  //Block nach links schieben und neu zeichnen falls keine Kollision links ist
  else if (keyCode === LEFT_ARROW) {
    let changed_coords_x = (x-30)/20;
    let changed_coords_y = (y-10)/20;
    let move_left = checkCollisionXLeft(changed_coords_x, changed_coords_y, playing_angle);
    if(move_left === true){
      x-=20;
      //console.log("x "+x);
  
      let blockdata = drawBlocks(playing_block, changed_coords_x, changed_coords_y, playing_angle);
      let plyaing_block_positions = blockdata[0];
      let plyaing_block_colors = blockdata[1];
      clear();
      background(0);
      drawRects(plyaing_block_positions, plyaing_block_colors);
      for (let j = 0; j < collide.length; j++){
        let row = collide[j];
        for (let i = 0; i < row.length; i++)
        {
          let placed = row[i];
          if(placed === 1)
          {
            rect_colors = fallen_blocks[j][i];
            drawRects([i, j], rect_colors);
          }
        }
      }
    }
  }
  //Block nach rechts schieben und neu zeichnen falls keine Kollision rechts
  else if (keyCode === RIGHT_ARROW) {
    let changed_coords_x = (x-30)/20;
    let changed_coords_y = (y-10)/20;
    let move_right = checkCollisionXRight(changed_coords_x, changed_coords_y, playing_angle);
    if(move_right === true){
      x+=20;
  
      let blockdata = drawBlocks(playing_block, changed_coords_x, changed_coords_y, playing_angle);
      let plyaing_block_positions = blockdata[0];
      let plyaing_block_colors = blockdata[1];
      clear();
      background(0);
      drawRects(plyaing_block_positions, plyaing_block_colors);
      for (let j = 0; j < collide.length; j++){
        let row = collide[j];
        for (let i = 0; i < row.length; i++)
        {
          let placed = row[i];
          if(placed === 1)
          {
            rect_colors = fallen_blocks[j][i];
            drawRects([i, j], rect_colors);
          }
        }
      }
    }
  }
  //Solange nach unten gedrückt wird beschleunigen
  //Timer für Fallevent stoppen und neuen kürzeren Timer beginnen
  else if (keyCode === DOWN_ARROW) {
    clearInterval(interval);
    timer = 50;
    interval = window.setInterval(advance, timer);
  }
  //Taste p, wenn gedrückt wird Spiel pausiert
  /*else if (keyCode === 80) {
    clearInterval(interval);
  }*/
}
 
//Funktion wird aufgerufen wenn eine Taste losgelassen wird
function keyReleased() {
  //Wird Pfeil Unten losgelassen dann wird der schnelle Falltimer gestoppt
  //und der lange wieder eingesetzt
  if (keyCode === DOWN_ARROW) {
    clearInterval(interval);
    timer = 550;
    interval = window.setInterval(advance, timer);
  }
}
 
//Wenn Pfeil links gedrückt wird, checkt Funktion auf Kollision links
function checkCollisionXLeft(changed_x, changed_y, angle) {
  let collision_part = [];
  
  if(playing_block.localeCompare("Q") === 0)
  {
    collision_part.push(changed_x-1, changed_y+1, changed_x-1, changed_y);
  }
  else if(playing_block.localeCompare("T") === 0){
    if(angle === 0){
      collision_part.push(changed_x-1, changed_y+1, changed_x-2, changed_y);
    }
    else if(angle === 1){
      collision_part.push(changed_x-2, changed_y, changed_x-1, changed_y-1, changed_x-1, changed_y+1);
    }
    else if(angle === 2){
      collision_part.push(changed_x-1, changed_y-1, changed_x-2, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x-1, changed_y-1, changed_x-1, changed_y, changed_x-1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("L") === 0){
    if(angle === 0){
      collision_part.push(changed_x-3, changed_y, changed_x-1, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x-2, changed_y, changed_x-1, changed_y-1, changed_x-1, changed_y-2);
    }
    else if(angle === 2){
      collision_part.push(changed_x-1, changed_y-1, changed_x-1, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x-1, changed_y, changed_x-1, changed_y+1, changed_x-1, changed_y+2);
    }
  }
  else if(playing_block.localeCompare("I") === 0){
    if(angle === 0){
      collision_part.push(changed_x-2, changed_y);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y-1, changed_x-1, changed_y, changed_x-1, changed_y+1, changed_x-1, changed_y+2);
    }
    else if(angle === 2){
      collision_part.push(changed_x-3, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x-1, changed_y-2, changed_x-1, changed_y-1, changed_x-1, changed_y, changed_x-1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("Z") === 0){
    if(angle === 0){
      collision_part.push(changed_x-2, changed_y, changed_x-1, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y-1, changed_x-2, changed_y, changed_x-2, changed_y+1);
    }
    else if(angle === 2){
      collision_part.push(changed_x-1, changed_y-1, changed_x-1, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x, changed_y-1, changed_x-1, changed_y, changed_x-1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("mZ") === 0){
    if(angle === 0){
      collision_part.push(changed_x-1, changed_y, changed_x-2, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y+1, changed_x-2, changed_y, changed_x-2, changed_y-1);
    }
    else if(angle === 2){
      collision_part.push(changed_x-2, changed_y, changed_x-1, changed_y-1);
    }
    else if(angle === 3){
      collision_part.push(changed_x-1, changed_y, changed_x-1, changed_y-1, changed_x, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("mL") === 0){
    if(angle === 0){
      collision_part.push(changed_x-3, changed_y, changed_x-1, changed_y-1);
    }
    else if(angle === 1){
      collision_part.push(changed_x-1, changed_y-1, changed_x-1, changed_y-2, changed_x-1, changed_y);
    }
    else if(angle === 2){
      collision_part.push(changed_x-1, changed_y, changed_x-1, changed_y+1);
    }
    else if(angle === 3){
      collision_part.push(changed_x-1, changed_y, changed_x-1, changed_y+1, changed_x-1, changed_y+2);
    }
  }
  let move_left = true;
  for(let i = 0; i < (collision_part.length-1); i+=2){
    let collide_x = collision_part[i];
    let collide_y = collision_part[i+1];
    let row = collide[collide_y];
    let placed = row[collide_x];
    //1 ist ein Block, 2 Boden
    if(placed === 1 || placed === 2){
      move_left = false;
    }
  }
  return move_left;
}
  
//Wenn Pfeil rechts gedrückt wird, checkt Funktion auf Kollision rechts
function checkCollisionXRight(changed_x, changed_y, angle) {
  let collision_part = [];
  
  if(playing_block.localeCompare("Q") === 0)
  {
    collision_part.push(changed_x+2, changed_y+1, changed_x+2, changed_y);
  }
  else if(playing_block.localeCompare("T") === 0){
    if(angle === 0){
      collision_part.push(changed_x+1, changed_y+1, changed_x+2, changed_y);
    }
    else if(angle === 1){
      collision_part.push(changed_x+1, changed_y-1, changed_x+1, changed_y, changed_x+1, changed_y+1);
    }
    else if(angle === 2){
      collision_part.push(changed_x+1, changed_y+1, changed_x+2, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x+1, changed_y-1, changed_x+2, changed_y, changed_x+1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("L") === 0){
    if(angle === 0){
      collision_part.push(changed_x+1, changed_y, changed_x+1, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x+1, changed_y-2, changed_x+1, changed_y-1, changed_x+1, changed_y);
    }
    else if(angle === 2){
      collision_part.push(changed_x+3, changed_y, changed_x+1, changed_y-1);
    }
    else if(angle === 3){
      collision_part.push(changed_x+2, changed_y, changed_x+1, changed_y+1, changed_x+1, changed_y+2);
    }
  }
  else if(playing_block.localeCompare("I") === 0){
    if(angle === 0){
      collision_part.push(changed_x+3, changed_y);
    }
    else if(angle === 1){
      collision_part.push(changed_x+1, changed_y-1, changed_x+1, changed_y, changed_x+1, changed_y+1, changed_x+1, changed_y+2);
    }
    else if(angle === 2){
      collision_part.push(changed_x+1, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x+1, changed_y-2, changed_x+1, changed_y-1, changed_x+1, changed_y, changed_x+1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("Z") === 0){
    if(angle === 0){
      collision_part.push(changed_x+1, changed_y, changed_x+2, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x+1, changed_y-1, changed_x+1, changed_y, changed_x, changed_y+1);
    }
    else if(angle === 2){
      collision_part.push(changed_x+1, changed_y-1, changed_x+2, changed_y);
    }
    else if(angle === 3){
      collision_part.push(changed_x+2, changed_y-1, changed_x+2, changed_y, changed_x+1, changed_y+1);
    }
  }
  else if(playing_block.localeCompare("mZ") === 0){
    if(angle === 0){
      collision_part.push(changed_x+2, changed_y, changed_x+1, changed_y+1);
    }
    else if(angle === 1){
      collision_part.push(changed_x+1, changed_y+1, changed_x+1, changed_y, changed_x, changed_y-1);
    }
    else if(angle === 2){
      collision_part.push(changed_x+1, changed_y, changed_x+2, changed_y-1);
    }
    else if(angle === 3){
      collision_part.push(changed_x+2, changed_y, changed_x+2, changed_y+1, changed_x+1, changed_y-1);
    }
  }
  else if(playing_block.localeCompare("mL") === 0){
    if(angle === 0){
      collision_part.push(changed_x+1, changed_y-1, changed_x+1, changed_y);
    }
    else if(angle === 1){
      collision_part.push(changed_x+1, changed_y-1, changed_x+1, changed_y-2, changed_x+2, changed_y);
    }
    else if(angle === 2){
      collision_part.push(changed_x+3, changed_y, changed_x+1, changed_y+1);
    }
    else if(angle === 3){
      collision_part.push(changed_x+1, changed_y, changed_x+1, changed_y+1, changed_x+1, changed_y+2);
    }
  }
  let move_right = true;
  for(let i = 0; i < (collision_part.length-1); i+=2){
    let collide_x = collision_part[i];
    let collide_y = collision_part[i+1];
    let row = collide[collide_y];
    let placed = row[collide_x];
    //1 ist ein Block, 2 Boden
    if(placed === 1 || placed === 2){
      move_right = false;
    }
  }
  return move_right;
}
   
//Funktion trägt neue Blöcke in collide mit 1 an allen Positionen
//ein wo Rechtecke sitzen und in fallen_blocks[] die rect-Farbe
function fixBlocks(block_coords, color_array) {
  for (let i = 0; i < block_coords.length; i+=2){
    rect_x = block_coords[i];
    rect_y = block_coords[i+1];
    collide[rect_y][rect_x] = 1;
    fallen_blocks[rect_y][rect_x] = color_array;
  }
}
  
//Prüft auf Komplettierung, Collide wird komplett durchlaufen
//und Zeilen die nicht die Summe 10 haben werden in ein temporäres Array
//geschrieben, Zeilen mit Summe 10 sind komplett und werden "vergessen"
//Nach der Prüfung werden die 2 temporären Arrays in collide[] und
//fallen_blocks[] zurückgeschrieben und neu gezeichnet
function checkCompletion(){
  let temp_index = collide.length-1;
  let collide_temp = [
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
  ];
  let fallen_blocks_temp = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];
  
  //Zeilensumme aufsummieren
  for (let j = collide.length-1; j >= 0; j--){
    let row = collide[j];
    let row_length = row.length;
    let max_row_sum = row_length - 2;
    let fallen_color = fallen_blocks[j];
    let row_sum = 0;
    for (let i = 0; i < row.length; i++)
    {
      let placed = row[i];
      if(placed === 1)
      {
        row_sum++;
      }
    }
    //wenn Summe nicht 10, dann Zeile behalten
    //!==10, 23x1, 2x2
    if(row_sum !== max_row_sum){
      collide_temp[temp_index] = row;
      fallen_blocks_temp[temp_index] = fallen_color;
      temp_index--;
    }
    //sonst wird Zeile gelöscht und Punktzahl +100
    else{
      score+=100;
    }
  }
  
  //Temproräre Arrays zurückschreiben
  for (let j = 0; j < collide.length; j++){
    let temp_row = collide_temp[j];
    let temp_color = fallen_blocks_temp[j];
    collide[j] = temp_row;
    fallen_blocks[j] = temp_color;
  }
  
  //und neu Zeichnen lassen
  for (let j = 0; j < collide.length; j++){
    let row = collide[j];
    for (let i = 0; i < row.length; i++)
    {
      let placed = row[i];
      if(placed === 1)
      {
        let rect_colors = fallen_blocks[j][i];
        drawRects([i, j], rect_colors);
      }
    }
  }
}
