precision mediump float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

attribute vec3 vPos;
attribute vec3 vNorm;

// fPos serve per l'illuminazione (point light)
varying vec3 fPos;
varying vec3 fNorm;

void main()
{
    // Settiamo fPos e fNorm in coordinate world
    // QUESTO VA CAMBIATO CON COORDINATE CAMERA COME RICHIESTO! per come lo abbiamo implementato ora il vertex dovrebbe gia essre corrretto
	fPos = (mWorld * vec4(vPos, 1.0)).xyz;
	fNorm = (mWorld * vec4(vNorm, 0.0)).xyz;
	gl_Position = mProj * mView * vec4(fPos, 1.0);
}