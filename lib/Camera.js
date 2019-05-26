'use strict';
var counter=0;
// Istanzia la classe Camera data posizione, punto in cui guardare, e vettore diretto verso l'alto
var Camera = function (position, alpha, beta) {

    // Crea i vettori
    //Inizializza camera
    this.alpha=alpha; //rotazione attorno alle X
    this.beta=beta; //rotazione attorno alle Y
    this.position = position;

};

// Ottiene la view matrix

Camera.prototype.GetViewMatrix = function (out) {



    //Per creare una View matrix si procedere cosi:
    // data una posizione T , una direzione nello spazio rx,ry,rz e un fattore S 
    // T x Ry x Rx x Rz x S e poi facciamo l'inversa 
    //piu velocemente :
    // S* Rz(inversa)*Rx (inversa)* Ry(inversa) * T   
    
    var RotationAlpha = mat4.create();
    var minusPosition= vec3.create();
    var RotationBeta = mat4.create();
    var tmp =mat4.create();
    var T = mat4.create();
    
    //calcolo l'inverso del vettore posizione 
    vec3.negate(minusPosition,this.position);
    //creo le matrici
    mat4.translate(T,T,minusPosition);
    mat4.rotateX(RotationAlpha,RotationAlpha,-this.alpha);
    mat4.rotateY(RotationBeta,RotationBeta,-this.beta);
    
    //Rx*Ry*T
    mat4.multiply(tmp,RotationBeta,T);
    
    // NB questa è l'istruzione che realmente cambia la View Matrix
    mat4.multiply(out,RotationAlpha,tmp);
    
    return out;
};



/*
Per le funzioni sottostanti, assegnando valori negativi all'angolo o
alla distanza è possibile ruotare o muoversi nella direzione opposta
NB:  la scena viene modificata quando si calcola la nuova view matrix

*/

// Cambia il valore dell'angolo beta, rotazione sull'asse delle Y
Camera.prototype.rotateRight = function (rad) {
    
    this.beta -= rad;
   
//se provo a giare piu di 90 gradi a destra o a sinistra si ferma
//penso che questo codice si possa migliorare o comuque scrivere in un altro modo   

//codice commentato ma potenzialmente utile. bisogna vedere come vogliamo fare la camera
/*if(this.beta>3.14/2 ){
        this.beta = 3.14/2;

}
if(this.beta<-3.14/2 ){
        this.beta = -3.14/2;

}*/
   };

// Cambia alpha, rotazione sull'asse X
Camera.prototype.rotateUp = function (rad) {

    this.alpha += rad;
//se provo a giare piu di 90 gradi a destra o a sinistra si ferma
//penso che questo codice si possa migliorare o comuque scrivere in un altro modo   


if(this.alpha>3.14/2 ){
        this.alpha = 3.14/2;

}
if(this.alpha<-3.14/2 ){
        this.alpha = -3.14/2;

}
};

// Muovi la camera in avanti/indietro della distanza specificata (W/S)
Camera.prototype.moveForward = function (dist) {

    //l'idea e : di quando spostarmi me lo dice dist, dove andare lo so dall'angolo beta

    var seno= Math.cos(-this.beta);
    var coseno= Math.sin(-this.beta);
    
    //calcolo lo spostamento sulle X e sulle Z
    var dx= coseno*dist;
    var dz= seno*dist; 

    //aggiorno la posizione
    this.position[2] -= dz;
    this.position[0] += dx;

};

// Muovi la camera a sinistra/destra della distanza specificata (A/D)
Camera.prototype.moveRight = function (dist) {


    var seno= Math.cos(-this.beta);
    var coseno= Math.sin(-this.beta);

    //questa volta 
    var dx= seno*dist;
    var dz= coseno*dist; 
    this.position[0] += dx;
    this.position[2] += dz;
};

// Muovi la camera in su della distanza specificata (per i salti)
Camera.prototype.moveUp = function (dist) {
    this.position[2] +=dist;

};