'use strict';

/*
Cell (Y X)

12 10 Door1
17 13 Door2
12 15 Door3
13 18 Door4
7 10 Door5

11 9 Lever1
12 14 Lever3
7 9 Lever5

12 21 CopperKey
1 16 GoldKey
*/

class Dungeon3Scene extends DungeonScene {

	// Costruttore della classe figlia
	constructor(gl) {
		
		// Chiama il costruttore della classe parent
		super(gl);

		this.Doors = [
			new DoorLever('Door1', 12, 10, 11, 9),
			new DoorKey('Door2', 17, 13, 'copper'),
			new DoorLever('Door3', 12, 15, 12, 14),
			new DoorKey('Door4', 13, 18, 'gold'),
			new DoorLever('Door5', 7, 10, 7, 9)
		];

		this.Keys = [
			new Key(12, 21, 'copper'),
			new Key(1, 16, 'gold')
		];

		this.MyKeys = [];
	}

	// Override del metodo load della classe parent
	load(cb){

		console.log('Loading assets (difficulty: 3)');

		// Chiama il metodo load della classe parent
		super.load(cb, 3);
	}
};