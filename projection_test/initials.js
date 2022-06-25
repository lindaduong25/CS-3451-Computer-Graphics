/******************************************************************************

Linda Duong

Draw your initials here in perspective.

It must be obvious from your drawing that the initials are in perspective.
You can achieve this in two ways.  One way is to create a 3D set of initials,
and make sure that multiple depths of the parts are shown. The other way is
to have your initials in single plane, but slant the plane in which your
initials are in so that we can see perspective foreshortening.

It is not sufficient to use diagonal instead of straight lines to give the
illusion of perspective.  
******************************************************************************/

function persp_initials() {
  
  Init_Matrix();
  
  let fov = 60.0;
  let nnear = 1.0;
  let ffar = 100.0;
  
  Perspective(fov, nnear, ffar);
  Translate (-2.0, -0.5, 9.0);
  RotateZ(10);
  RotateX(40);
  RotateY(10);
  
  BeginShape(LINES);
  
  Vertex(0.0, 0.0, 0.0);
  Vertex(2.0, 0.0, 0.0);
  
  Vertex(0.0, 0.0, 0.0);
  Vertex(0.0, 3.0, 0.0);
  
  Vertex(1.5, 1.0, 0.0);
  Vertex(1.5, -2.0, 0.0);
  
  Vertex(1.5, 1.0, 0.0);
  Vertex(3.0, 1.0, 0.0);
  
  Vertex(3.0, 1.0, 0.0);
  Vertex(3.8, 0.0, 0.0);
  
  Vertex(3.8, 0.0, 0.0);
  Vertex(3.8, -1.0, 0.0);
  
  Vertex(3.8, -1.0, 0.0);
  Vertex(3.0, -2.0, 0.0);
  
  Vertex(3.0, -2.0, 0.0);
  Vertex(1.5, -2.0, 0.0);
  
  EndShape();
}
