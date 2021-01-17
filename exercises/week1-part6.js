"use strict";

var gl;
var points;
var xPosition = 0.0;
var xPositionLoc;
var yPosition = 0.0;
var yPositionLoc;
var x = 0.015;
var y = 0.01;
var theta = 0.0;
var thetaLoc;

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

    var colors = [ vec4(0.3921, 0.5843, 0.9294, 1.0) ];

    for(var j = 1; j <= 361; j++)
    {
      colors.push(vec4(Math.random(),Math.random(),Math.random(),1.0));
    }

    var program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    xPositionLoc = gl.getUniformLocation(program, "xPosition");
    yPositionLoc = gl.getUniformLocation(program, "yPosition");
    thetaLoc = gl.getUniformLocation(program, "theta");

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if(xPosition >= 0.5 || xPosition <= -0.5 ){
      x = -x;
    }
    if(yPosition >= 0.5 || yPosition <= -0.5 ){
      y = -y;
    }
    theta += 0.05;
    gl.uniform1f(thetaLoc, theta);
    xPosition += x;
    gl.uniform1f(xPositionLoc, xPosition);
    yPosition += y;
    gl.uniform1f(yPositionLoc, yPosition);

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 362);
    requestAnimFrame(render);
}
