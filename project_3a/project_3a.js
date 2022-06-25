// these are the routines that you should write for the project


let fov = 0;
let background;
let sceneObjects = [];
let lights = [];
let materials;


function reset_scene() {
  sceneObjects = [];
  lights = [];
  fov = 0;
  background = createVector(0,0,0);
}

function set_background (r, g, b) {
  background = createVector(r, g, b);
}

function set_fov (angle) {
  fov = angle;
}

function new_light (r, g, b, x, y, z) {
  let light = new Light(r, g, b, x, y, z);
  lights.push(light);
}

function new_material (dr, dg, db,  ar, ag, ab,  sr, sg, sb,  pow,  k_refl) {
  
  materials = new Material(dr, dg, db, ar, ag, ab, sr, sg, sb, pow, k_refl);
}

function new_cylinder (x, y, z, radius, h) {
  let shape = new Cylinder(x, y, z, radius, h);
  sceneObjects.push(shape);
}

// class for light
class Light { 
  constructor(r, g, b, x, y, z, pos) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.z = z;
    this.pos = createVector(x, y, z);
  }
}

class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }
}

class Material {
  constructor(dr, dg, db,  ar, ag, ab,  sr, sg, sb,  pow,  k_refl) {
  this.dr = dr;
  this.dg = dg;
  this.db = db;
  this.ar = ar;
  this.ag = ag;
  this.ab = ab;
  this.sr = sr;
  this.sg = sg;
  this.sb = sb;
  this.pow = pow;
  this.k_refl = k_refl;
  }
}

class Cylinder {
  constructor(x, y, z, radius, h, pos, material) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.h = h;
    this.pos = createVector(x, y, z);
    this.material = materials;
  }
  
  
  // ray-cylinder intersection
  intersect(ray) {
    let a = 0;
    let b = 0;
    let c = 0;
    let num1 = 0;
    let num2 = 0;
    let t = 0;
    let discriminant = 0;
    let checkT1 = 0;
    let checkT2 = 0;
    let lowerBound = this.pos.y;
    let upperBound = this.pos.y + this.h;
    
    // implicit equation
    // f(x,y,z) = (x-xc)^2 + (z-zc)^2 = r^2
    // x^2 - 2cx + cx^2 + z^2 - 2cz + cz^2 = r^2
    // (0x + tdx)^2 - 2cx + cx^2 + (0z + tdz)^2 - 2cz + cz^2 = r^2
    // x0^2 + 2 x0tdx + t^2dx^2 - 2cx + cx^2 + z0^2 + 2z0tdz t^2dz^2 - 2cz + cz^2 = r^2
    
    // for quadratic formula
    // a = dx^2 + dz^2
    // b = -2 * (x0dx + z0dz)
    // c = x0^2 + z0^2 - r^2 
    
    a = (ray.direction.x * ray.direction.x) + (ray.direction.z * ray.direction.z);
    b = -2 * (this.pos.x * ray.direction.x + this.pos.z * ray.direction.z);
    c = (this.pos.x * this.pos.x) + (this.pos.z * this.pos.z) - (this.radius * this.radius);
    
    discriminant = b * b - 4 * a * c;
    // imaginary roots = missed
    
    //console.log(discriminant);
    
    if (discriminant < 0) {
      t = -1;
    } else {
      num1 = (-b + sqrt(discriminant))/(2 * a);
      num2 = (-b - sqrt(discriminant))/(2 * a);
      
      //check if both num1 and num2 intersect
      checkT1 = eyeRay(ray, num1);
      checkT2 = eyeRay(ray, num2);
   
      // check boundaries -> y comp of eyeRay vector is within range
      // upper bound = y pos of cylinder + height
      // lower bound = y pos of cylinder
      
      if (checkT1.y > this.pos.y && checkT1.y < this.pos.y + this.h) {
          // if both num1 and num2 intersect
          if (checkT2.y > this.pos.y && checkT2.y < this.pos.y + this.h) {
            if (num1 > 0 && num2 > 0) {
              t = min(num1, num2);
            } else if (num1 > 0) {
              t = num1;
            } else {
              t = num2;
            }
          } else { // num2 does not intersect, only num1 intersects
            if (num1 > 0) {
              t = num1;
            }
          }
      } else if(checkT2.y > this.pos.y && checkT2.y < this.pos.y + this.h) { // only num2 intersects
          if (num2 > 0) {
            t = num2;
          }
      } else  {
        t = -1;
      }  
         
      return t;
    }
  }
}

class Hit {
  constructor(t, shape, intersectionPoint) {
    this.t = t;
    this.shape = shape;
    this.intersectionPoint = intersectionPoint;
  }
}

// passes Hit Object into this function
function diffuseShading(hitObject) {
  
  let resultColor = createVector(0,0,0);
  let red = 0;
  let green = 0;
  let blue = 0;
  let L = createVector(0,0,0);
  let Cl = createVector(0,0,0);
  let Cr = createVector(hitObject.shape.material.dr, hitObject.shape.material.dg, hitObject.shape.material.db);
  // C = Cr * Cl * (N.dot(L));
  // iterate through light list, calc per light what shade color should be and add for final color
  
  
  // normal vector = intersectionPoint - pos of the cylinder
  let cylPos = createVector(hitObject.shape.pos.x, hitObject.shape.pos.y, hitObject.shape.pos.z);
  let n = p5.Vector.sub(hitObject.intersectionPoint, cylPos);
  let N = createVector(n.x, 0, n.z).normalize();
  
  for (let i = 0; i < lights.length; i++) {
    L = (p5.Vector.sub(lights[i].pos, hitObject.intersectionPoint)).normalize();
    Cl = createVector(lights[i].r, lights[i].g, lights[i].b);  
    red += Cl.x * Cr.x * max(0, N.dot(L));
    green += Cl.y * Cr.y * max(0, N.dot(L));
    blue += Cl.z * Cr.z * max(0, N.dot(L));
  }
  //return final shade color
  resultColor.x = red;
  resultColor.y = green;
  resultColor.z = blue;
  return resultColor;
}

function eyeRay(ray, t) {
  // formula r = origin + t * direction
  let o = ray.origin;
  let d = ray.direction;
  return createVector(o.x + t * d.x, o.y + t * d.y, o.z + t * d.z);
}

function draw_scene() {
  
  noStroke();

  // go through all the pixels in the image
  
  let k = tan(radians(fov/2));
  let rayColoring = createVector(0,0,0);
  let time = 0;
  let xPrime = 0;
  let yPrime = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {   
      // add your ray creation and scene intersection code here
      // insert direction formula x' for x, y' for y, z = -1
      let r = background.x;
      let g = background.y;
      let b = background.z;
      xPrime = (x - width/2) * (2 * k / width);
      yPrime = (y - height/2) * (2 * k / height);
      
      // for every object calculate intersect eyeRay and current object and 
      // the intersection calculates t value smallest non neg t, 
      // every time we calc t and it is the smallest then update hit variable
      
      ray = new Ray(createVector(0, 0, 0), createVector(xPrime, yPrime, -1));
      minT = 1000000000000;
      // start with large t value
      let hit = null;
      let cylShape = null;
      for (let i = 0; i < sceneObjects.length; i++) {
        cylShape = sceneObjects[i];
        //console.log(cylShape);
        time = cylShape.intersect(ray);
        //console.log("time:" + time);
        if (time < minT && time > 0) {
          // hit object
          minT = time;
          hit = new Hit(time, sceneObjects[i], eyeRay(ray, time));
        }
      }
      //console.log("hit object:" + hit);
      if (hit == null) {
        // coloring background
        //console.log(r, g, b);
        rayColoring.x = r;
        rayColoring.y = g;
        rayColoring.z = b;
      } else {
        //console.log(r, g, b);
        //rayColoring = createVector(255, 0, 0);
        rayColoring = diffuseShading(hit); // returns finalShadeColor
      }   
      // set the pixel color to the shaded color of the ray
      //console.log({rayColoring});
      fill(rayColoring.x * 255, rayColoring.y * 255, rayColoring.z * 255);
    
      // draw a little rectangle to fill the pixel
      rect(x, height - y, 1, 1); // otherwise flipped image if we do not do height - y
    }
  }

}
