"use strict";

var gl;
var points;
var yPosition = 0.0;
var yPositionLoc;
var y = 0.05;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.enable(gl.DEPTH_TEST);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.3921, 0.5843, 0.9294, 1.0 );

    var vertices = [ vec2(0.0,0.0) ];

    for(var i = 1; i <= 361; i++)
    {
      vertices.push(vec2(0.5*Math.cos(i*Math.PI/180),0.5*Math.sin(i*Math.PI/180)));
    }

    var program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    yPositionLoc = gl.getUniformLocation(program, "yPosition");

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if(yPosition >= 0.5 || yPosition <= -0.5 ){
      y = -y;
    }
    yPosition += y;
    gl.uniform1f(yPositionLoc, yPosition);

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 362);
    requestAnimFrame(render);
}
