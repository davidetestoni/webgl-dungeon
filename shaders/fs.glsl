precision highp float;

// UNIFORMS
uniform vec2 ambientType;
uniform vec2 diffuseType;
uniform vec2 specularType;
uniform vec2 emissionType;
uniform vec2 lightType;

//point light param
uniform vec4 PLColor;
uniform vec3 pointLightPosition; // Per ora qui dentro c'è un vettore con tre elementi che indicano la posizione della point light
uniform float PLightDecay; // Il decay della point light
uniform float PLightTarget; // Il target della point light

//directional light
uniform vec4 directionalLightColor;
uniform vec3 directionalLightDir;

uniform vec4 specularColor;
uniform vec4 ambientLightColor;
uniform vec4 ambientMatColor;
uniform vec4 ambientLightLowColor;
uniform vec4 diffuseColor;
uniform vec4 emitColor;

uniform vec4 meshColor;

uniform vec3 ADir;

uniform float SpecShine;
uniform float DToonTh;
uniform float SToonTh;

uniform mat4 lightPosMatrix;
uniform mat4 lightDirMatrix;
uniform sampler2D sampler;

// VARYING
varying vec3 fPos;
varying vec3 fNorm;
varying vec2 fTexCoord;

void main()
{


//normalizzo le normali

    vec3 nNormals=normalize(fNorm); 

//aggiusto le direzioni della directional light, essendo in camera space 
//applico la view matrix(che non è altro che l'inverso della camera matrix)
    vec3 directionalDir= mat3(lightDirMatrix)*directionalLightDir;

//aggiusto la posizione della point light.La posizione viene passata al 
//fragment gia moltiplicata per la view. siccome camera e luce sono sovrapposti basta moltiplicare per l'inverso della view
vec3 pointLightPositionTransform= mat3(lightPosMatrix)*pointLightPosition;


    // Calcolo la direzione e il colore della luce (point light) --> passaggio base
    vec4 PointlightColor = PLColor * pow(PLightTarget / length(pointLightPositionTransform - fPos), PLightDecay);
    vec3 PointlightDir = normalize(pointLightPositionTransform - fPos);



    // Calcolo direzione in cui viene guardato il pixel e l'halfvector
    // Eye position è la posizione della camera
    vec3 eyePos = pointLightPositionTransform;
    vec3 eyedirVec = normalize(eyePos - fPos);
    vec3 halfVecPoint = normalize(PointlightDir + eyePos);
    vec3 reflectionPoint = -reflect(PointlightDir, nNormals);
    vec3 halfVecDirectional = normalize(directionalDir + eyePos);
    vec3 reflectionDirectional = -reflect(directionalDir, nNormals);
    float amBlend = (dot(nNormals, vec3(0.0, 1.0, 0.0)) + 1.0) / 2.0;

    // Calcolo i vari tipi di effetti partendo dalla direzione e dal colore della luce



    // AmbientType è un vettore di zeri ed uni che indica quale tipo è stato scelto dalla GUI
    vec4 ambientAmbient = ambientLightColor * ambientMatColor;
    vec4 ambientHemi = (ambientLightColor * amBlend + ambientLightLowColor * (1.0 - amBlend)) * ambientMatColor;
    vec4 ambient = (ambientAmbient * ambientType.x) + (ambientHemi * ambientType.y);




    //calcolo phong per la point light
    vec4 specularPhongPoint = PointlightColor * pow(max(dot(reflectionPoint, eyedirVec), 0.0), SpecShine) * specularColor;
    vec4 specularBlinnPoint = PointlightColor * pow(max(dot(nNormals, halfVecPoint), 0.0), SpecShine) * specularColor;
    vec4 specularPoint = (specularPhongPoint * specularType.x) + (specularBlinnPoint * specularType.y);

        //calcolo blinn per la point light
    vec4 specularPhongDirectional = directionalLightColor * pow(max(dot(reflectionDirectional, eyedirVec), 0.0), SpecShine) * specularColor;
    vec4 specularBlinnDirectional = directionalLightColor * pow(max(dot(nNormals, halfVecDirectional), 0.0), SpecShine) * specularColor;
       vec4 specularDirectional = (specularPhongDirectional * specularType.x) + (specularBlinnDirectional * specularType.y);

    


//calcolo lamber per il point
    vec4 lambertPoint = PointlightColor * clamp(dot(nNormals, PointlightDir),0.0,1.0) * diffuseColor;
    vec4 ToonColPoint;
    if(dot(nNormals, PointlightDir) > DToonTh) {
        ToonColPoint = diffuseColor;
    } else {
        ToonColPoint = vec4(0.0, 0.0, 0.0, 1.0);
    }
    vec4 toonPoint = PointlightColor * ToonColPoint;
    vec4 diffusePoint= (lambertPoint*diffuseType.x) + (toonPoint*diffuseType.y);

//calcolo lamber per la direzionale
    vec4 lambertDirectional = directionalLightColor * clamp(dot(nNormals, directionalDir),0.0,1.0) * diffuseColor;

vec4 ToonColDirectional;
    if(dot(nNormals, directionalDir) > DToonTh) {
        ToonColDirectional = diffuseColor;
    } else {
        ToonColDirectional = vec4(0.0, 0.0, 0.0, 1.0);
    }
    vec4 toonDirectional = directionalLightColor * ToonColDirectional;
    vec4 diffuseDirectional= (lambertDirectional*diffuseType.x) + (toonDirectional*diffuseType.y);
    




//calcolo il diffuse finale
    vec4  diffuse= (diffuseDirectional*lightType.y)+(diffusePoint*lightType.x);
//calcolo lo specular finale
    vec4 specular= (specularPoint*lightType.x) + (specularDirectional*lightType.y);

    // Sommo e clampo tutto
    vec4 outColor = clamp (diffuse + specular + ambient + emitColor, 0.0, 1.0);

    // Setta il colore di output
    gl_FragColor= texture2D(sampler, fTexCoord) * vec4(outColor.rgb, meshColor.a);
}