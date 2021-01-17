"use strict";

var gl;
var ctm = mat4();
var modelViewMatrixLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var vertices = [
      vec3( 0.0, 0.0, 0.0),
      vec3( 0.5, 0.0, 0.0),
      vec3( 0.5, 0.0, 0.0),
      vec3( 0.5, 0.5, 0.0),
      vec3( 0.5, 0.5, 0.0),
      vec3( 0.0, 0.5, 0.0),
      vec3( 0.0, 0.5, 0.0),
      vec3( 0.0, 0.0, 0.0),
      vec3( 0.0, 0.0, 0.0),
      vec3( 0.0, 0.0, 0.5),
      vec3( 0.5, 0.0, 0.0),
      vec3( 0.5, 0.0, 0.5),
      vec3( 0.0, 0.5, 0.0),
      vec3( 0.0, 0.5, 0.5),
      vec3( 0.5, 0.5, 0.0),
      vec3( 0.5, 0.5, 0.5),
      vec3( 0.0, 0.0, 0.5),
      vec3( 0.5, 0.0, 0.5),
      vec3( 0.5, 0.0, 0.5),
      vec3( 0.5, 0.5, 0.5),
      vec3( 0.5, 0.5, 0.5),
      vec3( 0.0, 0.5, 0.5),
      vec3( 0.0, 0.5, 0.5),
      vec3( 0.0, 0.0, 0.5),
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

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    ctm = rotateX(45);
    ctm = mult(ctm, rotateY(45));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));

    gl.drawArrays( gl.LINES, 0, 24);
}
