// Matrix Library (for you to write!)

// You should modify the routines listed below to complete the assignment.
// Feel free to define any classes, global variables and helper routines that you need.

let ctm = [[],[],[],[]];
let new_ctm = [[],[],[],[]];

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
