'use strict';

class Camera {

    constructor(position, alpha, beta){
        this.alpha=alpha; //rotazione attorno alle X
        this.beta=beta; //rotazione attorno alle Y
        this.position = position;
    }

    // Ottiene la view matrix
    getViewMatrix(out) {
        
        // Crea matrici e vettori
        var RotationAlpha = mat4.create();
        var minusPosition= vec3.create();
        var RotationBeta = mat4.create();
        var tmp =mat4.create();
        var T = mat4.create();
        
        // Calcola l'inverso del vettore posizione 
        vec3.negate(minusPosition, this.position);

        // Crea le matrici (non utilizziamo rotazioni su Z)
        mat4.translate(T, T, minusPosition);
        mat4.rotateX(RotationAlpha, RotationAlpha, -this.alpha);
        mat4.rotateY(RotationBeta, RotationBeta, -this.beta);
        
        // Rx * Ry * T
        mat4.multiply(tmp, RotationBeta, T);
        mat4.multiply(out, RotationAlpha, tmp); // Questa è l'istruzione che realmente cambia la View Matrix
        
        return out;
    }

    /*

    Per le funzioni sottostanti, assegnando valori negativi all'angolo o
    alla distanza è possibile ruotare o muoversi nella direzione opposta
    NB:  la scena viene modificata quando si calcola la nuova view matrix

    */

    // Cambia il valore dell'angolo beta, rotazione sull'asse delle Y
    rotateRight(rad) {
        
        this.beta -= rad;
    
    }

    // Cambia il valore dell'angolo alpha, rotazione sull'asse delle X
    rotateUp(rad) {

        this.alpha += rad;

        if(this.alpha > Math.PI / 2){
            this.alpha = Math.PI / 2;
        }
        else if (this.alpha < -Math.PI / 2){
            this.alpha = -Math.PI / 2;
        }

    }

    // Muovi la camera in avanti / indietro della distanza specificata
    moveForward(dist) {

        // dist = di quanto spostare, beta = dove andare
        var seno = Math.cos(-this.beta);
        var coseno = Math.sin(-this.beta);
        
        //calcolo lo spostamento sulle X e sulle Z
        var dx = coseno * dist;
        var dz = seno * dist; 

        //aggiorno la posizione
        this.position[2] -= dz;
        this.position[0] += dx;

    }

    // Muovi la camera a sinistra / destra della distanza specificata
    moveRight(dist) {

        var seno = Math.cos(-this.beta);
        var coseno = Math.sin(-this.beta);

        var dx = seno * dist;
        var dz = coseno * dist; 

        this.position[0] += dx;
        this.position[2] += dz;
    }

    // Muovi la camera in alto / basso della distanza specificata (per i salti)
    moveUp(dist) {

        this.position[1] += dist;

    }
}