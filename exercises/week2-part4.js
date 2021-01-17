"use strict";

var canvas;
var gl;
var points = [];
var pointsColor = [];
var triangles = [];
var trianglesColor = [];
var circles = [];
var circlesColor = [];
var t;
var clearButton;
var colorOption;
var pointButton;
var triangleButton;
var circleButton;
var pProgram;
var tProgram;
var cProgram;
var shape = -1;
var triangleCount = 0;
var circleCount = 0;
var numofcircles = 0;
var temp;
var r = 0.0;
var g = 0.0;
var b = 0.0;
var x;
var y;
var radius;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorOption = document.getElementById("ColorMenu");
    colorOption.addEventListener("click", function() {
      selectColor(colorOption.selectedIndex);
    });

    clearButton = document.getElementById("ClearButton");
    clearButton.addEventListener("click", function() {
      clearCanvas();
    });

    pointButton = document.getElementById("PointButton");
    pointButton.addEventListener("click", function() {
      shape = 0;
    });

    triangleButton = document.getElementById("TriangleButton");
    triangleButton.addEventListener("click", function() {
      shape = 1;
    });

    circleButton = document.getElementById("CircleButton");
    circleButton.addEventListener("click", function() {
      shape = 2;
    });

    canvas.addEventListener("click", function(event) {
      if(shape == 0){
        triangleCount = 0;
        circleCount = 0;
        addPoint(event);
      }
      else if(shape == 1){
        if(triangleCount+1==3){
          triangleCount = 0;
          addTriangle(event);
        }
        else{
          addPoint(event);
          triangleCount++;
        }
      }
      else if (shape == 2){
        if(circleCount+1==2){
          circleCount = 0;
          addCircle(event);
          numofcircles++;
        }
        else{
          addPoint(event);
          circleCount++;
        }
      }

    });

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.3921, 0.5843, 0.9294, 1.0 );

    setPointProgram();
    setTriangleProgram();
    setCircleProgram();

    render();
};

var pBuffer;
var p_vPosition;
var p_cBuffer;
var p_vColor;
var tBuffer;
var t_vPosition;
var t_cBuffer;
var t_vColor;
var cBuffer;
var c_vPosition;
var c_cBuffer;
var c_vColor;

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
/*
    if(shape==0){
      drawTriangles();
      drawCircles();
      drawPoints();
    }
    else if(shape==1){
      drawCircles();
      drawPoints();
      drawTriangles();
    }
    else if(shape==2){
      drawPoints();
      drawTriangles();
      drawCircles();
    }
*/
    drawPoints();
    drawTriangles();
    drawCircles();


    window.requestAnimFrame(render);
}

function setPointProgram(){
  pProgram = initShaders( gl, "vertex-shader", "fragment-shader");
  p_vPosition = gl.getAttribLocation( pProgram, "vPosition" );
  gl.vertexAttribPointer( p_vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( p_vPosition );
  p_vColor = gl.getAttribLocation( pProgram, "vColor" );
  gl.vertexAttribPointer( p_vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( p_vColor );
}

function setTriangleProgram(){
  tProgram = initShaders( gl, "vertex-shader", "fragment-shader");
  t_vPosition = gl.getAttribLocation( tProgram, "vPosition" );
  gl.vertexAttribPointer( t_vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( t_vPosition );
  t_vColor = gl.getAttribLocation( tProgram, "vColor" );
  gl.vertexAttribPointer( t_vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( t_vColor );
}

function setCircleProgram(){
  cProgram = initShaders( gl, "vertex-shader", "fragment-shader");
  c_vPosition = gl.getAttribLocation( cProgram, "vPosition" );
  gl.vertexAttribPointer( c_vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( c_vPosition );
  c_vColor = gl.getAttribLocation( cProgram, "vColor" );
  gl.vertexAttribPointer( c_vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( c_vColor );
}

function selectColor(option){
  switch(option){
    case 0:
    r = 0.0; g = 0.0; b = 0.0;
    break;
    case 1:
    r = 1.0; g = 0.0; b = 0.0;
    break;
    case 2:
    r = 1.0; g = 1.0; b = 0.0;
    break;
    case 3:
    r = 0.0; g = 1.0; b = 0.0;
    break;
    case 4:
    r = 0.0; g = 0.0; b = 1.0;
    break;
    case 5:
    r = 1.0; g = 0.0; b = 1.0;
    break;
    case 6:
    r = 0.0; g = 1.0; b = 1.0;
    break;
    case 7:
    r = 1.0; g = 1.0; b = 1.0;
    break;
    case 8:
    r = 0.3921; g = 0.5843; b = 0.9294;
    break;
  }
}

function clearCanvas(){
  numofcircles = 0;
  triangleCount = 0;
  circleCount = 0;
  points = [];
  pointsColor = [];
  triangles = [];
  trianglesColor = [];
  circles = [];
  circlesColor = [];
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor(r, g, b, 1.0);
  gl.clear( gl.COLOR_BUFFER_BIT );
}

function addPoint(event){
  var rect = event.target.getBoundingClientRect();

  t = vec2(-1.0 + 2*(event.clientX-rect.left)/canvas.width,
           -1.0 + 2*(canvas.height-(event.clientY-rect.top))/canvas.height);

  points.push(t);

  t = vec4(r,g,b,1.0);
  pointsColor.push(t);

  pBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
  p_cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, p_cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsColor), gl.STATIC_DRAW );
}

function addTriangle(event){
  var rect = event.target.getBoundingClientRect();

  t = vec2(-1.0 + 2*(event.clientX-rect.left)/canvas.width,
           -1.0 + 2*(canvas.height-(event.clientY-rect.top))/canvas.height);

  temp = points.pop();
  triangles.push(points.pop());
  triangles.push(temp);
  triangles.push(t);

  t = vec4(r,g,b,1.0);
  temp = pointsColor.pop();
  trianglesColor.push(pointsColor.pop());
  trianglesColor.push(temp);
  trianglesColor.push(t);

  tBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW );
  t_cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, t_cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(trianglesColor), gl.STATIC_DRAW );
}

function addCircle(event){
  var rect = event.target.getBoundingClientRect();

  t = vec2(-1.0 + 2*(event.clientX-rect.left)/canvas.width,
           -1.0 + 2*(canvas.height-(event.clientY-rect.top))/canvas.height);

  temp = points.pop();
  circles.push(temp);
  circles.push(t);

  x = temp[0] - t[0];
  y = temp[1] - t[1];

  radius = Math.sqrt((x*x)+(y*y));

  circles.pop();

  for(var i = 0; i <= 360; i++)
  {
    circles.push(vec2(temp[0]+radius*Math.cos(i*Math.PI/180),temp[1]+radius*Math.sin(i*Math.PI/180)));
  }

  t = vec4(r,g,b,1.0);
  temp = pointsColor.pop();
  circlesColor.push(temp);


  for(var i = 0; i <= 360; i++)
  {
    circlesColor.push(t);
  }

  cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(circles), gl.STATIC_DRAW );
  c_cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, c_cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(circlesColor), gl.STATIC_DRAW );
}


function drawPoints(){
  gl.useProgram(pProgram);
  gl.enableVertexAttribArray( p_vPosition );
  gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer );
  gl.vertexAttribPointer( p_vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( p_vColor );
  gl.bindBuffer( gl.ARRAY_BUFFER, p_cBuffer );
  gl.vertexAttribPointer( p_vColor, 4, gl.FLOAT, false, 0, 0 );

  gl.drawArrays( gl.POINTS, 0, points.length);
}

function drawTriangles(){
  gl.useProgram(tProgram);
  gl.enableVertexAttribArray( t_vPosition );
  gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
  gl.vertexAttribPointer( t_vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( t_vColor );
  gl.bindBuffer( gl.ARRAY_BUFFER, t_cBuffer );
  gl.vertexAttribPointer( t_vColor, 4, gl.FLOAT, false, 0, 0 );

  gl.drawArrays( gl.TRIANGLES, 0, triangles.length);
}

function drawCircles(){
  gl.useProgram(cProgram);
  gl.enableVertexAttribArray( c_vPosition );
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.vertexAttribPointer( c_vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( c_vColor );
  gl.bindBuffer( gl.ARRAY_BUFFER, c_cBuffer );
  gl.vertexAttribPointer( c_vColor, 4, gl.FLOAT, false, 0, 0 );
  for(var i=0; i<numofcircles; i++){
    gl.drawArrays( gl.TRIANGLE_FAN, i*362, 362);
  }
}
