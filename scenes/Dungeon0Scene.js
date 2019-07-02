// Scena di test per esperimenti con la camera e il movimento
// In questa scena non tracciamo le celle e dunque non si triggerano gli eventi

'use strict';

class Dungeon0Scene extends DungeonScene {

	// Costruttore della classe figlia
	constructor(gl) {
		
		// Chiama il costruttore della classe parent
		super(gl);

		// Setta il wallhack di default
		this.wallHack = true;

		// Modifica i controlli accettati
		this.PressedKeys = {
			Up: false,
			Right: false,
			Down: false,
			Left: false,
			Forward: false,
			Back: false,
	
			RotLeft: false,
			RotRight: false,
		};
		
		// Aggiungi la mouse position
		this.MousePosition = {
			X: 0.0,
			Y: 0.0,
			DX: 0.0,
			DY: 0.0,
			Initialized: false
		};

		this.MoveForwardSpeed = 3.5;
		this.RotateSpeed = 1.5;

		this._OnKeyDown = function(e) {
			switch(e.code) {

				// Movimento WASD
				case 'KeyW':
					this.PressedKeys.Forward = true;
					break;
				case 'KeyA':
					this.PressedKeys.Left = true;
					break;
				case 'KeyS':
					this.PressedKeys.Back = true;
					break;
				case 'KeyD':
					this.PressedKeys.Right = true;
					break;
					
				// Movimento SU/GIU
				case 'ArrowUp':
					this.PressedKeys.Up = true;
					break;
				case 'ArrowDown':
					this.PressedKeys.Down = true;
					break;
					
				// Rotazione SX/DX
				case 'ArrowRight':
					this.PressedKeys.RotRight = true;
					break;
				case 'ArrowLeft':
					this.PressedKeys.RotLeft = true;
					break;
			}
		}

		this._OnKeyUp = function(e) {
			switch(e.code) {

				// Movimento WASD
				case 'KeyW':
					this.PressedKeys.Forward = false;
					break;
				case 'KeyA':
					this.PressedKeys.Left = false;
					break;
				case 'KeyS':
					this.PressedKeys.Back = false;
					break;
				case 'KeyD':
					this.PressedKeys.Right = false;
					break;
					
				// Movimento SU/GIU
				case 'ArrowUp':
					this.PressedKeys.Up = false;
					break;
				case 'ArrowDown':
					this.PressedKeys.Down = false;
					break;
					
				// Rotazione SX/DX
				case 'ArrowRight':
					this.PressedKeys.RotRight = false;
					break;
				case 'ArrowLeft':
					this.PressedKeys.RotLeft = false;
					break;
			}
		}

		this._OnMouseMove = function(e) {
			var mp = this.MousePosition;

			var newx = e.clientX;
			var newy = e.clientY;

			// Se la posizione del mouse non era ancora stata inizializzata,
			// setta tutti i valori con la posizione corrente
			if (!mp.Initialized){
				mp.X = newx;
				mp.Y = newy;
				mp.Initialized = true;
				return;
			}    

			// Incrementa o decrementa i delta spaziali
			mp.DX += newx - mp.X;
			mp.DY += newy - mp.Y;

			// Imposta le nuove coordinate
			mp.X = newx;
			mp.Y = newy;
		}
	}

	// Override del metodo load della classe parent
	load(cb, difficulty){

		console.log('Loading assets (debug mode)');

		// Chiama il metodo load della classe parent
		super.load(cb, difficulty);
	}

	// Override del metodo begin
	begin(){

		// Aggancia un ulteriore listener
		this.__MouseMoveWindowListener = this._OnMouseMove.bind(this);
		AddEvent(window, 'mousemove', this.__MouseMoveWindowListener);

		super.begin();
	}

	// Override del metodo update
	update(dt){

		// Muovi la telecamera tramite i tasti
		if (this.PressedKeys.Forward && !this.PressedKeys.Back) {
			this.Camera.moveForward(dt / 1000 * this.MoveForwardSpeed);
		}

		if (this.PressedKeys.Back && !this.PressedKeys.Forward) {
			this.Camera.moveForward(-dt / 1000 * this.MoveForwardSpeed);
		}

		if (this.PressedKeys.Right && !this.PressedKeys.Left) {
			this.Camera.moveRight(dt / 1000 * this.MoveForwardSpeed);
		}

		if (this.PressedKeys.Left && !this.PressedKeys.Right) {
			this.Camera.moveRight(-dt / 1000 * this.MoveForwardSpeed);
		}

		if (this.PressedKeys.Up && !this.PressedKeys.Down) {
			this.Camera.rotateUp(dt / 1000 * this.MoveForwardSpeed);
		}

		if (this.PressedKeys.Down && !this.PressedKeys.Up) {
			this.Camera.rotateUp(-dt / 1000 * this.MoveForwardSpeed);
		}

		if (this.PressedKeys.RotRight && !this.PressedKeys.RotLeft) {
			this.Camera.rotateRight(dt / 1000 * this.RotateSpeed);
		}

		if (this.PressedKeys.RotLeft && !this.PressedKeys.RotRight) {
			this.Camera.rotateRight(-dt / 1000 * this.RotateSpeed);
		}
		
		
		if (this.MousePosition.DX !== 0.0){
			this.Camera.rotateRight(-dt / 1000 * this.RotateSpeed * this.MousePosition.DX);
			this.MousePosition.DX = 0.0;
		}

		if (this.MousePosition.DY !== 0.0){
			this.Camera.rotateUp(dt / 1000 * this.RotateSpeed * this.MousePosition.DY);
			this.MousePosition.DY = 0.0;
		}

		this.Camera.getViewMatrix(this.viewMatrix);
	}

	// Override del metodo end
	end() {

		super.end();

		// Rimuovi anche l'evento aggiunto dall'override di begin
		if (this.__MouseMoveWindowListener) {
			RemoveEvent(window, 'mousemove', this.__MouseMoveWindowListener);
		}
	}
}