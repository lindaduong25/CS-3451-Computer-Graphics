// Sample code for Project 2A
// Draws 3D Primitives (box, cylinder, sphere, cone, torus)


let time = 0;  // track the passage of time, used to move the objects

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
  camera(0, 0, 85, 0, 0, 0, 0, 1, 0);  // from, at, up
  
  // include some light even in shadows
  ambientLight(60, 60, 60);
  
  // set light position
  pointLight(255, 255, 255, 100, -100, 300);

  noStroke();  // do not draw polygon outlines
  
  push();
  rotateY(time * 2);
  
  // body
  fill(255,150,200);
  push();
  translate(0, 0, 3);
  scale(20.0);
  rotateZ(6);
  sphere(1);
  pop();
  
  // upper left leg
  fill(255,150,200);
  push();
  translate(5.8, 15, 0);
  rotateZ(13);
  cylinder(0.5, 10);
  pop();
  
  //upper right leg
  fill(255,150,200);
  push();
  translate(7.2, 13, 3);
  rotateZ(13);
  cylinder(0.5, 15);
  pop();
  
  // lower left leg
  fill(255,150,200);
  push();
  translate(6.48, 29, 0);
  rotateZ(6);
  cylinder(0.5, 20);
  pop();
  
  // lower right leg
  fill(255,150,200);
  push();
  translate(7, 29, 3);
  rotateZ(6);
  cylinder(0.5, 20);
  pop();
  
  // right foot
  fill(255,150,200);
  push();
  translate(12, 38.5);
  rotateZ(30);
  cone(0.5, 5);
  pop();
  
  // left foot
  fill(255,150,200);
  push();
  translate(12, 39, 3);
  rotateZ(30);
  cone(0.5, 5);
  pop();
  
  // lower neck
  fill(255,150,200);
  push();
  translate(15, -12);
  rotateZ(13);
  cylinder(1, 13);
  pop();
  
  // upper neck
  fill(255,150,200);
  push();
  translate(17.64, -23.5, 0);
  cylinder(1, 12);
  pop();
  
  // head
  fill(255,150,200);
  push();
  translate(18, -32, 0);
  rotateZ(6);
  sphere(5);
  pop();
  
  // upper part of beak
  fill(255, 204, 0);
  push();
  translate(25, -30, 0);
  rotateZ(30);
  cone(1, 5);
  pop();
  
  // lower part of beak
  fill(51);
  push();
  translate(26, -27.5, 0);
  rotateZ(TWO_PI);
  cone(1, 5);
  pop();
  
  //tail
  fill(255,150,200);
  push();
  translate(-18, 18, 3);
  rotateZ(PI/4);
  cone(15, 30, 24, 24);
  pop();
  
  //right eye 
  fill(51);
  push();
  translate(22, -32, 3.5);
  sphere(1);
  pop();
  
  //left eye 
  fill(51);
  push();
  translate(20, -32, -5);
  sphere(1);
  pop();
  
  // left wing
  fill(255,150,200);
  push();
  translate(-8, -9, -13);
  scale(2.5);
  rotateX(5 * PI/4);
  cone(3, 10);
  pop();
  
  // right wing
  fill(255,150,200);
  push();
  translate(10, -10, 18);
  scale(2.5);
  rotateX(11 * PI/4);
  cone(3, 10);
  pop();
   
  time += 0.01;  // update the time
  pop();
  
}
