"use strict";

var gl;
var points;
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

    var vertices = new Float32Array([ 0.0, 0.5,
                                      0.5, 0.0,
                                     -0.5, 0.0,
                                      0.0,-0.5 ]);

    var colors = new Float32Array([ 1.0, 0.0, 0.0, 1.0,
                                    0.0, 1.0, 0.0, 1.0,
                                    0.0, 0.0, 1.0, 1.0,
                                    1.0, 1.0, 1.0, 1.0 ]);



    var program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    thetaLoc = gl.getUniformLocation(program, "theta");

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    theta += 0.1;
    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
    requestAnimFrame(render);
}
