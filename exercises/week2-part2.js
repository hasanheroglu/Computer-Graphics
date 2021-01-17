"use strict";

var canvas;
var gl;
var points;
var index = 0;
var maxNumVertices = 200;
var t;
var clearButton;
var clearOption;
var r = 0.0;
var g = 0.0;
var b = 0.0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    clearOption = document.getElementById("ClearMenu");
    clearOption.addEventListener("click", function() {
      switch(clearOption.selectedIndex){
        case 0:
        r = 0.0;
        g = 0.0;
        b = 0.0;
        break;
        case 1:
        r = 1.0;
        g = 0.0;
        b = 0.0;
        break;
        case 2:
        r = 1.0;
        g = 1.0;
        b = 0.0;
        break;
        case 3:
        r = 0.0;
        g = 1.0;
        b = 0.0;
        break;
        case 4:
        r = 0.0;
        g = 0.0;
        b = 1.0;
        break;
        case 5:
        r = 1.0;
        g = 0.0;
        b = 1.0;
        break;
        case 6:
        r = 0.0;
        g = 1.0;
        b = 1.0;
        break;
        case 7:
        r = 1.0;
        g = 1.0;
        b = 1.0;
        break;
        case 8:
        r = 0.3921;
        g = 0.5843;
        b = 0.9294;
        break;
      }
    });

    clearButton = document.getElementById("ClearButton");
    clearButton.addEventListener("click", function() {
      index = 0;
      gl.viewport( 0, 0, canvas.width, canvas.height );
      gl.clearColor(r, g, b, 1.0);
      gl.clear( gl.COLOR_BUFFER_BIT );
      gl.bindBuffer(ARRAY_BUFFER, null);
      gl.deleteBuffer(bufferId);
    });

    canvas.addEventListener("click", function(event) {
      var rect = event.target.getBoundingClientRect();
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      t = vec2(-1.0 + 2*(event.clientX-rect.left)/canvas.width,
               -1.0 + 2*(canvas.height-(event.clientY-rect.top))/canvas.height);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof["vec2"]*index, flatten(t));

      t = vec4(r,g,b,1.0);

       gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
       gl.bufferSubData(gl.ARRAY_BUFFER, sizeof["vec4"]*index, flatten(t));

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

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, sizeof["vec4"]*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, index);
    window.requestAnimFrame(render);
}
