"use strict";

var gl;
var program;
var model;
var ctm = mat4();
var projection = mat4();
var modelViewMatrixLoc;
var projectionMatrixLoc;
var near = 1.0;
var far = 100.0;
var fovy = 45.0;
var aspect;
var eye;
const at = vec3(1.0, 3.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var radius = 5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var a_Position, a_Normal, a_Color;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    aspect = 1;

    program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    a_Position = gl.getAttribLocation(program, "a_Position");
    a_Normal = gl.getAttribLocation(program, "a_Normal");
    a_Color = gl.getAttribLocation(program, "a_Color");

    model = initVertexBuffers(gl, program);

    readOBJFile("../Common/teapot.obj", gl, model, 60, true);


    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    render();
};

function initVertexBuffers(gl) {
   var o = new Object();
   o.vertexBuffer = createEmptyArrayBuffer(gl, a_Position, 3, gl.FLOAT);
   o.normalBuffer = createEmptyArrayBuffer(gl, a_Normal, 3, gl.FLOAT);
   o.colorBuffer = createEmptyArrayBuffer(gl, a_Color, 4, gl.FLOAT);
   o.indexBuffer = gl.createBuffer();
   return o;
};

function createEmptyArrayBuffer(gl, a_attribute, num, type){
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return buffer;
};

function readOBJFile(fileName, gl, model, scale, reverse){
    var request = new XMLHttpRequest();

    request.onreadystatechange = function(){
        if(request.readyState === 4 && request.status !== 404)
            console.log("1");
            onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse);
    }
                console.log("2");

    request.open("GET",fileName,true);
    request.send();
};

var g_objDoc = null;
var g_drawingInfo = null;

function onReadOBJFile(fileString, fileName, gl, o, scale, reverse){
    var objDoc = new OBJDoc(fileName);
    var result = objDoc.parse(fileString, scale, reverse);
    if(!result){
        g_objDoc = null; g_drawingInfo = null;
                console.log("sa");
        return;
    }
                console.log("as");

    g_objDoc = objDoc;
};

function onReadComplete(gl, model, objDoc){
    var drawingInfo = objDoc.getDrawingInfo();

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);
        console.log("4");

    return drawingInfo;
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
    // OBJ and all MTLs are available
        console.log("3");
        g_drawingInfo = onReadComplete(gl, model, g_objDoc);

    }
    if (!g_drawingInfo) return;



    eye = vec3(30.0,30.0,30.0);
    ctm = lookAt(eye, at, up)
    projection = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection));

            console.log("5");

    gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);


};
