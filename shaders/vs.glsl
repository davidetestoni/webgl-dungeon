precision mediump float;

// UNIFORMS
uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;
uniform mat4 mNorm;

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
	// Passiamo le coordinate UV pari pari lungo la pipeline
	fTexCoord = vTexCoord;

    fPos = (mView * mWorld * vec4(vPos, 1.0)).xyz;
	fNorm = mat3(mNorm)*vNorm;
	gl_Position = mProj  * vec4(fPos, 1.0);
}