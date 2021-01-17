"use strict";

var canvas;
var gl;
var points = [];
var pointsColor = [];
var triangles = [];
var trianglesColor = [];
var t;
var clearButton;
var clearOption;
var pointButton;
var triangleButton;
var pProgram;
var tProgram;
var  shape = -1;
var triangleCount = 0;
var temp;
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
      points = [];
      pointsColor = [];
      triangles = [];
      trianglesColor = [];
      gl.viewport( 0, 0, canvas.width, canvas.height );
      gl.clearColor(r, g, b, 1.0);
      gl.clear( gl.COLOR_BUFFER_BIT );
    });

    pointButton = document.getElementById("PointButton");
    pointButton.addEventListener("click", function() {
      shape = 0;
    });

    triangleButton = document.getElementById("TriangleButton");
    triangleButton.addEventListener("click", function() {
      shape = 1;
    });

    canvas.addEventListener("click", function(event) {
      var rect = event.target.getBoundingClientRect();
      if(shape == 0){
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
      else if(shape == 1){
        if(triangleCount+1==3){
          triangleCount = 0;

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
        else{
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

          triangleCount++;
        }
      }

    });

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.3921, 0.5843, 0.9294, 1.0 );

    pProgram = initShaders( gl, "vertex-shader", "fragment-shader");
    tProgram = initShaders( gl, "vertex-shader", "fragment-shader");

    p_vPosition = gl.getAttribLocation( pProgram, "vPosition" );
    gl.vertexAttribPointer( p_vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( p_vPosition );
    p_vColor = gl.getAttribLocation( pProgram, "vColor" );
    gl.vertexAttribPointer( p_vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( p_vColor );

    t_vPosition = gl.getAttribLocation( tProgram, "vPosition" );
    gl.vertexAttribPointer( t_vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( t_vPosition );
    t_vColor = gl.getAttribLocation( tProgram, "vColor" );
    gl.vertexAttribPointer( t_vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( t_vColor );

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

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.useProgram(pProgram);
    gl.enableVertexAttribArray( p_vPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, pBuffer );
    gl.vertexAttribPointer( p_vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( p_vColor );
    gl.bindBuffer( gl.ARRAY_BUFFER, p_cBuffer );
    gl.vertexAttribPointer( p_vColor, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.POINTS, 0, points.length);

    gl.useProgram(tProgram);
    gl.enableVertexAttribArray( t_vPosition );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.vertexAttribPointer( t_vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( t_vColor );
    gl.bindBuffer( gl.ARRAY_BUFFER, t_cBuffer );
    gl.vertexAttribPointer( t_vColor, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLES, 0, triangles.length);

    window.requestAnimFrame(render);
}
