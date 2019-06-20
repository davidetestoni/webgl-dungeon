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

uniform vec2 ambientType;
uniform vec2 diffuseType;
uniform vec2 specularType;
uniform vec2 emissionType;

uniform vec4 PLColor;
uniform vec3 pointLightPosition; //per ora qui dentro c'e un vettore con tre elementi che indicano la posizione della point light
uniform float PLightDecay; //il decay dell apoint light
uniform float PLightTarget; //il target della point light
uniform vec4 ambientLightColor;
uniform vec4 ambientLightLowColor;
uniform vec3 ADir;
uniform vec4 diffuseColor;


uniform vec4 specularColor;
uniform float SpecShine;
uniform vec4 ambientMatColor;
uniform vec4 emitColor;
uniform vec4 meshColor;

uniform sampler2D sampler;

varying vec3 fPos;
varying vec3 fNorm;
varying vec2 fTexCoord;

void main()
{
    //calcolo la direzione e il colore della luce( pint light) -->passaggio base
    vec4 lightColor=PLColor*pow(PLightTarget/length(pointLightPosition - fPos),PLightDecay);
    vec3 lightDir= normalize(pointLightPosition - fPos);



    vec3 eyePos=pointLightPosition;
    //calcolo direzione in cui viene guardato il pixel e l'halfvector
    //eye position è la posizione della camerA?
    vec3 eyedirVec = normalize(eyePos - fPos);
    vec3 halfVec = normalize(lightDir + eyePos);
    vec3 reflection = -reflect(lightDir, fNorm);
    float amBlend = (dot(fNorm, vec3(0.0,1.0,0.0)) + 1.0) / 2.0;


    //calcolo i vari tipi i effetti partendo dalla direzione e dal colore della luce
    //ambientType è un vettore di zero e uno che mi indica quale tipo e stato scelto dalla GUI
    vec4 ambientAmbient = ambientLightColor * ambientMatColor;
    vec4 ambientHemi = (ambientLightColor * amBlend + ambientLightLowColor * (1.0 - amBlend)) * ambientMatColor;
    vec4 ambient= ambientAmbient*ambientType.x + ambientHemi*ambientType.y;





    vec4 specularPhong = lightColor * pow(max(dot(reflection, eyedirVec), 0.0), SpecShine) * specularColor;
    vec4 specularBlinn = lightColor * pow(max(dot(fNorm, halfVec), 0.0), SpecShine) * specularColor;
    vec4 specular= specularPhong *specularType.x + specularBlinn*specularType.y;


    vec4 lambert = lightColor * clamp(dot(fNorm, lightDir),0.0,1.0) * diffuseColor;
    //appena ho tempo qui aggiungo il TOON diffuse



    //sommo e clampo tutto, qui dovremmo moltiplicare per il colore della texture?
    vec4 out_color = clamp(lambert+specular+ambient+emitColor, 0.0, 1.0);

    // Setta il colore di output
    gl_FragColor= texture2D(sampler, fTexCoord) * vec4(out_color.rgb,meshColor.a);
}