// Fragment shader
// The fragment shader is run once for every pixel
// It can change the color and transparency of the fragment.

#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

#define PROCESSING_TEXLIGHT_SHADER

// Set in Processing
uniform sampler2D my_texture;

// These values come from the vertex shader
varying vec4 vertColor;
varying vec3 vertNormal;
varying vec3 vertLightDir;
varying vec4 vertTexCoord;

void main() {
	//given
  	//vec4 diffuse_color = texture2D(my_texture, vertTexCoord.xy);
  	//float diffuse = clamp(dot (vertNormal, vertLightDir),0.0,1.0);
  	//gl_FragColor = vec4(diffuse * diffuse_color.rgb, 1.0);


	float x = vertTexCoord.x;
 	float y = vertTexCoord.y;
	vec4 color = texture2D(my_texture, vec2(x, y));

  	// need to adjust x and y values to show clearer edges
	vec4 color1 = texture2D(my_texture, vec2(x - 0.006, y));
	vec4 color2 = texture2D(my_texture, vec2(x + 0.006, y));
	vec4 color3 = texture2D(my_texture, vec2(x, y - 0.006));
	vec4 color4 = texture2D(my_texture, vec2(x, y + 0.006));

	float r = color1.r + color2.r + color3.r + color4.r - 4 * color.r;
	float g = color1.g + color2.g + color3.g + color4.g - 4 * color.g;
	float b = color1.b + color2.b + color3.b + color4.b - 4 * color.b;
	float middleGray = 0.9 * (0.5);
  	float intensity = (r + g + b) / 3;
	intensity += middleGray;
	gl_FragColor = vec4(intensity, intensity, intensity, 1.0);
}
