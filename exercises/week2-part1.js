"use strict";

var canvas;
var gl;
var points;
var index = 0;
var maxNumVertices = 200;
var t;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    canvas.addEventListener("mousedown", function(event) {
      //var rect = event.target.getBoundingClientRect();
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      t = vec2(-1.0 + 2*event.clientX/canvas.width,
               -1.0 + 2*(canvas.height-event.clientY)/canvas.height);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof["vec2"]*index, flatten(t));
      index++;
    });

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.3921, 0.5843, 0.9294, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, sizeof["vec2"]*maxNumVertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, index);
    window.requestAnimFrame(render);
}
