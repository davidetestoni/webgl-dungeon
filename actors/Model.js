'use strict';

// Costruttore
class Model {

	constructor(gl, name, vertices, indices, normals, uvs, color) {

		// Crea una world matrix identità, che andrà riempita dallo script di scena
		this.world = mat4.create();

		// Crea i buffer dove scrivere gli array di valori
		this.vbo = gl.createBuffer(); // Vertex Buffer Object
		this.nbo = gl.createBuffer(); // Normals Buffer Object
		this.ibo = gl.createBuffer(); // Indices Buffer Object
		this.uvbo = gl.createBuffer(); // UV Buffer Object (per textures)
		this.nPoints = indices.length;
		this.color = color;
		this.name = name;

		// Se non sono state specificate UV, fai un array di zeri
		if (!uvs){
			// Ogni vertice ha 2 coordinate UV
			var len = vertices.length / 3 * 2;
			uvs = new Array(len).fill(0);
		}

		// Binda i buffer, uno alla volta, e riempili con gli array di valori
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

		// ELEMENT_ARRAY_BUFFER è usato per gli array di indici (in quanto si riferiscono a elementi in altri buffer)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.uvbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

		// Rimuovi il binding per evitare scritture accidentali future
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}
}