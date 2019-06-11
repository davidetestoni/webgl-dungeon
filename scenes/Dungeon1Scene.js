'use strict';

var occupation = [
    ["*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*"],
    ["*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*"," "," ","*","*","*","*","*","*"],
    ["*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*"," "," ","*","*","*","*","*","*"],
    ["*","*","*","*","*","*","*","*","*","*","*","*"," "," "," ","*","*"," "," ","*","*","*","*","*"],
    ["*","*","*","*","*","*","*","*","*","*","*","*"," ","*"," "," "," ","*"," ","*","*","*","*","*"],
    ["*","*","*","*","*","*"," ","*","*","*","*","*"," ","*","*"," "," ","*"," "," ","*","*","*","*"],
    ["*","*","*","*","*","*"," ","*","*","*"," "," "," "," "," ","*","*","*"," "," ","*","*","*","*"],
    ["*","*","*","*","*","*"," ","*","*","*"," ","*","*","*"," ","*"," ","*"," ","*","*","*","*","*"],
    ["*","*","*","*","*","*"," ","*","*"," "," ","*"," "," "," ","*"," ","*"," ","*","*","*","*","*"],
    ["*","*","*","*","*","*"," "," "," "," "," "," ","*"," "," ","*"," "," "," ","*","*","*","*","*"],
    ["*","*","*","*","*","*","*","*","*"," "," ","*","*"," ","*"," "," ","*"," ","*","*","*","*","*"],
    ["*","*","*","*","*","*"," "," "," ","*","*"," ","*"," ","*"," "," ","*"," ","*","*","*","*","*"],
    ["*","*","*","*"," "," "," "," "," "," "," "," "," "," ","*"," ","*"," "," "," ","*"," ","*","*"],
    ["*","*","*","*"," ","*"," "," "," ","*","*"," ","*","*"," "," ","*","*"," ","*"," "," "," ","*"],
    ["*","*","*","*"," ","*","*","*","*","*","*","*"," "," "," "," ","*"," "," "," ","*"," ","*","*"],
    ["*","*"," "," "," "," "," "," "," "," "," "," "," ","*","*"," ","*"," "," "," ","*"," ","*","*"],
    ["*","*"," ","*"," ","*","*","*","*","*","*","*","*","*","*"," "," ","*"," ","*"," "," ","*","*"],
    ["*","*"," ","*"," "," "," "," "," "," "," "," "," "," "," ","*"," "," "," "," "," ","*","*","*"],
    ["*","*"," ","*"," "," "," ","*","*","*"," "," "," ","*","*","*","*","*"," ","*","*","*","*","*"],
    ["*","*"," ","*","*","*","*","*"," ","*"," ","*","*"," "," "," "," "," "," ","*","*","*","*","*"],
    ["*"," "," "," ","*","*","*"," "," "," "," "," "," "," ","*","*","*","*","*","*","*","*","*","*"],
    ["*"," "," "," "," "," "," "," ","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*"],
    ["*"," "," "," ","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*"],
    ["*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*","*"]
	]; // 24 x 24

// Costruttore dato un contesto webgl
var Dungeon1Scene = function (gl) {
	this.gl = gl;
};

// Carica la scena
Dungeon1Scene.prototype.Load = function (cb) {
    
    console.log('Loading the dungeon (difficulty: 1)');

    // Questo serve a evitare errori nel callback passandogli 'this' dato
    // che le funzioni vengono ottimizzate prima che 'this' sia creato
	var me = this;

    // Scarica tutti gli asset richiesti in parallelo
	async.parallel({
		Models: function (callback) {
			async.map({
				TestModel: 'assets/meshes/Dungeon.diff1.json'
			}, LoadJSONResource, callback);
		},
		ShaderCode: function (callback) {
			async.map({
				'vsText': 'shaders/vs.glsl',
				'fsText': 'shaders/fs.glsl',
			}, LoadTextResource, callback);
		}
	}, function (loadErrors, loadResults) {
		if (loadErrors) {
			cb(loadErrors);
			return;
		}

        me.Meshes = [];
        var baseColor = vec4.fromValues(0.5, 0.5, 0.5, 1.0);

		// Crea gli oggetti con le informazioni dei modelli
		for (var i = 0; i < loadResults.Models.TestModel.meshes.length; i++) {

            var mesh = loadResults.Models.TestModel.meshes[i];

            // Crea l'oggetto
            var model = new Model(
                me.gl,
                mesh.name,
                mesh.vertices,
                [].concat.apply([], mesh.faces),
                mesh.normals,
                baseColor
            );

            // Inserisci il modello nella lista di modelli della scena
            me.Meshes.push(model);
        }

        // Imposta la posizione della point light nella scena
        me.lightPosition = vec3.fromValues(3, 1,0);

		// Crea il programma
		me.Program = CreateShaderProgram(
            me.gl,
            loadResults.ShaderCode.vsText,
			loadResults.ShaderCode.fsText
		);
		if (me.Program.error) {
            cb('Program ' + me.Program.error);
            return;
		}

        // Ottieni le location delle proprietà nello shader
		me.Program.uniforms = {
			mProj: me.gl.getUniformLocation(me.Program, 'mProj'),
			mView: me.gl.getUniformLocation(me.Program, 'mView'),
			mWorld: me.gl.getUniformLocation(me.Program, 'mWorld'),
			//variabili dello shader per la point light
			PLightDecay: me.gl.getUniformLocation(me.Program, 'PLightDecay'),
			PLightTarget: me.gl.getUniformLocation(me.Program, 'PLightTarget'),
			pointLightPosition: me.gl.getUniformLocation(me.Program, 'pointLightPosition'),
			
			meshColor: me.gl.getUniformLocation(me.Program, 'meshColor'),
		};
		me.Program.attribs = {
			vPos: me.gl.getAttribLocation(me.Program, 'vPos'),
			vNorm: me.gl.getAttribLocation(me.Program, 'vNorm'),
		};

		// Crea la telecamera sull asse positivo delle Z che guarda l'origine
		me.camera = new Camera(
			vec3.fromValues(0, 0.5, 0), //Posizione iniziale della camera nell'origine
			0, // alpha
			-Math.PI/2  // beta
		);

        me.viewMatrix = mat4.create();

        // Crea la prospettiva
		me.projMatrix = mat4.create();
		mat4.perspective(
			me.projMatrix,
			glMatrix.toRadian(45), 
			me.gl.canvas.clientWidth / me.gl.canvas.clientHeight,
			0.35,
			85.0
		);

        // Chiama il callback
		cb();
	});

	me.PressedKeys = {
		Forward: false,
		Back: false,
		RotLeft: false,
		RotRight: false,
    };

	// Settiamo la cella iniziale nella tabella delle occupation
	me.Cell = {
		X: 6,
		Y: 9
	}

	// Settiamo la direzione iniziale
	me.Direction = "right";

	me.RotateDelay = 200; // Quanto velocemente ruotiamo con le frecce dx/sx
	me.MoveDelay = 500; // Quanto velocemente andiamo avanti

	me.IsMoving = false; // Non stiamo facendo l'animazione del movimento, quindi accettiamo gli input del player
	me.IsRotating = false;

	me.MovementAnimation = {
		direction: "forward", // La direzione dell'animazione
		covered: 0, // La distanza ricoperta finora
		start: performance.now(), // Il tempo di inizio dell'animazione
		duration: 500 // La durata
	};
	me.RotationAnimation = {
		direction: "right",
		covered: 0,
		start: performance.now(),
		duration: 250
	};
};

// Scarica la scena dalla memoria
Dungeon1Scene.prototype.Unload = function () {
    
	this.Program = null;

	this.camera = null;
	this.lightPosition = null;

	this.Meshes = null;

	this.PressedKeys = null;

	this.RotateDelay = null;
	this.MoveDelay = null;
	this.IsMoving = null;
	this.IsRotating = null;
	this.MovementAnimation = null;
	this.RotationAnimation = null;
};

// Aggancia gli eventi e inizia il loop
Dungeon1Scene.prototype.Begin = function () {
	console.log('Beginning the scene');

	var me = this;

	// Aggancia i listener degli eventi
	this.__ResizeWindowListener = this._OnResizeWindow.bind(this);
	this.__KeyDownWindowListener = this._OnKeyDown.bind(this);
    this.__KeyUpWindowListener = this._OnKeyUp.bind(this);

	AddEvent(window, 'resize', this.__ResizeWindowListener);
	AddEvent(window, 'keydown', this.__KeyDownWindowListener);
    AddEvent(window, 'keyup', this.__KeyUpWindowListener);
	
	var previousFrame = performance.now(); // istante del frame precedente
    var dt = 0; // il delta di tempo tra un frame e l'altro
    
    // Definizione della funzione di Render Loop
	var loop = function (currentFrameTime) {

        // Ottieni il nuovo delta di tempo
        dt = currentFrameTime - previousFrame;
        
        // Fai l'update di telecamera, modelli ecc..
        me._Update(dt);
        
        // Il frame corrente diventa vecchio
		previousFrame = currentFrameTime;

        // Disegna effettivamente sullo schermo
        me._Render();
        
        // Chiama di nuovo questa funzione
		me.nextFrameHandle = requestAnimationFrame(loop);
    };
    
    // Chiama il loop per la prima volta
	me.nextFrameHandle = requestAnimationFrame(loop);

    // Chiama il resize iniziale sulle dimensioni correnti della finestra
	me._OnResizeWindow();
};

// Sgancia gli eventi e termina il loop
Dungeon1Scene.prototype.End = function () {
	if (this.__ResizeWindowListener) {
		RemoveEvent(window, 'resize', this.__ResizeWindowListener);
	}
	if (this.__KeyUpWindowListener) {
		RemoveEvent(window, 'keyup', this.__KeyUpWindowListener);
	}
	if (this.__KeyDownWindowListener) {
		RemoveEvent(window, 'keydown', this.__KeyDownWindowListener);
	}

	if (this.nextFrameHandle) {
		cancelAnimationFrame(this.nextFrameHandle);
	}
};

/*
Metodi privati
*/

// Fai l'update della telecamera e della posizione/rotazione degli oggetti
// in base a quali tasti sono premuti quando viene disegnato il frame
Dungeon1Scene.prototype._Update = function (dt) {

	var me = this;
	
	// Se ci stiamo muovendo, non accettiamo input ma facciamo il display dell'animazione
	if (me.IsMoving) {

		var entity = this.Interpolate(1, this.MovementAnimation.duration, performance.now() - this.MovementAnimation.start);

		// Ci muoviamo di una quantità che equivale al punto in cui dovremmo essere meno la distanza già coperta
		if (me.MovementAnimation.direction == 'forward'){

			this.camera.moveForward(entity - this.MovementAnimation.covered);
		}
		else{

			this.camera.moveForward(-(entity - this.MovementAnimation.covered));
		}

		this.MovementAnimation.covered = entity;

		this.camera.GetViewMatrix(this.viewMatrix);
		return;
	}
	// Se ci stiamo ruotando, non accettiamo input ma facciamo il display dell'animazione
	else if (me.IsRotating){

		var entity = this.Interpolate(glMatrix.toRadian(90), this.RotationAnimation.duration, performance.now() - this.RotationAnimation.start);

		if (me.RotationAnimation.direction == 'right'){

			this.camera.rotateRight(entity - this.RotationAnimation.covered);
		}
		else{

			this.camera.rotateRight(-(entity - this.RotationAnimation.covered));
		}

		this.RotationAnimation.covered = entity;

		this.camera.GetViewMatrix(this.viewMatrix);
		return;
	}

	// Se premiamo destra, ruota di 90 gradi a destra
	if (this.PressedKeys.RotRight){
		//this.camera.rotateRight(glMatrix.toRadian(90));
		me.Direction = this.GetNextDirection(true);
		me.IsRotating = true;
		
		me.RotationAnimation = {
			direction: 'right',
			covered: 0,
			start: performance.now(),
			duration: me.RotateDelay
		}

		setTimeout(function() {me.IsRotating = false; me.PerformFinalRotation(1); }, me.RotateDelay); // Sblocca i comandi finita la rotazione
	}

	// Se premiamo sinistra, ruota di -90 gradi a destra
	else if (this.PressedKeys.RotLeft){
		//this.camera.rotateRight(glMatrix.toRadian(-90));
		me.Direction = this.GetNextDirection(false);
		me.IsRotating = true;
		
		me.RotationAnimation = {
			direction: 'left',
			covered: 0,
			start: performance.now(),
			duration: me.RotateDelay
		}

		setTimeout(function() {me.IsRotating = false; me.PerformFinalRotation(-1); }, me.RotateDelay); // Sblocca i comandi finita la rotazione
	}

	// Se premiamo avanti e non ci sono muri, vai avanti di uno step
	else if (this.PressedKeys.Forward){
		var target = this.GetTargetCell(false);
		if (occupation[target.Y][target.X] == ' '){
			//this.camera.moveForward(1);
			me.Cell = target;
			me.IsMoving = true;
			
			me.MovementAnimation = {
				direction: 'forward',
				covered: 0,
				start: performance.now(),
				duration: me.MoveDelay
			}

			setTimeout(function() {me.IsMoving = false; me.PerformFinalMovement(1); }, me.MoveDelay); // Sblocca i comandi finito il movimento
		}
	}

	// Se premiamo indietro e non ci sono muri, vai indietro di uno step
	else if (this.PressedKeys.Back){
		var target = this.GetTargetCell(true);
		if (occupation[target.Y][target.X] == ' '){
			//this.camera.moveForward(-1);
			me.Cell = target;
			me.IsMoving = true;
			
			me.MovementAnimation = {
				direction: 'back',
				covered: 0,
				start: performance.now(),
				duration: me.MoveDelay
			}

			setTimeout(function() { me.IsMoving = false; me.PerformFinalMovement(-1); }, me.MoveDelay); // Sblocca i comandi finito il movimento
		}
	}

	this.camera.GetViewMatrix(this.viewMatrix);
};

Dungeon1Scene.prototype.Interpolate = function(targetPoint, animationTime, currentTime) {

	// Calcola il coeff. angolare della retta passante per l'origine
	var m = targetPoint / animationTime;

	// Ritorna la posizione in cui dovremmo essere ora
	return m * currentTime;
};

Dungeon1Scene.prototype.PerformFinalMovement = function(forward) {

	// Se non facciamo questo, l'animazione potrebbe fermarsi prima di aver raggiunto il punto finale e muoversi ad es. di 0.97 invece che 1
	this.camera.moveForward(forward * (1 - this.MovementAnimation.covered));
	this.camera.GetViewMatrix(this.viewMatrix);
}

Dungeon1Scene.prototype.PerformFinalRotation = function(right) {

	this.camera.rotateRight(right * (glMatrix.toRadian(90) - this.RotationAnimation.covered));
	this.camera.GetViewMatrix(this.viewMatrix);
}

Dungeon1Scene.prototype.GetTargetCell = function (behind) {
	
	// Dovremmo verificare anche se siamo fuori dai bordi della matrice ma la matrice è stata fatta in modo che questo non succeda
	var dir = this.Direction;
	if (behind){
		switch (dir){
			case 'right':
				dir = 'left';
				break;

			case 'left':
				dir = 'right';
				break;

			case 'up':
				dir = 'down';
				break;

			case 'down':
				dir = 'up';
				break;
		}
	}

	switch(dir){
		case 'right':
			return { Y: this.Cell.Y, X: this.Cell.X + 1 };

		case 'left':
			return { Y: this.Cell.Y, X: this.Cell.X - 1 };

		case 'up':
			return { Y: this.Cell.Y - 1, X: this.Cell.X };

		case 'down':
			return { Y: this.Cell.Y + 1, X: this.Cell.X };
	}
};

Dungeon1Scene.prototype.GetNextDirection = function(clockwise) {

	var directions = ["up", "right", "down", "left"];
	var index = directions.indexOf(this.Direction);

	if (clockwise){
		if (index == directions.length - 1) return directions[0];
		else return directions[index + 1];
	}
	else {
		if (index == 0) return directions[directions.length - 1];
		else return directions[index - 1];
	}
}

// Funzione di Render principale
Dungeon1Scene.prototype._Render = function () {
    
    // Ottieni una reference comoda per gl
    var gl = this.gl;
   
//prendo i valori dalla pagina HTML e creo il vettore posizione point light
    var PLpositions= vec3.fromValues(document.getElementById("PLightX").value/10,document.getElementById("PLightY").value/10,document.getElementById("PLightZ").value/10);
  	var Decay= document.getElementById("PLightDecay").value/5;
  	  	var Target= document.getElementById("PLightTarget").value/20;

    // Abilita backface culling e zorder
	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

    // Resetta le dimensioni del viewport
	gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

    // Riempi con un colore di base nero dove non c'è nulla da disegnare.
    gl.clearColor(0, 0, 0, 1);
    
    // Maschera di bitwise OR che definisce quali buffers pulire
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // Assegnamo il programma al contesto webgl
    gl.useProgram(this.Program);
    
    // Assegna i valori alle uniform degli shader
    // (location, transpose, value)
	gl.uniformMatrix4fv(this.Program.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.Program.uniforms.mView, gl.FALSE, this.viewMatrix);

    //ogni ciclo di render passo allo shader i nuovi valori di posizione decay e target
	gl.uniform3fv(this.Program.uniforms.pointLightPosition, PLpositions);
	gl.uniform1f(this.Program.uniforms.PLightDecay,Decay );
	gl.uniform1f(this.Program.uniforms.PLightTarget,Target );

	// Disegna i modelli
	for (var i = 0; i < this.Meshes.length; i++) {
        
        // Uniform del modello
		gl.uniformMatrix4fv(
			this.Program.uniforms.mWorld,
			gl.FALSE,
			this.Meshes[i].world
		);
		gl.uniform4fv(
			this.Program.uniforms.meshColor,
			this.Meshes[i].color
		);

		// Riempi il buffer dei vertici
		gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].vbo);
		gl.vertexAttribPointer(
			this.Program.attribs.vPos,
			3, gl.FLOAT, gl.FALSE,
			0, 0
		);
		gl.enableVertexAttribArray(this.Program.attribs.vPos);

        // Riempi il buffer delle normali
		gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].nbo);
		gl.vertexAttribPointer(
			this.Program.attribs.vNorm,
			3, gl.FLOAT, gl.FALSE,
			0, 0
		);
		gl.enableVertexAttribArray(this.Program.attribs.vNorm);		

		gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Riempi il buffer degli indici
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Meshes[i].ibo);
		gl.drawElements(gl.TRIANGLES, this.Meshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}
};

/*
Listener degli eventi
*/

// Ridimensiona il canvas quando la finestra viene ridimensionata
Dungeon1Scene.prototype._OnResizeWindow = function () {
    
    var gl = this.gl;

    // Adottiamo un rapporto 16:9
    // Cerchiamo di riempire tutta la larghezza della finestra
	var targetHeight = window.innerWidth * 9 / 16;

	if (window.innerHeight > targetHeight) {
        
        // Centra verticalmente
		gl.canvas.width = window.innerWidth;
		gl.canvas.height = targetHeight;
		gl.canvas.style.left = '0px';
		gl.canvas.style.top = (window.innerHeight - targetHeight) / 2 + 'px';
    }
    else {

		// Centra orizzontalmente
		gl.canvas.width = window.innerHeight * 16 / 9;
		gl.canvas.height = window.innerHeight;
		gl.canvas.style.left = (window.innerWidth - (gl.canvas.width)) / 2 + 'px';
		gl.canvas.style.top = '0px';
	}

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

Dungeon1Scene.prototype._OnKeyDown = function (e) {
	switch(e.code) {

        // Movimento in avanti/indietro
		case 'KeyW':
		case 'ArrowUp':
			this.PressedKeys.Forward = true;
			break;

		case 'KeyS':
		case 'ArrowDown':
			this.PressedKeys.Back = true;
			break;

		// Rotazione SX/DX
		case 'KeyD':
		case 'ArrowRight':
			this.PressedKeys.RotRight = true;
			break;

		case 'KeyA':
		case 'ArrowLeft':
			this.PressedKeys.RotLeft = true;
			break;
	}
};

Dungeon1Scene.prototype._OnKeyUp = function (e) {
	switch(e.code) {

        // Movimento in avanti/indietro
		case 'KeyW':
		case 'ArrowUp':
			this.PressedKeys.Forward = false;
			break;

		case 'KeyS':
		case 'ArrowDown':
			this.PressedKeys.Back = false;
			break;

		// Rotazione SX/DX
		case 'KeyD':
		case 'ArrowRight':
			this.PressedKeys.RotRight = false;
			break;

		case 'KeyA':
		case 'ArrowLeft':
			this.PressedKeys.RotLeft = false;
			break;
	}
};