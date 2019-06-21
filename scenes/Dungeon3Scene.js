'use strict';

class Dungeon3Scene extends DungeonScene {

	// Costruttore della classe figlia
	constructor(gl) {
		
		// Chiama il costruttore della classe parent
		super(gl);

	}

	// Override del metodo load della classe parent
	load(cb){

		console.log('Loading assets (difficulty: 3)');

		// Chiama il metodo load della classe parent
		super.load(cb, 3);
	}
};