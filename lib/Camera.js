'use strict';

// Istanzia la classe Camera data posizione, punto in cui guardare, e vettore diretto verso l'alto
var Camera = function (position, lookAt, up) {

    // Crea i vettori
	this.forward = vec3.create();
	this.up = vec3.create();
	this.right = vec3.create();

	this.position = position;

    // vettore lookAt = dove siamo + dove guardiamo. Invertendo:
    // forward = lookAt - position
    vec3.subtract(this.forward, lookAt, this.position);
    
    // right = forward x up
    vec3.cross(this.right, this.forward, up);
    
    // up potrebbe non essere ortogonale a forward e right, quindi lo ricalcoliamo
    // up = right x forward
	vec3.cross(this.up, this.right, this.forward);

    // ortogonali -> ortonormali
	vec3.normalize(this.forward, this.forward);
	vec3.normalize(this.right, this.right);
	vec3.normalize(this.up, this.up);
};

// Ottiene la view matrix
// Prendiamo la lookAt matrix già esistente per non allocare ulteriore memoria inutilmente
Camera.prototype.GetViewMatrix = function (out) {
    
    var lookAt = vec3.create();
    
    // vettore lookAt = dove siamo + dove guardiamo
    vec3.add(lookAt, this.position, this.forward);
    
    // lookAt(out, eye, center, up)
	mat4.lookAt(out, this.position, lookAt, this.up);
	return out;
};

Camera.prototype.MoveByMouse = function (dx, dy){

    var angley = dx / 1000;
    var anglez = dy / 1000;

    // Setta componente Z del forward
    this.forward[1] += anglez * 2;

    var lookAt = vec3.create();
    vec3.add(lookAt, this.position, this.forward);

    // Setta le altre due componenti
    this.forward[2] = (this.position[2] + Math.sin(-angley)*lookAt[0] + Math.cos(-angley)*lookAt[2]);
    this.forward[0] = (this.position[0] + Math.cos(-angley)*lookAt[0] + Math.sin(-angley)*lookAt[2]);

    this._realign();
};

/*
Per le funzioni sottostanti, assegnando valori negativi all'angolo o
alla distanza è possibile ruotare o muoversi nella direzione opposta
*/

// Ruota la camera a destra/sinistra dati i radianti
Camera.prototype.rotateRight = function (rad) {
    
    var rightMatrix = mat4.create();
    
    // rotate(dest, dest, angle, axis)
    // Ruotiamo attorno all'asse z
    mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0, 0, 1));
    
    // Calcola il nuovo vettore forward
    // [vec3, 1] * mat4
	vec3.transformMat4(this.forward, this.forward, rightMatrix);
    
    // Riallinea gli altri due vettori (right e up) col nuovo forward
    this._realign();
};

// Ruota la camera su/giù dati i radianti
Camera.prototype.rotateUp = function (rad) {
    
    var upMatrix = mat4.create();

    // Ruotiamo attorno all'asse x
    mat4.rotate(upMatrix, upMatrix, rad, vec3.fromValues(1, 0, 0));

    vec3.transformMat4(this.forward, this.forward, upMatrix);
    
    this._realign();
}

// Riallinea i vettori right e up con forward a rinormalizza
Camera.prototype._realign = function() {
	vec3.cross(this.right, this.forward, this.up);
	vec3.cross(this.up, this.right, this.forward);

	vec3.normalize(this.forward, this.forward);
	vec3.normalize(this.right, this.right);
	vec3.normalize(this.up, this.up);
};

// Muovi la camera in avanti/indietro della distanza specificata (W/S)
Camera.prototype.moveForward = function (dist) {

    // scaleAndAdd(out, a, b, scale)
	vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
};

// Muovi la camera a sinistra/destra della distanza specificata (A/D)
Camera.prototype.moveRight = function (dist) {
	vec3.scaleAndAdd(this.position, this.position, this.right, dist);
};

// Muovi la camera in su della distanza specificata (per i salti)
Camera.prototype.moveUp = function (dist) {
	vec3.scaleAndAdd(this.position, this.position, this.up, dist);
};