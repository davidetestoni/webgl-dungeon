precision highp float;

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

uniform vec3 pointLightPosition; //per ora qui dentro c'e un vettore con tre elementi che indicano la posizione della point light
uniform vec4 meshColor;
uniform float PLightDecay; //il decay dell apoint light
uniform float PLightTarget; //il target della point light
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
	

    //prima calcolo il contributo della point light l*(target/|p-x|)^decay
vec4 lightColor=vec4(1.0,0.0,0.0,1.0)*pow(PLightTarget/length(pointLightPosition - fPos),PLightDecay);


//poi calcolo l'effetto Lambert che e in funzione delle normali ai vertici e quindi ci permette di avere colori diversi in base all'angolazione della luce
//aggiungo poi un componente momentaneo vec3(0.3 ...) in modo che anche le superfici non illuminate siano visibili e non nere
vec4 out_color = lightColor * clamp(dot(fNorm, toLightNormal),0.0,1.0) * vec4(1.0,0.0,0.0,1.0)+vec4(1.0,0.0,0.0,0.0);
    


    float lightIntensity =  0.4 * max(dot(fNorm, toLightNormal), 0.0) ;



    // il colore risultante è il colore della mesh * intensità luminosa più il canale alfa della mesh
	//gl_FragColor = vec4(meshColor.rgb * lightIntensity, meshColor.a);
    //il contributo della luce (out_color) andrebbe moltiplicato per il colore della mesh.. per ora abbiamo mesh tutte dello stesso colore quindi non faccio questo passaggio
    gl_FragColor= vec4(out_color.rgb*lightIntensity,meshColor.a);
}