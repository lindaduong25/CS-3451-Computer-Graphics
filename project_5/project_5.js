// Provided code for Project 5

let tetra,octa,icosa,star,torus;

let animate_flag = 1; // automatic rotation
let normal_flag = 0; // for vertShading
let random_flag = 0; // whether to color white or random colors

let geo = [];
let faces = [];
let randColors = [];
let currMesh;

let time = 0;  // records the passage of time, used to move the objects

// read in the polygon mesh files
function preload() {
  tetra = loadStrings('assets/tetra.txt');
  octa = loadStrings('assets/octa.txt');
  icosa = loadStrings('assets/icosa.txt');
  star = loadStrings('assets/star.txt');
  torus = loadStrings('assets/torus.txt');
}

// called once at the start of the program
function setup() {
  createCanvas(600, 600, WEBGL);
  
  let fov = 60.0;  // 60 degrees field of view
  perspective(PI * fov / 180.0, width / height, 0.1, 2000);
   
}

// handle key press commands
function keyPressed() {
  console.log ("key pressed\n");
  switch(key) {
    case ' ':  animate_flag = 1 - animate_flag; break;
    case '1':  parse_polys(tetra); break;
    case '2':  parse_polys(octa); break;
    case '3':  parse_polys(icosa); break;
    case '4':  parse_polys(star); break;
    case '5':  parse_polys(torus); break;
    case 'd':  create_dual(); break;
    case 'n':  normal_flag = 1 - normal_flag; break;
    case 'r':  random_flag = 1 - random_flag; break;
    case 'q':  debugger; break;
  }
}

// called repeatedly to create new per-frame images
function draw() {
  
  background(0, 0, 0);  // black background
  
  // set the virtual camera position
  //camera(0, 0, 85, 0, 0, 0, 0, 1, 0);  // from, at, up
  camera (0.0, 0.0, 5.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0);
  scale (0.75, -0.75, 0.75);
  
  // include a little bit of light even in shadows
  ambientLight(100, 100, 100);
  
  // set the light position
  pointLight(255, 255, 255, 100, -100, 300);
  pointLight(255, 255, 255, -100, 100, -300);
   
  noStroke();  // don't draw polygon outlines
  
  fill(255, 255, 255);
  
  push();
  
  let mesh_axis = createVector (0, 1, 0);
  rotate (-time, mesh_axis);
  
  // (eventually you should remove these lines)
  if (currMesh == null) {
    beginShape();
    vertexNormal (0, 0, 1);
    vertex (-25, -25, 0);
    vertexNormal (0, 0, 1);
    vertex (-25, 25, 0);
    vertexNormal (0, 0, 1);
    vertex (25, 25, 0);
    vertexNormal (0, 0, 1);
    vertex (25, -25, 0);
    endShape (CLOSE);
  // (eventually you should remove these lines)
  } else {
    // this is where you should draw your collection of polygons
    let geo = currMesh.geo;
    //console.log({geo});
    let faces = currMesh.faces;
    
    //console.log({geo});
    //console.log({faces});
    
    for (let i = 0; i < currMesh.face_count; i++) {
      let v1 = geo[faces[i * 3]];
      let v2 = geo[faces[(i * 3) + 1]];
      let v3 = geo[faces[(i*3) + 2]];
      let faceNormal = faceNorm(v1, v2, v3);
      let vertNormal1 = vertNormal(i*3);
      let vertNormal2 = vertNormal((i*3)+1);
      let vertNormal3 = vertNormal((i*3)+2);
      //console.log({vertNormal1});
      
      if (random_flag == 0) {
        fill(200, 200, 200);
      } else {
        let coloring = randColors[i];
        //console.log("randColors:" + randColors);
        fill(coloring.x, coloring.y, coloring.z);
      }
      beginShape();
      // surface normal
      if (normal_flag == 0) {
        vertexNormal(faceNormal.x, faceNormal.y, faceNormal.z);
        vertex(v1.x, v1.y, v1.z);
        vertex(v2.x, v2.y, v2.z);
        vertex(v3.x, v3.y, v3.z); 
      }
      // vertex normal
      if (normal_flag == 1) {
        vertexNormal(v1.x, v1.y, v1.z);
        vertex(v1.x, v1.y, v1.z);
        vertexNormal(v2.x, v2.y, v2.z);
        vertex(v2.x, v2.y, v2.z);
        vertexNormal(v3.x, v3.y, v3.z);
        vertex(v3.x, v3.y, v3.z);
      }
      endShape(CLOSE);
    }  
  } 
  pop();
  
  // maybe update time
  if (animate_flag) {
    time += 0.02;
  }
}

// surface normals
function faceNorm(a, b, c) {
  //console.log({a});
  //console.log({b});
  //console.log({c});
  //n = AB cross AC
  let AB = createVector((b.x-a.x),(b.y-a.y),(b.z-a.z));
  //console.log("b.x:" + b.x);
  let AC = createVector((c.x-a.x),(c.y-a.y),(c.z-a.z));
  let n = p5.Vector.cross(AB, AC).normalize();
  return n;
}

function vertNormal(v){
   let n = createVector(0,0,0);
   let N = createVector(0,0,0);
   let faces = currMesh.faces;
   let geo = currMesh.geo;
    for(let i = 0; i < faces.length / 3; i++){
       let a = geo[faces[i*3]];
       let b = geo[faces[(i*3)+1]];
       let c = geo[faces[(i*3)+2]];
       //console.log({a});
       //console.log({b});
       //console.log({c});
       let faceNormal = faceNorm(a,b,c);
       //console.log({faceNormal});
       let check1 = (i == v);
       let check2 = (i + 1 == v);
       let check3 = (i + 2 == v);
       if(check1 || check2 || check3) {
         N = p5.Vector.add(n, faceNormal).normalize;
       }
    } 
    return N;
}

function generateRandColors(faces) {
  let coloring = [];
  for (let i = 0; i < faces.length; i++) {
    let r = random(255);
    let g = random(255);
    let b = random(255);
    coloring = createVector(r, g, b);
    randColors[i] = coloring;
  }
  return randColors;
}

class Vertex{
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Mesh {
  constructor(geo, faces, vertex_count, face_count) {
    this.geo = geo; 
    this.faces = faces;
    this.vertex_count = vertex_count;
    this.face_count = face_count;
  }
  
  // helper functions
  
  makeOTable(faces) {
    //console.log("faces length:" + faces.length);
    let oTable = [];
    for (let i = 0; i < faces.length; i++) {
      oTable.push(-1);
    }
    for (let i = 0; i < faces.length; i++) {
      for (let j = 0; j < faces.length; j++) {
        if (i != j) {
          let check1 = faces[next(i)] == faces[previous(j)];
          let check2 = faces[previous(i)] == faces[next(j)];
          if (check1 && check2) {
            //console.log("i:" + i);
            //console.log("j:" + j);
            //console.log("prevI:" + previous(i));
            //console.log("nextJ:" + next(j));
            oTable[i] = j;
            oTable[j] = i;
          }
        }
      }
    }
    return oTable;
  }
}

function next(cid) {
  return (3 * (int(cid/3)) + (cid + 1)%3); // if cid = 6 - > 6 + 2 = 8
}

function previous(cid) {
  return next(next(cid));
}

function swing(cid, opp) {
  return next(opp[next(cid)]);
}


// Parse a polygon mesh file.
//
// This function currently prints the vertices and faces to the console,
// but you should modify it to save this data in your own mesh data structure.
function parse_polys(s)
{
  
  console.log ("in read_polys()");
  
  let vertex_count,face_count;
  let tokens = [];

  // go through all the lines in the file and separate the tokens
  for (let i = 0; i < s.length; i++) {
    tokens[i] = s[i].split(" ");
    //console.log (tokens[i]);
  }

  vertex_count = parseInt(tokens[0][1]);
  face_count = parseInt(tokens[1][1]);
  
  console.log ("vertex count = " + vertex_count);
  console.log ("face count = " + face_count);
  
  // read in the vertex coordinates
  geo = [];
  for (let i = 0; i < vertex_count; i++) {
    let tlist = tokens[i+2];
    let x = parseFloat(tlist[0]);
    let y = parseFloat(tlist[1]);
    let z = parseFloat(tlist[2]);
    let vertex = new Vertex(x, y, z);
    geo.push(vertex);
    console.log ("xyz: " + x + " " + y + " " + z);
  }

  // read in the face indices
  faces = [];
  for (let i = 0; i < face_count; i++) {
    let tlist = tokens[i + vertex_count + 2];
    let nverts = parseInt(tlist[0]);
    // checking first if face is a triangle
    if (nverts != 3) {
      return;
    }
    let v1 = parseInt(tlist[1]);
    let v2 = parseInt(tlist[2]);
    let v3 = parseInt(tlist[3]);
    faces[3*i] = v1;
    faces[(3*i)+1] = v2;
    faces[(3*i)+2] = v3;
    console.log ("verts: " + v1 + " " + v2 + " " + v3);
  }
  
  //console.log({geo});
  //console.log({faces});
  randColors = generateRandColors(faces);
  currMesh = new Mesh(geo, faces, vertex_count, face_count);
  //console.log("geo:" + currMesh.geo);
  //console.log("faces:" + currMesh.faces);
  console.log ("end of read_polys()");
}

// This function should produce the triangulated dual of your current mesh
function create_dual() {
  
  //First, you will want to calculate the centroid of each triangle. 
  //These triangle centroids will become some of the vertices in your dual mesh. 
  //Usually, you would then travel around a given vertex of the original mesh, 
  //connecting together these triangle centroids into a dual face. Unfortunately 
  //this would sometimes create faces with more than three edges, and we want to 
  //restrict this project to only triangles. To avoid this, you should triangulate 
  //a given dual face by calculating a new vertex that is the average of the 
  //triangle centroids. Then create the collection of new triangles that together 
  //form the dual face. Once you have created a new triangulated dual face for each 
  //vertex of the original mesh, you will have completed the triangulated dual mesh.
  
  
  let geo = currMesh.geo;
  //console.log({geo});
  let faces = currMesh.faces;
  //console.log({faces});
  let oTable = currMesh.makeOTable(faces);
  //console.log({oTable});
  
  let new_vertex_count;
  let new_faces_count;
  let newGeoList = [];
  let newFaceList = [];
  
  let newFaces = []; // final faces list that will be passed into new Mesh()
  let newGeo = []; // final vertices list that will be passed into new Mesh()
  
  let centroidMap = new Map();
  
  //console.log({faces});
  //console.log("faces length:" + faces.length);
  for (let i = 0; i < faces.length / 3; i++) {
    let i1 = geo[faces[i*3]];
    let i2 = geo[faces[(3*i)+1]];
    let i3 = geo[faces[(3*i)+2]];
    
    //console.log({i1});
    //console.log({i2});
    //console.log({i3});
    //console.log(i1.x);
    //console.log(i2.x);
    //console.log(i3.x);
    
    // finding centroid
    let x = (i1.x + i2.x + i3.x) / 3.0;
    let y = (i1.y + i2.y + i3.y) / 3.0;
    let z = (i1.z + i2.z + i3.z) / 3.0;
    //let centroid = findCentroid(i1, i2, i3);
    let centroid = new Vertex(x, y, z);
    
    //console.log({centroid});
    // checking duplicates
    if (!centroidMap.has(centroid)) {
      newGeoList.push(centroid);
      centroidMap.set(centroid, newGeoList.length -1);
    }
  }
  
  // collection of new triangles
  for (let j = 0; j < geo.length; j++) {
    let triangle = 0;
    for (let k = 0; k < faces.length; k++) {
      if (faces[k] == j) {
        triangle = k; // starting corner to swing from
        break;
      }
    }
  
    let tri = []; // for collection of triangles
    //console.log({triangle});
    // swinging to get points around the centerpoint
    tri.push(triangle);
    let curr = swing(triangle, oTable);
    //console.log({curr});
    //console.log({triangle});
    //console.log({oTable});
    while (curr != triangle) {
      //console.log("test");
      tri.push(curr);
      curr = swing(curr, oTable);
    }
  
    console.log({tri});
    let result = new Vertex(0,0,0);
    // tri is the corner list
    for (let i = 0; i < tri.length; i++) {
      // triangle ID for newGeoList
      
      let j = int(tri[i] / 3); // face corresponding to vertex i
      //console.log({j});
      let centr = newGeoList[j];
      //console.log({newGeoList});
      //console.log({centr});
      
      let centrX = centr.x;
      let centrY = centr.y;
      let centrZ = centr.z;
      result.x += centrX;
      result.y += centrY;
      result.z += centrZ;
    }
    
    // getting average
    let a = result.x / tri.length;
    let b = result.y / tri.length;
    let c = result.z / tri.length;
    
    let average = new Vertex(a, b, c);
    // checking duplicates
    if (!centroidMap.has(average)) {
      newGeoList.push(average);
      centroidMap.set(average, newGeoList.length -1);
    }
    
    for (let i = 0; i < tri.length; i++) {
      let j = int(tri[i % tri.length] / 3);
      let helper = (i+1)%tri.length;
      let k = int((tri[helper]) / 3);
      
      newFaceList.push(j);
      newFaceList.push(k);
      newFaceList.push(newGeoList.length - 1);
    }
   
  }
  
  new_vertex_count = newGeoList.length;
  new_faces_count = newFaceList.length/3;
  
  for (let i = 0; i < new_vertex_count; i++) {
    newGeo.push(newGeoList[i]);
  }
  
  for (let i = 0; i < newFaceList.length; i++) {
    newFaces.push(newFaceList[i]);
  }
  
  // updates the mesh
  randColors = generateRandColors(newFaces);
  // 1st test case
  //console.log({newGeo}); // should be 8
  //console.log({newFaces}); // should be 36
  // total triangle 12
  // total corners 36
  currMesh = new Mesh(newGeo, newFaces, new_vertex_count, new_faces_count);
  ////console.log({currMesh});
}
