// Here are the two new routines that you should add to your ray tracer for Part B

// global variables
let fov = 0;
let background = new p5.Vector(0,0,0);
let sceneObjects = [];
let lights = [];
let materials;
let ambientLight = new p5.Vector(0,0,0);
let debug = false;


function new_sphere (x, y, z, radius) {
  let shapeSphere = new Sphere(x, y, z, radius);
  sceneObjects.push(shapeSphere);
}

function ambient_light (r, g, b) {
  ambientLight = createVector(r, g, b);
}

// You should swap in your routines from Part A for the placeholder routines below

function reset_scene() {
  sceneObjects = [];
  lights = [];
  fov = 0;
  background = createVector(0,0,0);
  ambientLight = createVector(0,0,0);
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
  let shapeCyl = new Cylinder(x, y, z, radius, h);
  sceneObjects.push(shapeCyl);
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

class Sphere {
  constructor(x, y, z, radius, pos, material) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.pos = createVector(x, y, z);
    this.material = materials;
  }
  
  // ray-sphere intersection
  intersect(ray) {
    let a = 0;
    let b = 0;
    let c = 0;
    let num1 = 0;
    let num2 = 0;
    let t = 0;
    let discriminant = 0;
    
    // a = dx^2 + dy^2 + dz^2
    // b = 2 * (center_rel_to_origin_x * dx + center_rel_to_origin_y * dy + center_rel_to_origin_z *dz)
    // c = x0^2 + y0^2 + z0^2 - r^2
    
    let bHelperX = (ray.origin.x - this.pos.x) * ray.direction.x;
    let bHelperY = (ray.origin.y - this.pos.y) * ray.direction.y;
    let bHelperZ = (ray.origin.z - this.pos.z) * ray.direction.z;
    let cHelperX = (ray.origin.x - this.pos.x) * (ray.origin.x - this.pos.x);
    let cHelperY = (ray.origin.y - this.pos.y) * (ray.origin.y - this.pos.y);
    let cHelperZ = (ray.origin.z - this.pos.z) * (ray.origin.z - this.pos.z);
    
    a = (ray.direction.x * ray.direction.x) + (ray.direction.y * ray.direction.y) + (ray.direction.z * ray.direction.z);
    b = 2 * (bHelperX + bHelperY + bHelperZ);
    c = cHelperX + cHelperY + cHelperZ - (this.radius * this.radius);
    
    discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
      t = -1;
    } else {
      num1 = (-b + sqrt(discriminant))/(2 * a);
      num2 = (-b - sqrt(discriminant))/(2 * a);
      
      if (num1 < 0 && num2 < 0) {
        t = -1;
      }
      if (num1 > 0 && num2 > 0) {
        t = min(num1, num2);
      } else if(num1 > 0) {
        t = num1;
      } else {
        t = num2;
      }
      return t;
    }
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
    let t3 = 0;
    let t4 = 0;
    let discriminant = 0;
    let checkT1 = 0;
    let checkT2 = 0;
    let lowerBound = this.pos.y;
    let upperBound = this.pos.y + this.h;
    let minT = 100000;
    let cylType = 0;
    
    // implicit equation
    // f(x,y,z) = (x-xc)^2 + (z-zc)^2 = r^2
    // x^2 - 2cx + cx^2 + z^2 - 2cz + cz^2 = r^2
    // (0x + tdx)^2 - 2cx + cx^2 + (0z + tdz)^2 - 2cz + cz^2 = r^2
    // x0^2 + 2 x0tdx + t^2dx^2 - 2cx + cx^2 + z0^2 + 2z0tdz t^2dz^2 - 2cz + cz^2 = r^2
    
    // for quadratic formula
    // acounting for non-zero center
    // a = dx^2 + dz^2
    // b = 2 * (origin_rel_center.x * dir.x) + (origin_rel_center.z  * dir.z)
    // c = x0^2 + dx^2 - 2 * x0dx + z0^2 + dz^2 - 2 * z0dz - r^2
    
    let bHelperX = (ray.origin.x - this.pos.x) * ray.direction.x;
    let bHelperY = (ray.origin.z - this.pos.z) * ray.direction.z;
    let cHelperX = (ray.origin.x - this.pos.x) * (ray.origin.x - this.pos.x);
    let cHelperZ = (ray.origin.z - this.pos.z) * (ray.origin.z - this.pos.z);
    
    a = (ray.direction.x * ray.direction.x) + (ray.direction.z * ray.direction.z);
    b = 2 * (bHelperX + bHelperY);
    c = cHelperX + cHelperZ - (this.radius * this.radius);
    
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
            if (num1 > 0 && num2 > 0 && num2 < minT && num1 < minT) {
              minT = min(num1, num2);
              t = minT;
            } else if (num1 > 0 && num1 < minT) {
              minT = num1;
              t = minT;
            } else if (num2 > 0 && num2 < minT) {
              minT = num2;
              t = minT;
            }
          } else { // num2 does not intersect, only num1 intersects
            if (num1 > 0 && num1 < minT) {
              minT = num1;
              t = minT;
            }
          }
      } else if(checkT2.y > this.pos.y && checkT2.y < this.pos.y + this.h) { // only num2 intersects
          if (num2 > 0 && num2 < minT) {
            minT = num2;
            t = minT;
          }
      } else  {
        t = -1;
      }
              
    }
   
    //console.log({rayOrigin});
    
    // top cap calculations
    let topCenter = createVector(this.pos.x, this.pos.y + this.h, this.pos.z);
    let normTop = createVector(0, 1, 0);
    let numeratort3 = p5.Vector.sub(topCenter, ray.origin);
    //console.log("rayOrigin check 2: " , rayOrigin);
    numeratort3 = p5.Vector.dot(numeratort3, normTop);
    let denominatort3 = p5.Vector.dot(normTop, ray.direction);
    let num3 = 0;
    if (denominatort3 != 0) {
      num3 = numeratort3 / denominatort3;
    }
    //console.log({num3});
    
    // bottom cap calculations
    let normBottom = createVector(0, -1, 0);
    let numeratort4 = p5.Vector.sub(this.pos, ray.origin);
    numeratort4 = p5.Vector.dot(numeratort4, normBottom);
    let denominatort4 = p5.Vector.dot(normBottom, ray.direction);
    let num4 = 0;
    if (denominatort4 != 0) {
      num4 = numeratort4 / denominatort4;
    }
    //console.log({num4});
    
    if (debug) {
      //console.log("ray:" , ray);
      //console.log("pos:" , this.pos);
      //console.log("rayOrigin:" , ray.origin);
      //console.log("rayOrigin.X:" , rayOrigin.x);
      //console.log("normTop:" , normTop);
      //console.log("numerator for t3:" + numeratort3);
      //console.log("denom for t3:" + denominatort3);
      //console.log("distance:" + (p5.Vector.dist(this.pos, checkT3)));
      //console.log("time3:" + num3);
      //console.log("time4:" + num4);
    }
    
    // checking t3 and t4 cylinder caps
    let checkT3 = eyeRay(ray, num3);
    let checkT4 = eyeRay(ray, num4);
    
    //console.log({checkT3});
    //console.log({checkT4});
    
    // top cap check
    let xCheckT3 = pow(checkT3.x - topCenter.x, 2);
    let zCheckT3 = pow(checkT3.z - topCenter.z, 2);
    
    if (xCheckT3 + zCheckT3 <= this.radius * this.radius) {
      if (num3 > 0 && num3 < minT) {
        cylType = 1;
        minT = num3;
        t = minT;
        //console.log("normTop:" , norm);
      }
    }
    
    // bottom cap check
    let xCheckT4 = pow(this.pos.x - checkT4.x, 2);
    let zCheckT4 = pow(this.pos.z - checkT4.z, 2);
    
    if (xCheckT4 + zCheckT4 <= this.radius * this.radius) {
      //console.log("true");
      if (num4 > 0 && num4 < minT) {
        cylType = 2;
        minT = num4;
        t = minT;
        //console.log("normBottom:" , norm);
        //console.log("num4:" + num4);
      }
    }
    
    
    //if (debug) {
    //  console.log({norm});
    //  console.log(t);
    //}
    
    let tAndType = [t, cylType];
    return tAndType;
  }
}

class Hit {
  constructor(t, shape, intersectionPoint, normal) {
    this.t = t;
    this.shape = shape;
    this.intersectionPoint = intersectionPoint;
    this.normal = normal;
  }
}


// passes Hit Object into this function
function shading(ray, hitObject, depth) {
  
  // final Color = Cr(Ca + Cl * max(0, N*L)) + Cl * Cp * (max(H*N, 0))^p
  
  //console.log("intersectionPoint:", hitObject.intersectionPoint);
  
  let resultColor = createVector(0,0,0);
  let maxDepth = 6;
  let red = 0;
  let green = 0;
  let blue = 0;
  
  let Cr = createVector(hitObject.shape.material.dr, hitObject.shape.material.dg, hitObject.shape.material.db);
  let Ca = createVector(hitObject.shape.material.ar, hitObject.shape.material.ag, hitObject.shape.material.ab);
  let Cp = createVector(hitObject.shape.material.sr, hitObject.shape.material.sg, hitObject.shape.material.sb);
  let p = hitObject.shape.material.pow;
  let k_refl = hitObject.shape.material.k_refl;
 
  let N = hitObject.normal.normalize();
  let shadowRay = new Ray(createVector(0,0,0), createVector(0,0,0));
  let E = p5.Vector.sub(ray.origin, hitObject.intersectionPoint).normalize();
  
  
  // reflection stuff
  // reflectRay = 2 * NdotE
  // implement reflection logic where recursion occurs
  //    check current depth of recursive stack and if k_refl of current surface > 0 
  //    then calcualte certain vectors and shoot refelction ray
  //    recursibvely call shading function and add resulting valyes to current running totals (red, green, blue)
  
  let Crefl = createVector(0,0,0);
  let krefl = hitObject.shape.material.k_refl;
  // check current depth of recursive stack and if k_refl of current surface > 0 
  if (krefl > 0 && depth < maxDepth) {
    let reflectOffset = p5.Vector.mult(N, 0.0001);
    let rayOrigin = p5.Vector.add(hitObject.intersectionPoint, reflectOffset);
    //console.log("rayOrigin:", rayOrigin);
    let NdotE = N.dot(E);
    let r = p5.Vector.mult(N, 2 * NdotE);
    let reflection = p5.Vector.sub(r, E).normalize();
    let reflectRay = new Ray(rayOrigin, reflection);
    let hit = findIntersection(reflectRay);
    if (hit == null) {
      Crefl = createVector(background.x, background.y, background.z);
    } else {
      // recursively call shading function
      Crefl = shading(ray, hit, depth++);
    }
  }
  
  //add reflective components to running totals for red, green, blue at the end
  let reflColorMultKrefl = p5.Vector.mult(Crefl, krefl);
  //console.log("reflColorMultKrefl:" , reflColorMultKrefl);
  
  // iterate through light list, calc per light what shade color should be and add for final color
  for (let i = 0; i < lights.length; i++) {
    let l = (p5.Vector.sub(lights[i].pos, hitObject.intersectionPoint));
    let L = (p5.Vector.sub(lights[i].pos, hitObject.intersectionPoint)).normalize();
    let Cl = createVector(lights[i].r, lights[i].g, lights[i].b); 
    // let e = eyeray origin - intersection point then normalize
    let H = p5.Vector.add(E, L).normalize();
    
    // shadow ray stuff
    
    // offset = (shadow ray direction * 0.0001)
    let offset = p5.Vector.mult(l.copy(), 0.0001);
    shadowRay.origin = p5.Vector.add(hitObject.intersectionPoint, offset);
    shadowRay.direction = l.copy();
    
    // shoot shadow ray
    let checkShadowIntersection = findIntersection(shadowRay);
    
    // if shadow ray doesnt hit or t value of shadow ray > 1 then incorporant diffuse and specular terms
    if (checkShadowIntersection != null) { // there was an intersection -> blocked never reaches light -> 0,0,0 black color
      red += 0;
      green += 0;
      blue += 0;
    } else {
      // diffuse
      red += (Cl.x * Cr.x * max(0, N.dot(L))); 
      green += (Cl.y * Cr.y * max(0, N.dot(L))); 
      blue += (Cl.z * Cr.z * max(0, N.dot(L))); 
      // specular
      red += (Cl.x * Cp.x * pow(max(0, H.dot(N)), p));
      green += (Cl.y * Cp.y * pow(max(0, H.dot(N)), p));
      blue += (Cl.z * Cp.z * pow(max(0, H.dot(N)), p));
    }
  }
  // add ambient, diffuse, reflective components 
  // return final shade color
  //console.log({ambientLight});
  resultColor.x = red + Ca.x * Cr.x * ambientLight.x + reflColorMultKrefl.x;
  resultColor.y = green + Ca.y * Cr.y * ambientLight.y + reflColorMultKrefl.y;
  resultColor.z = blue + Ca.z * Cr.z * ambientLight.z + reflColorMultKrefl.z;
  //console.log("ResultColor:", resultColor);
  return resultColor;
}

function eyeRay(ray, t) {
  // formula r = origin + t * direction
  let o = ray.origin;
  let d = ray.direction;
  return createVector(o.x + t * d.x, o.y + t * d.y, o.z + t * d.z);
}

function findIntersection(ray) {
  
  // for every object calculate intersect eyeRay and current object and 
  // the intersection calculates t value smallest non neg t, 
  // every time we calc t and it is the smallest then update hit variable and minT
  
  minT = 1000000000000;
  // start with large t value
  let time = 0;
  let hit = null;
  let cylShape = null;
  let sphereShape = null;
  let normal = 0;
  let type = 0;
  let cylIntersectArray = [];
  
  for (let i = 0; i < sceneObjects.length; i++) {
    //console.log(sceneObjects[i] instanceof Cylinder);
    if (sceneObjects[i] instanceof Cylinder) {
      cylShape = sceneObjects[i];
      cylIntersectArray = cylShape.intersect(ray);
      //if (debug) {
      //  console.log(cylIntersectArray);
      //}
      time = cylIntersectArray[0];
      type = cylIntersectArray[1];
      //if (debug) {
      //  console.log({type});
      //}
    } else {
      sphereShape = sceneObjects[i];
      //console.log(sphereShape);
      time = sphereShape.intersect(ray);
      type = 0;
    }
        
    if (time < minT && time > 0) {
     // hit object
     minT = time;
     let intersectionPoint = eyeRay(ray, time);
     
     if (type == 0) { // cyl body or sphere body
       let n = p5.Vector.sub(intersectionPoint, sceneObjects[i].pos);
       if (sceneObjects[i] instanceof Cylinder) {
         normal = createVector(n.x, 0, n.z);
       } else { // sphere object so dont need to set y comp to 0
         normal = createVector(n.x, n.y, n.z);
       }
     } else if (type == 1) { // top cap
       normal = createVector(0, 1, 0);
     } else { // bottom cap
       //console.log(type);
       normal = createVector(0, -1, 0);
       //console.log("before:" , normal);   
     }
     
     //console.log("after:" , normal);
     hit = new Hit(time, sceneObjects[i], intersectionPoint, normal);
     //console.log({normal});
     //console.log({hit});
     }
   } 
   return hit;
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
      
      
      if (x == 250 && y == 338) {
        debug = true;
      } else {
        debug = false;
      }
      
      // add your ray creation and scene intersection code here
      // insert direction formula x' for x, y' for y, z = -1
      let r = background.x;
      let g = background.y;
      let b = background.z;
      xPrime = (x - width/2) * (2 * k / width);
      yPrime = (y - height/2) * (2 * k / height);
      
      ray = new Ray(createVector(0, 0, 0), createVector(xPrime, yPrime, -1));   
      //if (debug) {
      //  console.log("raycheck:" , ray);
      //}
      hit = findIntersection(ray);
      

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
        rayColoring = shading(ray, hit, 0); // returns finalShadeColor
      }   
      // set the pixel color to the shaded color of the ray
      //console.log({rayColoring});
      fill(rayColoring.x * 255, rayColoring.y * 255, rayColoring.z * 255);
    
      // draw a little rectangle to fill the pixel
      rect(x, height - y, 1, 1); // otherwise flipped image if we do not do height - y
    }
  }
}
