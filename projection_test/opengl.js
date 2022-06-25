// Linda Duong

// Matrix and Drawing Library

// Begin by using the matrix transformation routines from part A of this project.
// You should modify the new routines listed below to complete the assignment.
// Feel free to define any classes, global variables and helper routines that you need.

let ctm = [[],[],[],[]];
//let new_ctm = [[],[],[],[]];
let perspOrOrtho = 0;
let vertexArray = [];
let fov = 0;
let n = 0;
let f = 0;
let l = 0;
let r = 0;
let b = 0;
let t = 0;
let xP1 = 0;
let xP2 = 0;
let yP1 = 0;
let yP2 = 0;
let xdP1 = 0;
let xdP2 = 0;
let ydP1 = 0;
let ydP2 = 0;


function BeginShape(dummy_value) {
  // starts recording of drawing
  // global data structure for vertices
  // reinitiliaze data structure
  vertexArray = [];
}

function EndShape(dummy_value) {
  // ends recording of drawing
  for (let i = vertexArray.length - 1; i >=0; i -= 2) {
    // transformation already applied in vertex function
    let vertexOne = vertexArray[i];
    let vertexTwo = vertexArray[i - 1];
    // perspective = 1
    if (perspOrOrtho == 1) {
      k = Math.tan(fov/2);
      xP1 = vertexOne[0] / abs(vertexOne[2]);
      yP1 = vertexOne[1] / abs(vertexOne[2]);
      
      xDP1 = (xP1 + k) * (width/(2 * k));
      yDP1 = (yP1 + k) * (height/(2 * k));
      
      xP2 = vertexTwo[0] / abs(vertexTwo[2]);
      yP2 = vertexTwo[1] / abs(vertexTwo[2]);
      
      xDP2 = (xP2 + k) * (width/(2 * k));
      yDP2 = (yP2 + k) * (height/(2 * k));
      
      line(xDP1, height - yDP1, xDP2, height - yDP2);
    }
    // ortho = 2
    if (perspOrOrtho == 2) {
      xP1 = (vertexOne[0] - l) * width/(r - l);
      yP1 = (vertexOne[1] - b) * height/(t - b);
      
      xP2 = (vertexTwo[0] - l) * width/(r - l);
      yP2 = (vertexTwo[1] - b) * height/(t - b);
      
      line(xP1, height - yP1, xP2, height - yP2);
    }
  }
}

function Vertex(x, y, z) {
  // used between BeginShape() and EndShape()
  // applying transformation to ctm
  let vtx = [];
  vtx = multiplyVector(ctm, [x, y, z, 1]);
  //console.log("ctm trans");
  vertexArray.push([vtx[0], vtx[1], vtx[2]]);
}

function Perspective(field_of_view, near, far) {
  // store fov, near, far as global variables
  n = near;
  f = far;
  fov = field_of_view * PI / 180;
  perspOrOrtho = 1;
}

function Ortho (left, right, bottom, top, near, far) {
  // store left, right, bottom, top, near, far as global variables
  l = left;
  r = right;
  b = bottom;
  t = top;
  n = near;
  f = far;
  perspOrOrtho = 2;
}

function Init_Matrix()
{
  ctm = [ 
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
   ];
}

function Translate(x, y, z)
{
  let t = [
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1]
  ];
  multiplyMatrix(ctm, t);
}

function Scale(x, y, z)
{
  let s = [
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1]
  ];
  multiplyMatrix(ctm, s);
}

function RotateX(theta)
{
  const toAngle = PI/180;
  let x = theta * toAngle;
  let rotate = [
    [1, 0, 0, 0],
    [0, Math.cos(x), -1 * Math.sin(x), 0],
    [0, Math.sin(x), Math.cos(x), 0],
    [0, 0, 0, 1]
   ];
   multiplyMatrix(ctm, rotate);
}

function RotateY(theta)
{
  const toAngle = PI/180;
  let x = theta * toAngle;
  let rotate = [
    [Math.cos(x), 0, Math.sin(x), 0],
    [0, 1, 0, 0],
    [-1 * Math.sin(x), 0, Math.cos(x), 0],
    [0, 0, 0, 1]
   ];
   multiplyMatrix(ctm, rotate);
}

function RotateZ(theta)
{
  const toAngle = PI/180;
  let x = theta * toAngle;
  let rotate = [
    [Math.cos(x), -1 * Math.sin(x), 0, 0],
    [Math.sin(x), Math.cos(x), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
   ];
   multiplyMatrix(ctm, rotate);
}

function Print_Matrix()
{
  console.log("Current Matrix:\n");
  // add code here!
  let result = "";
  for (let row = 0; row < ctm.length; row++) {
    for (let col = 0; col < ctm[row].length; col++) {
      if (col > 0) {
        result += ctm[row][col] + " ";
      }
      if (col == 0) {
        result = ctm[row][col] + " ";
      }
    }
    console.log(result);
  }
  console.log("\n");
}

function multiplyMatrix(matrix1, matrix2) {
  let new_ctm = [[],[],[],[]];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      new_ctm[row][col] = 
        matrix1[row][0] * matrix2[0][col] + 
        matrix1[row][1] * matrix2[1][col] + 
        matrix1[row][2] * matrix2[2][col] + 
        matrix1[row][3] * matrix2[3][col];
    }
  }
  ctm = new_ctm;
}

function multiplyVector(matrix, vector) {
  let result = [0, 0, 0, 0];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < vector.length; j++) {
      result[i] += matrix[i][j] * vector[j];
      //console.log("vector mult");
      //console.log(matrix[i][j]);
      //console.log(vector[j]);
    }
  }
  //console.log(result);
  return result;
}
