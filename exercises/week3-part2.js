"use strict";

var gl;
var ctm = mat4();
var projection = mat4();
var modelViewMatrixLoc;
var projectionMatrixLoc;
var near = 0.1;
var far = 100.0;
var fovy = 45.0;
var aspect;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    aspect = 1;
    
    var vertices = [
      vec3( 0.0, 0.0, 0.0),
      vec3( 1.0, 0.0, 0.0),
      vec3( 1.0, 0.0, 0.0),
      vec3( 1.0, 1.0, 0.0),
      vec3( 1.0, 1.0, 0.0),
      vec3( 0.0, 1.0, 0.0),
      vec3( 0.0, 1.0, 0.0),
      vec3( 0.0, 0.0, 0.0),
      vec3( 0.0, 0.0, 0.0),
      vec3( 0.0, 0.0, 1.0),
      vec3( 1.0, 0.0, 0.0),
      vec3( 1.0, 0.0, 1.0),
      vec3( 0.0, 1.0, 0.0),
      vec3( 0.0, 1.0, 1.0),
      vec3( 1.0, 1.0, 0.0),
      vec3( 1.0, 1.0, 1.0),
      vec3( 0.0, 0.0, 1.0),
      vec3( 1.0, 0.0, 1.0),
      vec3( 1.0, 0.0, 1.0),
      vec3( 1.0, 1.0, 1.0),
      vec3( 1.0, 1.0, 1.0),
      vec3( 0.0, 1.0, 1.0),
      vec3( 0.0, 1.0, 1.0),
      vec3( 0.0, 0.0, 1.0),
    ];
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0.5, 0.5, 10.0);
    ctm = lookAt(eye, at, up);
    ctm = mult(ctm, translate(-1.0,0.0,0.0));
    projection = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection));


    gl.drawArrays(gl.LINES,0,24);

    eye = vec3(0.0, 0.0, 10.0);
    ctm = lookAt(eye, at, up);
    ctm = mult(ctm, rotateY(45));
    ctm = mult(ctm, translate(-4.0,0.0,0.0));
    projection = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection));


    gl.drawArrays(gl.LINES,0,24);

    eye = vec3(0.5, 0.5, 7.0);
    ctm = lookAt(eye, at, up);
    ctm = mult(ctm, rotateY(45));
    ctm = mult(ctm, rotateX(45));
    ctm = mult(ctm, translate(1.0,0.0,0.0));
    projection = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection));


    gl.drawArrays(gl.LINES,0,24);
    window.requestAnimFrame(render);
}
