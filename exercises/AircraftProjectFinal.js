"use strict";

var gl;
var view = mat4();
var projection = mat4();
var viewMatrixLoc;
var projectionMatrixLoc;
var modelMatrixLoc;
var normalMatrixLoc;
var near = 0.1;
var far = 100.0;
var fovy = 30.0;
var aspect = 1;
var eye;
const at = vec3(1.0, 3.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var rollAngle = 0;
var diveAngle = 0;
var rotationAngle = 0;
var aileronRotation = 0;
var elevatorRotation = 0;
var rudderRotation = 0;
var angle = 5.0;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    
    var x = 1;
    var vertices = new Float32Array([
      -x, -x, -x,  x, -x, -x,  -x,  x, -x,  x,  x, -x, //front v0-v1-v2-v3
       x, -x, -x,  x, -x,  x,   x,  x,  x,  x,  x, -x, //right v1-v4-v5-v3
      -x, -x, -x, -x, -x,  x,  -x,  x,  x, -x,  x, -x, //left  v0-v6-v7-v2
      -x,  x, -x, -x,  x,  x,   x,  x,  x,  x,  x, -x, //top   v2-v7-v5-v3
      -x, -x,  x,  x, -x,  x,   x, -x, -x, -x, -x, -x, //bot   v6-v4-v1-v0
       x,  x,  x, -x,  x,  x,  -x, -x,  x,  x, -x,  x  //back  v5-v7-v6-v4
    ]);

    var normals = new Float32Array([
       0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0, //front v0-v1-v2-v3
       1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0, //right v1-v4-v5-v3
      -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0, //left  v0-v6-v7-
       0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0, //top   v2-v7-v5-v3
       0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0, //bot   v6-v4-v1-v0
       0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0, //back  v5-v7-v6-v4
    ]);

    
    var indices = new Uint8Array([
       0, 1, 2,   1, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // left
      12,13,14,  12,14,15,    // top
      16,17,18,  16,18,19,    // bot
      20,21,22,  20,22,23     // back
    ]);

    var program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
    document.onkeydown = function(ev){ keydown(ev) };
  
    render();
};

function keydown(ev) {
  switch (ev.keyCode) {
    case 40: 
      diveAngle = (diveAngle - angle) % 360;
      if(elevatorRotation < 30) elevatorRotation = (elevatorRotation + angle);
      break;
    case 38: 
      diveAngle = (diveAngle + angle) % 360;
      if(elevatorRotation > -30) elevatorRotation = (elevatorRotation - angle);
      break;
    case 39: 
      rollAngle = (rollAngle - angle) % 360;
      if(aileronRotation < 30) aileronRotation = (aileronRotation + angle);
      break;
    case 37: 
      rollAngle = (rollAngle + angle) % 360;
      if(aileronRotation > -30) aileronRotation = (aileronRotation - angle);
      break;
    case 65: 
      rotationAngle = (rotationAngle - angle) % 360;
      if(rudderRotation < 30) rudderRotation = (rudderRotation + angle);
      break; 
    case 68: 
      rotationAngle = (rotationAngle + angle) % 360;
      if(rudderRotation > -30) rudderRotation = (rudderRotation - angle);
      break;
    default: return; 
  }

  render();
}

var modelMatrix = mat4();
var b_modelMatrix = mat4();
var nMatrix = mat4();
var matrixArray = [];


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(-30.0, 30.0, 0.0);
    view = lookAt(eye, at, up);
    projection = perspective(fovy, aspect, near, far);

    //body
    modelMatrix = translate(0.0,0.0,0.0);
    modelMatrix = mult(modelMatrix, rotateX(rollAngle));
    modelMatrix = mult(modelMatrix, rotateY(rotationAngle));
    modelMatrix = mult(modelMatrix, rotateZ(diveAngle));
    drawBox(10.0,1.0,1.0,modelMatrix);
    
    b_modelMatrix = modelMatrix; //saved body matrix because we need it for other things (right wing, stabilizers)
    //left wing
    //modelMatrix = mult(modelMatrix,rotateZ(70));
    modelMatrix = mult(modelMatrix,translate(0.5,0.0,-4.1));
    modelMatrix = mult(modelMatrix,rotateY(-20));
    drawBox(1.0,0.2,5.0,modelMatrix);

    //left aileron
    modelMatrix = mult(modelMatrix,translate(-1.2,0.05,-3.0));
    modelMatrix = mult(modelMatrix,rotateZ(-aileronRotation));
    drawBox(0.5,0.05,1.2,modelMatrix);

    modelMatrix = b_modelMatrix;

    //right wing
    modelMatrix = mult(modelMatrix,translate(0.5,0.0,4.1));
    modelMatrix = mult(modelMatrix,rotateY(20));
    drawBox(1.0,0.2,5.0,modelMatrix);

    //right aileron
    modelMatrix = mult(modelMatrix,translate(-1.2,0.05,3.0));
    modelMatrix = mult(modelMatrix,rotateZ(aileronRotation));
    drawBox(0.5,0.05,1.2,modelMatrix);

    modelMatrix = b_modelMatrix;


    //left horizon stabilizer
    modelMatrix = mult(modelMatrix,translate(-9.0,0.15, -2.0));
    drawBox(1.0,0.2,1.0,modelMatrix);

    //left elevator
    modelMatrix = mult(modelMatrix,translate(-1.0,0.0,0.0));
    modelMatrix = mult(modelMatrix,rotateZ(elevatorRotation));
    drawBox(0.3,0.1,0.7,modelMatrix);

    modelMatrix = b_modelMatrix;

    //right horizon stabilizer
    modelMatrix = mult(modelMatrix,translate(-9.0,0.15, 2.0));
    drawBox(1.0,0.2,1.0,modelMatrix);

    //right elevator
    modelMatrix = mult(modelMatrix,translate(-1.0,0.0,0.0));
    modelMatrix = mult(modelMatrix,rotateZ(elevatorRotation));
    drawBox(0.3,0.1,0.7,modelMatrix);

    modelMatrix = b_modelMatrix;

    //vertical stabilizer
    modelMatrix = mult(modelMatrix,translate(-9.0,2.0, 0.0));
    modelMatrix = mult(modelMatrix,rotateX(90));
    drawBox(1.0,0.3,1,modelMatrix);

    //rudder
    modelMatrix = mult(modelMatrix,translate(-1.0,0.0, 0.0));
    modelMatrix = mult(modelMatrix,rotateZ(rudderRotation));
    drawBox(0.3,0.1,0.7,modelMatrix);    
}

function drawBox(width, height, depth, m){
  pushMatrix(m);
  m = mult(m, scalem(width,height,depth));
  nMatrix = normalMatrix(m, false);
  gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(view));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection));
  gl.uniformMatrix4fv(modelMatrixLoc,false, flatten(m));
  gl.uniformMatrix4fv(normalMatrixLoc,false,flatten(nMatrix));

  gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_BYTE,0);
  popMatrix(m);
}


function popMatrix(m){
  m = matrixArray.pop();
}

function pushMatrix(m){
  matrixArray.push(m);
}

