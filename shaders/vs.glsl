precision mediump float;

// UNIFORMS
uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

// ATTRIBUTES
attribute vec3 vPos;
attribute vec3 vNorm;
attribute vec2 vTexCoord;

// VARYING
varying vec3 fPos; // Serve per l'illuminazione
varying vec3 fNorm;
varying vec2 fTexCoord; // Coordinate delle texture

void main()
{
	// Passiamo le coordinate pari pari lungo la pipeline
	fTexCoord = vTexCoord;

    // Settiamo fPos e fNorm in coordinate world
    // QUESTO VA CAMBIATO CON COORDINATE CAMERA COME RICHIESTO! per come lo abbiamo implementato ora il vertex dovrebbe gia essre corrretto
	fPos = (mWorld * vec4(vPos, 1.0)).xyz;
	fNorm = (mWorld * vec4(vNorm, 0.0)).xyz;
	gl_Position = mProj * mView * vec4(fPos, 1.0);
}