// Fragment shader

#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_LIGHT_SHADER

uniform float cx;
uniform float cy;

// These values come from the vertex shader
varying vec4 vertColor;
varying vec3 vertNormal;
varying vec3 vertLightDir;
varying vec4 vertTexCoord;

void main() {

  //vec4 diffuse_color = vec4 (1.0, 0.0, 0.0, 1.0);
  //float diffuse = clamp(dot (vertNormal, vertLightDir),0.0,1.0);
  //gl_FragColor = vec4(diffuse * diffuse_color.rgb, 1.0);

  float r = 4;
  float zx = vertTexCoord.s * 3.0 - 1.5; // z real -> scale to be between -1.5, 1.5
	float zy = vertTexCoord.t * 3.0 - 1.5; // z imag -> scale to be between -1.5, 1.5
  float x = 0.0;
  float y = 0.0;
  int iteration = 0;
	int max_iteration = 20;
  for (int i = 0; i < max_iteration; i++) {
    float currZReal = zx * zx * zx - 3 * zx * zy * zy + cx;
    float currZImag = 3 * zx * zx * zy - zy * zy * zy + cy;
    zx = currZReal;
    zy = currZImag;
    if (zx * zx + zy * zy <= r * r) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  }
}