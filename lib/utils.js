'use strict';

// Binda un evento
function AddEvent(object, type, callback) {
    if (!object || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    }
    else if (object.attachEvent) {
        object.attachEvent('on' + type, callback);
    }
    else {
        object['on' + type] = callback;
    }
};

// Rimuove il binding di un evento
function RemoveEvent(object, type, callback) {
    if (!object || typeof(object) == 'undefined') return;
    if (object.removeEventListener) {
        object.removeEventListener(type, callback, false);
    }
    else if (object.detachEvent) {
        object.detachEvent('on' + type, callback);
    }
    else {
        object['on' + type] = callback;
    }
};

// Carica risorsa testuale (es. file GLSL)
function LoadTextResource (url, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onload = function (e) {
        if (xmlhttp.status < 200 || xmlhttp.status >= 300) {
            console.error('ERROR loading text resource', url, xmlhttp.status, xmlhttp.statusText);
            cb(new Error(xmlhttp.statusText));
        }
        else {
            cb(null, xmlhttp.responseText);
        }
    };
    xmlhttp.onerror = cb;
    xmlhttp.send();
};

// Carica risorsa json (es. modelli 3D codificati come oggetti json)
// Utile se si utilizza https://github.com/acgessler/assimp2json
function LoadJSONResource (url, cb) {
    LoadTextResource(url, function (err, res) {
        if (err) {
            cb(err);
        }
        else {
            try {
                var obj = JSON.parse(res);
                cb(null, obj);
            } catch (e) {
                cb(e);
            }
        }
    });
};

// Carica immagine
function LoadImage (url, cb) {
    var image = new Image();
    image.onload = function () {
        cb (null, image);
    };
    image.src = url;
};

// Compila vertex shader, fragment shader e linka il programma
// Ritorna il programma validato
function CreateShaderProgram(gl, vsText, fsText) {
    
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

function colorToHex(rgb) {
    var Rhex = rgbToHex(Math.round(rgb[0] * 255));
    var Ghex = rgbToHex(Math.round(rgb[1] * 255));
    var Bhex = rgbToHex(Math.round(rgb[2] * 255));

    return "#" + Rhex + Ghex + Bhex;
}

function colorToRGB(ColorEX) {
	var col = ColorEX.substring(1, 7);

    var R = parseInt(col.substring(0,2) ,16) / 255;
    var G = parseInt(col.substring(2,4) ,16) / 255;
    var B = parseInt(col.substring(4,6) ,16) / 255;

    return [R,G,B,1.0];
}

function rgbToHex(rgb) { 
    var hex = Number(rgb).toString(16);
    
    if (hex.length < 2) {
       hex = "0" + hex;
    }

    return hex;
};