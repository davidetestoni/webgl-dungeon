// Scena di test per esperimenti con la camera e il movimento

'use strict';

// Costruttore dato un contesto webgl
var TestScene = function (gl) {
	this.gl = gl;
};

// Carica la scena
TestScene.prototype.Load = function (cb) {
    
    console.log('Loading test scene');

    // Questo serve a evitare errori nel callback passandogli 'this' dato
    // che le funzioni vengono ottimizzate prima che 'this' sia creato
	var me = this;

    // Scarica tutti gli asset richiesti in parallelo
	async.parallel({
		Models: function (callback) {
			async.map({
				TestModel: 'assets/meshes/cube.json'
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

            // TEMP: Per ora visualizziamo solo il piano
            // if (mesh.name !== 'Plane.010') break;

            // Crea l'oggetto
            var model = new Model(
                me.gl,
                mesh.name,
                mesh.vertices,
                [].concat.apply([], mesh.faces),
                mesh.normals,
                baseColor
            );

            // Cerca la trasformazione e setta la world matrix del modello scalato, ruotato e traslato
            /*
            var transf = []
            for (var j = 0; j < loadResults.Models.TestModel.rootnode.children.length; j++){
                var node = loadResults.Models.TestModel.rootnode.children[j];
                if (node.name === model.name){
                    model.world = mat4.multiply(model.world, model.world, node.transformation);
                    break;
                }
            }
            */
            // Inserisci il modello nella lista di modelli della scena
            me.Meshes.push(model);
        }

        // Imposta la posizione della point light nella scena
        me.lightPosition = vec3.fromValues(0, 0.0, 2.98971);

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

			pointLightPosition: me.gl.getUniformLocation(me.Program, 'pointLightPosition'),
			meshColor: me.gl.getUniformLocation(me.Program, 'meshColor'),
		};
		me.Program.attribs = {
			vPos: me.gl.getAttribLocation(me.Program, 'vPos'),
			vNorm: me.gl.getAttribLocation(me.Program, 'vNorm'),
		};

		// Crea la telecamera sull asse positivo delle Z che guarda l'origine
		me.camera = new Camera(
			vec3.fromValues(0, 0, 20), //Posizione iniziale della camera
			0, // alpha
			0  // beta
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
		Up: false,
		Right: false,
		Down: false,
		Left: false,
		Forward: false,
		Back: false,

		RotLeft: false,
		RotRight: false,
    };
    
    me.MousePosition = {
        X: 0.0,
        Y: 0.0,
        DX: 0.0,
        DY: 0.0,
        Initialized: false
    };

    // Imposta la velocità di movimento (può incrementare con power-up)
	me.MoveForwardSpeed = 3.5;
	me.RotateSpeed = 1.5;

	// Imposta la hitbox del personaggio
	me.hitboxWidth = 3;
	me.hitboxHeight = 6;
};

// Scarica la scena dalla memoria
TestScene.prototype.Unload = function () {
    
	this.Program = null;

	this.camera = null;
	this.lightPosition = null;

	this.Meshes = null;

	this.PressedKeys = null;

	this.MoveForwardSpeed = null;
	this.RotateSpeed = null;
};

// Aggancia gli eventi e inizia il loop
TestScene.prototype.Begin = function () {
	console.log('Beginning test scene');

	var me = this;

	// Aggancia i listener degli eventi
	this.__ResizeWindowListener = this._OnResizeWindow.bind(this);
	this.__KeyDownWindowListener = this._OnKeyDown.bind(this);
    this.__KeyUpWindowListener = this._OnKeyUp.bind(this);
    this.__MouseMoveWindowListener = this._OnMouseMove.bind(this);

	AddEvent(window, 'resize', this.__ResizeWindowListener);
	AddEvent(window, 'keydown', this.__KeyDownWindowListener);
    AddEvent(window, 'keyup', this.__KeyUpWindowListener);
    AddEvent(window, 'mousemove', this.__MouseMoveWindowListener);
	
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
TestScene.prototype.End = function () {
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
TestScene.prototype._Update = function (dt) {

	// Ottieni quali direzioni collidono con l'ambiente (e saranno perciò proibite)
	var collisions = this.GetCollisions();

    // Muovi la telecamera tramite i tasti
	if (this.PressedKeys.Forward && !this.PressedKeys.Back && !collisions.includes('back')) {
		this.camera.moveForward(dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Back && !this.PressedKeys.Forward && !collisions.includes('forward')) {
		this.camera.moveForward(-dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Right && !this.PressedKeys.Left && !collisions.includes('right')) {
		this.camera.moveRight(dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Left && !this.PressedKeys.Right && !collisions.includes('left')) {
		this.camera.moveRight(-dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Up && !this.PressedKeys.Down) {
		this.camera.rotateUp(dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Down && !this.PressedKeys.Up) {
		this.camera.rotateUp(-dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.RotRight && !this.PressedKeys.RotLeft) {
		this.camera.rotateRight(dt / 1000 * this.RotateSpeed);
	}

	if (this.PressedKeys.RotLeft && !this.PressedKeys.RotRight) {
		this.camera.rotateRight(-dt / 1000 * this.RotateSpeed);
    }
    
    
    if (this.MousePosition.DX !== 0.0){
        this.camera.rotateRight(-dt / 1000 * this.RotateSpeed * this.MousePosition.DX);
        this.MousePosition.DX = 0.0;
    }

    if (this.MousePosition.DY !== 0.0){
        this.camera.rotateUp(dt / 1000 * this.RotateSpeed * this.MousePosition.DY);
        this.MousePosition.DY = 0.0;
    }
   /*
    if (this.MousePosition.DX !== 0.0 || this.MousePosition.DY !== 0.0){
        this.camera.MoveByMouse(this.MousePosition.DX * this.RotateSpeed, -this.MousePosition.DY * this.RotateSpeed);
    } */

	this.camera.GetViewMatrix(this.viewMatrix);
};

TestScene.prototype.GetCollisions = function () {

	var pos = this.camera.position;
	var fwd = [0, 0, this.hitboxWidth]; // Z positivo
	var right = [0, 1, 0]; // Y positivo

	// Creiamo il vettore che guarda davanti (ruotiamo un vettore lungo l'asse y di alpha attorno all'asse x)
	vec3.rotateX(fwd, fwd, [0, 0, 0], this.camera.beta);

	// Da questo poi creiamo il vettore ortogonale right = forward x up (asse x)
	vec3.cross(right, fwd, right);

	var collisions = [];
	var epsilon = 0.1;
	var point = [0, 0, 0];
	var rand = Math.floor(Math.random() * 300);

	for(var dir of ['left', 'right', 'forward', 'back']){
		
		// Per ora proviamo solo con forward
		// if (dir !== 'forward') continue;

		// Setta il punto nella direzione cercata, distante quanto la hitbox del personaggio
		switch(dir){
			case 'left':
				point = [-right[0], -right[1], -right[2]];
				break;
			case 'right':
				point = right;
				break;
			case 'forward':
				point = fwd;
				break;
			case 'back':
				point = [-fwd[0], -fwd[1], -fwd[2]];
				break;
		}

		// Aggiungi lo scostamento alla posizione del personaggio
		vec3.add(point, point, pos);
	
		// Per ogni mesh, e per ogni triangolo di quella mesh, controlla se collide
		meshloop: for(var mesh of this.Meshes){
			for (var tri of mesh.triangles){
				// Calcola l'area del triangolo ABC usando i cross product
				var areaTot = this.TriArea(tri);
	
				// Calcola le aree degli altri triangoli formati dal nostro point con altri 2 vertici (DBC + ADC + ABD)
				var myArea = 
					this.TriArea([point, tri[1], tri[2]]) +
					this.TriArea([tri[0], point, tri[2]]) +
					this.TriArea([tri[0], tri[1], point]);
				
				if (rand % 99 == 0){
					// ATTENZIONE: Mai stampare questo ogni frame o impazzisce il pc
					console.log('DIR: '+dir+' TRIANGLE: '+tri+' POINT: '+point+' TOT: '+areaTot+' MINE: '+myArea);
				}
				
				// Se la differenza tra le due aree è minore di un epsilon, stiamo collidendo!
				if (Math.abs(areaTot - myArea) < epsilon){
					collisions.push(dir);
					break meshloop;
				}
			}
		}
	
		// Qui dovremmo anche checkare collisione up e down (in particolare se implementiamo i salti o i dislivelli nel dungeon).
		
	}

	return collisions;
};

TestScene.prototype.TriArea = function(tri){
	// Area = 0.5 * |(P1-P0)x(P2-P0)|
	var vec = [];
	var p1p0 = [];
	var p2p0 = [];
	vec3.subtract(p1p0, tri[1], tri[0]);
	vec3.subtract(p2p0, tri[2], tri[0]);
	vec3.cross(vec, p1p0, p2p0);
	var a1 = vec[0] * vec[0];
	var a2 = vec[1] * vec[1];
	var a3 = vec[2] * vec[2];
	return 0.5 * Math.sqrt(a1+a2+a3);
}

// Funzione di Render principale
TestScene.prototype._Render = function () {
    
    // Ottieni una reference comoda per gl
    var gl = this.gl;

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
	gl.uniform3fv(this.Program.uniforms.pointLightPosition, this.lightPosition);

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
TestScene.prototype._OnResizeWindow = function () {
    
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

TestScene.prototype._OnKeyDown = function (e) {
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
};

TestScene.prototype._OnKeyUp = function (e) {
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
};

TestScene.prototype._OnMouseMove = function (e) {

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
};