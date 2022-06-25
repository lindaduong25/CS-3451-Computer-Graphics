// Fragment shader

#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_LIGHT_SHADER

// These values come from the vertex shader
varying vec4 vertColor;
varying vec3 vertNormal;
varying vec3 vertLightDir;
varying vec4 vertTexCoord;

void main() {

  float bigRadius = 0.5;
  float smallRadius = 0;
  float angle = 0.0;
  float distance = 0.5;
  float alpha = 0;
  float x = 0.5;
  float y = 0.5;
  vec4 mainCircle = vec4(x, y, 0, 0);

  // Create one giant circle (main circle)
  // smaller circles/holes
  // smaller circle variable and play with position
  // in smaller for loop incrementing angle
  // scale size of radius based on current increment/counter
  // angle of each circle = angle of prev circle + constant
  // radius of each circle = fixed num * angle
  // distance of each circle = fixed num * angle

  if (sqrt(pow(mainCircle.x - vertTexCoord.s, 2) + pow(mainCircle.y - vertTexCoord.t, 2)) < bigRadius) {
    alpha = 1;
    distance = 0.395;
    float smallRadius = 0.08;
    for (int i = 0; i < 50; i++) {
      x = bigRadius - distance * cos(angle);
      y = bigRadius - distance * sin(angle);
      vec4 smallerCircle = vec4(x, y, 0, 0);
      if (sqrt(pow(smallerCircle.x - vertTexCoord.s, 2) + pow(smallerCircle.y - vertTexCoord.t, 2)) < smallRadius) {
        alpha = 0;
      }
      distance -= 0.0121;
      smallRadius -= 0.00238;
      angle += 0.5;
    }
  } else {
    alpha = 0;
  }
  gl_FragColor = vec4(0.0, 1.0, 2.0, alpha);
}

