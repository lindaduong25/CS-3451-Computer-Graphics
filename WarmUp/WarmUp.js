function setup() {
  createCanvas(650, 650);
}

function draw() {
  background(255, 200, 200); //setting background to something other than white
  noStroke();
  let d = width/4;
  let angle = PI/3;
  let origX = width/2;
  let origY = height/2;
  let x = 0;
  let y = 0;
  fill(0, 0, 0);
  ellipse(width/2, height/2, width/4);
  
  // changing k based on vertical position
  let k = 1 - mouseY * 1/height;
  
  // changing rotation based on horizontal position
  // 325 -> PI/6 -> 0.5236
  // 487.5 -> PI/4 -> 0.785
  // 650 -> PI/3 -> 1.047
  angle += PI/3 * mouseX * 1/width;
  
  // 2nd size of circles, rotates by A
  let secondSize = k * d;
  for (let i = 1; i <= 6; i++) {
    let x = d * Math.cos(angle) + origX;
    let y = d * Math.sin(angle) + origY;
    fill(255, 0, 0 );
    ellipse(x, y, d * k, d * k);
    
    // 3rd size of circles rotates by 2A
    for (let j = 1; j <= 6; j++) {
      let a = secondSize * Math.cos(angle) + x;
      let b = secondSize * Math.sin(angle) + y;
      fill(0, 0, 255);
      ellipse(a, b, d * k * k, d * k * k);
      
      // 4th size of circles rotates by 3A
      let thirdSize = d * k * k;
      for (let l = 1; l <= 6; l++) {
        let c = thirdSize * Math.cos(angle) + a;
        let e = thirdSize * Math.sin(angle) + b;
        fill(0, 200, 50);
        ellipse(c, e, d * k * k * k, d * k * k * k);
        
        // 5th size of circles rotates by 4A
        let fourthSize = d * k * k * k;
        for (let m = 1; m <= 6; m++) {
          let f = fourthSize * Math.cos(angle) + c;
          let g = fourthSize * Math.sin(angle) + e;
          fill(200, 0, 100);
          ellipse(f, g, d * k * k * k * k, d * k * k * k * k);
          angle += PI/3;
        }
        angle += PI/3;
      }
      angle += PI/3;
    }
    angle += PI/3;
  }
}
