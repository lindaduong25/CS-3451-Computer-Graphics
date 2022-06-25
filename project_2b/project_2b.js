// Sample code for Project 2A
// Draws 3D Primitives (box, cylinder, sphere, cone, torus)

// Project 2B

// Plot
// Instead of flamingo hunting for fish
// Big fish will hunt for the flamingo while being swarmed by other smaller fish
// Flamingo will run away, flamingo escapes but tail bitten off

// Object Motions
// 1) Flamingo's wings flapping
// 2) Flamingo's whole body is moving forward as time passes
// 2) Small fish moving and rotating
// 3) Big fish moving and rotating


let time = 0;  // track the passage of time, used to move the objects
let x = 0;     // x coordinate to make fish move

function draw_fish() {
  // draws one fish
  fill(255, 165, 0);
  translate(-30, 9, 10);
  sphere(2);
  translate(1, -1, 0);
  rotateZ(PI/3);
  cone(1, 5);
  translate(0.5, 0, 0);
  rotateZ(PI/4);
  cone(1, 5);
  fill(56);
  translate(0.3, 2.5, 1);
  sphere(0.5);
  fill(56);
  translate(0, 0, -2);
  sphere(0.5);
}


function flamingo_head() {
  //right eye 
  fill(51);
  push();
  translate(22 + 10 * time, -32, 3.5);
  sphere(1);
  pop();
  
  //left eye 
  fill(51);
  push();
  translate(20 + 10 * time, -32, -5);
  sphere(1);
  pop();
  
  // head
  fill(255,150,200);
  push();
  translate(18 + 10 * time, -32, 0);
  rotateZ(6);
  sphere(5);
  pop();
  
  // upper part of beak
  fill(255, 204, 0);
  push();
  translate(25 + 10 * time, -30, 0);
  rotateZ(30);
  cone(1, 5);
  pop();
  
  // lower part of beak
  fill(51);
  push();
  translate(26 + 10 * time, -27.5, 0);
  rotateZ(TWO_PI);
  cone(1, 5);
  pop();
}


function camera_motion(){
  // use time variable to determine where camera should be during animation
  
  // console.log(time);
  
  //camera(0, 0, 85 * time, 0, 0, 0, 0, 1 * time, 0);
  if (time <= 30) {
    camera(0 - time * 30, 0, 200, -20, 50, 0, 0, 1, 0);
  }
}



function fish_swimming(t) {
  translate(3 * t, 0, 0);
  t += 1;
}

// called once at the start
function setup() {
  createCanvas(600, 600, WEBGL);
  
  let fov = 60.0;  // 60 degrees FOV
  perspective(PI * fov / 180.0, width / height, 0.1, 2000);
}

// this is called repeatedly to draw new per-frame images
function draw() {
  
  background(120, 200, 255);  // light blue background
  
  // set the virtual camera position
  //camera(0, 0, 85, 0, 0, 0, 0, 1, 0);  // from, at, up
  camera_motion();
  
  // include some light even in shadows
  ambientLight(60, 60, 60);
  
  // additional light source
  directionalLight(128, 128, 128, 0, 0, -1);
  
  // set light position
  pointLight(255, 255, 255, 100, -100, 300);

  noStroke();  // do not draw polygon outlines
  
  push();
  //rotateY(time * 2);
  
  // flamingo head
  flamingo_head();
  
  // body
  fill(255,150,200);
  push();
  translate(0 + 10 * time, 0, 3);
  scale(20.0);
  rotateZ(6);
  sphere(1);
  pop();
  
  // upper left leg
  fill(255,150,200);
  push();
  translate(5.8 + 10 * time, 15, 0);
  rotateZ(13);
  cylinder(0.5, 10);
  pop();
  
  //upper right leg
  fill(255,150,200);
  push();
  translate(7.2 + 10 * time, 13, 3);
  rotateZ(13);
  cylinder(0.5, 15);
  pop();
  
  // lower left leg
  fill(255,150,200);
  push();
  translate(6.48 + 10 * time, 29, 0);
  rotateZ(6);
  cylinder(0.5, 20);
  pop();
  
  // lower right leg
  fill(255, 150,200);
  push();
  translate(7 + 10 * time, 29, 3);
  rotateZ(6);
  cylinder(0.5, 20);
  pop();
  
  // right foot
  fill(255,150,200);
  push();
  translate(12 + 10 * time, 38.5);
  rotateZ(30);
  cone(0.5, 5);
  pop();
  
  // left foot
  fill(255, 150,200);
  push();
  translate(12 + 10 * time, 39, 3);
  rotateZ(30);
  cone(0.5, 5);
  pop();
  
  // lower neck
  fill(255,150,200);
  push();
  translate(15 + 10 * time, -12);
  rotateZ(13);
  cylinder(1, 13);
  pop();
  
  // upper neck
  fill(255,150,200);
  push();
  translate(17.64 + 10 * time, -23.5, 0);
  cylinder(1, 12);
  pop();
  
  //tail
  fill(255,150,200);
  push();
  //translate(-18 + 10 * time, 18 - 5 * time, 3);
  translate(-18 + 10 * time, 18, 3);
  //rotateZ(20 * time);
  rotate(PI/4);
  //cone(15 - 2 * time, 30, 24, 24);
  cone(15, 30, 24, 24);
  pop();
  
  
  // left wing
  fill(255,150,200);
  push();
  translate(-8 + 10 * time, -9, -13);
  scale(2.5);
  rotateX(5 * PI/4);
  let cone_axis = createVector(-10, 300, 0);
  rotate(90 * time, cone_axis);
  cone(3, 10);
  pop();
  
  // right wing
  fill(255,150,200);
  push();
  translate(10 + 10 * time, -10, 18);
  scale(2.5);
  rotateX(11 * PI/4);
  let cone2_axis = createVector(-10, 300, 0);
  rotate(90 * time, cone2_axis);
  cone(3, 10);
  pop();
  
  
  //// big big big fish
  //push();
  //translate(0, -80, 5);
  //scale(9);
  //fish_swimming(10 * time);
  //fish_eats_flamingo();
  //pop();
  
  time += 0.01;  // update the time
  pop();
  
  // instancing fish 
 
  push();
  rotateY(time * 3);
  
  
  push();
  translate(0, 10, 0);
  fish_swimming(3 * time);
  draw_fish();
  pop();
  

  push();
  translate(0, 10, 0);
  fish_swimming(2 * time);
  draw_fish();
  pop();
  
  push();
  translate(0, 20, 0);
  rotateZ(PI/2);
  fish_swimming(2 * time);
  draw_fish();
  pop();
  
  translate(-20, 30, 2);
  rotate(PI);
  push();
  fish_swimming(2 * time);
  draw_fish();
  pop();
  
  translate(40, 3, 2);
  rotate(PI/3);
  push();
  fish_swimming(time);
  draw_fish();
  pop();
  
  translate(5, -10, 2);
  rotate(PI/4);
  push();
  fish_swimming(time);
  draw_fish();
  pop();
  
  translate(-30, 0, 6);
  rotate(PI/6);
  push();
  fish_swimming(2.5 * time);
  draw_fish();
  pop();
  
  translate(-20 * time, 60, -20);
  push();
  fish_swimming(time * 6);
  draw_fish();
  pop();
  
  pop();
  
  fill(0, 0, 255);
  translate(0, 325, 0);
  rotateZ(PI);
  push();
  box(600, 600, 1000);
  pop();
  
  // big fish 
  if (time > 3) {
    push();
    fish_swimming(5 * time);
    fish_eats_flamingo();
    pop();
  }
  
  // fish moves toward flamingo faster
  if (time > 4) {
    translate(0, -30 * 2 * time, 0);
    push();
    fish_swimming(2 * time);
    pop();
  }
  //console.log(frameCount);
 
 
}

function fish_eats_flamingo() {
  translate(20 * -1 * time, 0 + 18 * time, -15);
  rotateX(time * 4);
  rotateZ(time * 2);
  scale(10);
  //fish_swimming(10 * time);
  draw_fish();
}
