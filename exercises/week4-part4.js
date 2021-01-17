"use strict";

var gl;
var program;
var ctm = mat4();
var projection = mat4();
var modelViewMatrixLoc;
var projectionMatrixLoc;
var near = 1.0;
var far = 10.0;
var fovy = 45.0;
var aspect;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var radius = 5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightE = vec4(1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialShininess = 10.0;

var ambientProduct, diffuseProduct, specularProduct;

var index = 0;
var numTimesToSubdivide = 0;
var pointsArray = [];
var normalsArray = [];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

function triangle(a, b, c) {

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);
     
     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);

     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.cullFace(gl.FRONT);
    aspect = 1;

    program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);


    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    document.getElementById("Kd_x").oninput = function() { materialDiffuse = vec4(this.value,materialDiffuse[1],materialDiffuse[2],1.0); };   
    document.getElementById("Kd_y").oninput = function() { materialDiffuse = vec4(materialDiffuse[0],this.value,materialDiffuse[2],1.0); };   
    document.getElementById("Kd_z").oninput = function() { materialDiffuse = vec4(materialDiffuse[0],materialDiffuse[1],this.value,1.0); };   

    document.getElementById("Ks_x").oninput = function() { materialSpecular = vec4(this.value,materialSpecular[1],materialSpecular[2],1.0); };   
    document.getElementById("Ks_y").oninput = function() { materialSpecular = vec4(materialSpecular[0],this.value,materialSpecular[2],1.0); };   
    document.getElementById("Ks_z").oninput = function() { materialSpecular = vec4(materialSpecular[0],materialSpecular[1],this.value,1.0); };   

    document.getElementById("Ka_x").oninput = function() { materialAmbient = vec4(this.value,materialAmbient[1],materialAmbient[2],1.0); };   
    document.getElementById("Ka_y").oninput = function() { materialAmbient = vec4(materialAmbient[0],this.value,materialAmbient[2],1.0); };   
    document.getElementById("Ka_z").oninput = function() { materialAmbient = vec4(materialAmbient[0],materialAmbient[1],this.value,1.0); };   

    document.getElementById("Le_x").oninput = function() { lightE = vec4(this.value,lightE[1],lightE[2],1.0); };
    document.getElementById("Le_y").oninput = function() { lightE = vec4(lightE[0],this.value,lightE[2],1.0); };   
    document.getElementById("Le_z").oninput = function() { lightE = vec4(lightE[0],lightE[1],this.value,1.0); };   

    document.getElementById("Shininess").oninput = function() { materialShininess = this.value; };   

    

    document.getElementById("Button0").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button1").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    console.log(materialAmbient);
    console.log(materialDiffuse);
    console.log(materialSpecular);

    ambientProduct = mult(lightE,materialAmbient);
    diffuseProduct = mult(lightE,materialDiffuse);
    specularProduct = mult(lightE,materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"specularProduct"), flatten(specularProduct));
    gl.uniform1f( gl.getUniformLocation(program,"shininess"),materialShininess );
    gl.uniform4fv(gl.getUniformLocation(program,"lightPosition"), flatten(lightPosition));

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    theta += 0.01;
    ctm = lookAt(eye, at, up);
    projection = perspective(fovy, aspect, near, far);

    var N = normalMatrix(ctm, true);
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(N));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection));


    for (var i=0; i < index; i+=3){
      gl.drawArrays( gl.TRIANGLES, i, 3 );
    }

    window.requestAnimFrame(render);
}
