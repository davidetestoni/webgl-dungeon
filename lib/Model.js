'use strict';

// Istanzia la classe Model dati vertici, indici, normali e colore
var Model = function (gl, name, vertices, indices, normals, uvs, color) {
	
	// Crea una world matrix identità, che andrà riempita dallo script di scena
	this.world = mat4.create();

	// Crea i buffer dove scrivere gli array di valori
	this.vbo = gl.createBuffer();
	this.nbo = gl.createBuffer();
	this.ibo = gl.createBuffer();
	this.uvbo = gl.createBuffer();
	this.nPoints = indices.length;
	this.color = color;
	this.name = name;

	// Binda i buffer, uno alla volta, e scrivi gli array di valori
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	// ELEMENT_ARRAY_BUFFER è usato per gli array di indici che si riferiscono a elementi in altri buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

	// Unbinda l'ultimo buffer bindato
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

// Compila vertex shader, fragment shader e linka il programma
// Ritorna il programma validato
var CreateShaderProgram = function (gl, vsText, fsText) {
    
    // Vertex Shader
    var vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vsText);
	gl.compileShader(vs);
	if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
		return {
			error: 'Error compiling vertex shader: ' + gl.getShaderInfoLog(vs)
		};
	}

    // Fragment Shader
	var fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fsText);
	gl.compileShader(fs);
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
		return {
			error: 'Error compiling fragment shader: ' + gl.getShaderInfoLog(fs)
		};
	}

    // Aggancia gli shader al programma e linka
	var program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		return {
			error: 'Error linking program: ' + gl.getProgramInfoLog(program)
		};
	}

    // Ulteriore controllo se il programma è valido
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		return {
			error: 'Error validating program: ' + gl.getProgramInfoLog(program)
		};
	}

	return program;
};