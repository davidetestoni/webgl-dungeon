precision mediump float;

/*
Più correttamente dovremmo usare:

struct PointLight{
    vec3 position;
    vec4 specularColor;
    vec4 diffuseColor;
    float range;
}

e passare l'oggetto lungo la pipeline grafica, a seconda della luce
che stiamo disegnando.
*/

uniform vec3 pointLightPosition;
uniform vec4 meshColor;

varying vec3 fPos;
varying vec3 fNorm;

void main()
{
    // vettore normale dal fragment alla sorgente luminosa
	vec3 toLightNormal = normalize(pointLightPosition - fPos);

    // formula di Phong (semplificate) per ricavare l'intensità luminosa in un punto
    // 0.6 = ambient reflection constant del materiale * ambient light
    // 0.4 = diffuse reflection constant del materiale
    // normale al fragment • fragment->luce
    // il tutto deve essere tra 0 e 1. Quando diamo le spalle alla luce (il dot fa 0), siamo comunque illuminati di un fattore 0.6 dato dalla luce ambientale.
	float lightIntensity = 0.6 + 0.4 * max(dot(fNorm, toLightNormal), 0.0);

    // il colore risultante è il colore della mesh * intensità luminosa più il canale alfa della mesh
	gl_FragColor = vec4(meshColor.rgb * lightIntensity, meshColor.a);
}