/*

Questa classe è la classe da cui ereditano le scene delle varie difficoltà e contiene
le variabili e i metodi principali per l'esecuzione delle funzionalità di base
comuni a tutte le scene del gioco.

*/

'use strict';

class DungeonScene {

    // Costruttore del dungeon generico
    constructor(gl) {

        this.gl = gl;

        this.occupation = [
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
            
        this.wallHack = false;
        
        this.Lights= {
            
            //lantern parameters
            pointLightPosition: [0,0,0],
            PLightDecay: 2,
            PLightTarget: 3,
            PLColor: [1.0,0.0,0.0,1.0],

            //directional parameters
            directionalLightColor: [1.0,0.0,1.0,1.0],
            directionalLightDir: [45,45],


            // effect colors
            ambientLightColor: [1.0,0.0,1.0,1.0],
            ambientLightLowColor: [1.0,1.0,0.0,1.0],
            ambientMatColor: [0.0,0.1,0.0,1.0],
            diffuseColor: [0.8,1.0,1.0,0.0],
            specularColor: [1.0,1.0,1.0,1.0],
            emitColor: [0.1,0.0,0.0,1.0],

            //others
            SpecShine: 100,
            DToonTh:90,
            SToonTh :50,
            

            //types
            lightType:  [1,1],
            ambientType: [1,0],
            diffuseType: [1,0],
            specularType: [1,0],
            emissionType: [1,0]
        }

        // Setta i default alle opzioni di illuminazione
        document.getElementById('PLightDecay').value = this.Lights.PLightDecay;
        document.getElementById('PLightTarget').value = this.Lights.PLightTarget;
        document.getElementById('diffuseLightColor').value = colorToHex(this.Lights.diffuseColor);
        document.getElementById('pointLightColor').value = colorToHex(this.Lights.PLColor);
        document.getElementById('emitLightColor').value = colorToHex(this.Lights.emitColor);
        document.getElementById('ambientLightColor').value = colorToHex(this.Lights.ambientLightColor);
        document.getElementById('ambientLightLowColor').value = colorToHex(this.Lights.ambientLightLowColor);
        document.getElementById('ambientMatColor').value = colorToHex(this.Lights.ambientMatColor);
        document.getElementById('specularLightColor').value = colorToHex(this.Lights.specularColor);
        document.getElementById('directionalLightColor').value = colorToHex(this.Lights.directionalLightColor);
        document.getElementById('directionalLightDirAlpha').value = this.Lights.directionalLightDir[0];
        document.getElementById('directionalLightDirBeta').value = this.Lights.directionalLightDir[1];

        //questi li setto a mano per comodità
        document.getElementById('AmbientType').value = "Ambient";
        document.getElementById('DiffuseType').value = "Lambert";
        document.getElementById('SpecularType').value = "Phong";
        document.getElementById('LightType').value = "PointPlusDir";

        this.PressedKeys = {
            Forward: false,
            Back: false,
            RotLeft: false,
            RotRight: false,
            F: false,
            H: false
        };

        // Settiamo la cella iniziale nella tabella delle occupation
        this.Cell = {
            X: 6,
            Y: 9
        };
        PlaceMinimapMarker(9, 6);
        ColorMinimapCell(9, 6, 'white');

        // Settiamo la cella in cui si vince
        this.WinCell = {
            X: 14,
            Y: 17
        };

        // Settiamo la direzione iniziale
        this.Direction = "right";

        this.RotateDelay = 200; // Quanto velocemente ruotiamo con le frecce dx/sx
        this.MoveDelay = 500; // Quanto velocemente andiamo avanti

        this.IsMoving = false; // Non stiamo facendo l'animazione del movimento, quindi accettiamo gli input del player
        this.IsRotating = false;

        this.MovementAnimation = {
            direction: "forward", // La direzione dell'animazione
            covered: 0, // La distanza ricoperta finora
            start: performance.now(), // Il tempo di inizio dell'animazione
            duration: 500 // La durata
        };

        this.RotationAnimation = {
            direction: "right",
            covered: 0,
            start: performance.now(),
            duration: 250
        };

        /*
        Listener degli eventi
        */

        // Ridimensiona il canvas quando la finestra viene ridimensionata
        this._onResizeWindow = function() {
            
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
        }

        this._onKeyDown = function(e) {
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

                case 'KeyF':
                    this.PressedKeys.F = true;
                    break;

                case 'KeyH':
                    this.PressedKeys.H = true;
                    break;
            }
        }

        this._onKeyUp = function(e) {
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

                case 'KeyF':
                    this.PressedKeys.F = false;
                    break;

                case 'KeyH':
                    this.PressedKeys.H = false;
                    break;
            }
        };
     }

    // Carica gli asset
    load(cb, difficulty){

        // Questo serve a evitare errori nel callback passandogli 'this' dato
        // che le funzioni vengono ottimizzate prima che 'this' sia creato
        var me = this;

        // Scarica tutti gli asset richiesti in parallelo
        async.parallel({
            Models: function (callback) {
                async.map({
                    DungeonModel: 'assets/meshes/Dungeon.diff' + difficulty + '.json'
                }, LoadJSONResource, callback);
            },
            ShaderCode: function (callback) {
                async.map({
                    'vsText': 'shaders/vs.glsl',
                    'fsText': 'shaders/fs.glsl',
                }, LoadTextResource, callback);
            },
            Images: function (callback) {
                async.map({
                    'floor': 'assets/textures/floor.png',
                    'ceiling': 'assets/textures/ceiling.png',
                    'wall': 'assets/textures/wall.png',
                    'border': 'assets/textures/border.png',
                    'door': 'assets/textures/door.png',
                    'copperKey': 'assets/textures/copperKey.png',
                    'goldKey': 'assets/textures/goldKey.png'
                }, LoadImage, callback);
            }
        }, function (loadErrors, loadResults) {
            if (loadErrors) {
                cb(loadErrors);
                return;
            }

            // Meshes
            me.Meshes = [];
            var baseColor = vec4.fromValues(0.5, 0.5, 0.5, 1.0);

            // Crea gli oggetti con le informazioni dei modelli
            for (var i = 0; i < loadResults.Models.DungeonModel.meshes.length; i++) {

                var mesh = loadResults.Models.DungeonModel.meshes[i];

                var texCoords = null;
                if (mesh.texturecoords){
                    texCoords = mesh.texturecoords[0];
                }

                var mat = loadResults.Models.DungeonModel.materials[mesh.materialindex];

                var material = {
                    Name: mat.properties[0].value,
                    ShadingMode: mat.properties[1].value,
                    Ambient: mat.properties[2].value,
                    Diffuse: mat.properties[3].value,
                    Specular: mat.properties[4].value,
                    Emissive: mat.properties[5].value,
                    Shininess: mat.properties[6].value
                };

                // Crea l'oggetto
                var model = new Model(
                    me.gl,
                    mesh.name,
                    mesh.vertices,
                    [].concat.apply([], mesh.faces),
                    mesh.normals,
                    texCoords,
                    baseColor,
                    material
                );

                // Inserisci il modello nella lista di modelli della scena
                me.Meshes.push(model);
            }

            // Inizializza le textures
            me.Textures = {
                wallTexture: me.gl.createTexture(),
                floorTexture: me.gl.createTexture(),
                ceilingTexture: me.gl.createTexture(),
                borderTexture: me.gl.createTexture(),
                doorTexture: me.gl.createTexture(),
                goldKeyTexture: me.gl.createTexture(),
                copperKeyTexture: me.gl.createTexture()
            };

            // Funzione che binda una texture
            var bindTexture = function(texture, image, flipY = false, flipX = false){
                
                me.gl.bindTexture(me.gl.TEXTURE_2D, texture);

                // Wrapping con clamp to edge (repeat non funziona per texture non quadrate)
                me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
                me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
                
                // Flippa se necessario
                if (flipY){
                    me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true)
                }

                if (flipX){
                    me.gl.pixelStorei(me.gl.UNPACK_FLIP_X_WEBGL, true)
                }

                // Interpolazione lineare (low spec)
                me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
                me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);
                
                // Carica l'immagine nella texture
                me.gl.texImage2D(
                    me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA,
                    me.gl.UNSIGNED_BYTE,
                    image
                );

                me.gl.bindTexture(me.gl.TEXTURE_2D, null);
            }
            
            bindTexture(me.Textures.wallTexture, loadResults.Images['wall'], true);
            bindTexture(me.Textures.floorTexture, loadResults.Images['floor']);
            bindTexture(me.Textures.ceilingTexture, loadResults.Images['ceiling']);
            bindTexture(me.Textures.borderTexture, loadResults.Images['border']);
            bindTexture(me.Textures.doorTexture, loadResults.Images['door']);
            bindTexture(me.Textures.goldKeyTexture, loadResults.Images['goldKey']);
            bindTexture(me.Textures.copperKeyTexture, loadResults.Images['copperKey']);

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
                
                // Point Light
                PLightDecay: me.gl.getUniformLocation(me.Program, 'PLightDecay'),
                PLightTarget: me.gl.getUniformLocation(me.Program, 'PLightTarget'),
                pointLightPosition: me.gl.getUniformLocation(me.Program, 'pointLightPosition'),
                PLColor: me.gl.getUniformLocation(me.Program, 'PLColor'),

                    //dir light
                directionalLightColor: me.gl.getUniformLocation(me.Program, 'directionalLightColor'),
                directionalLightDir: me.gl.getUniformLocation(me.Program, 'directionalLightDir'),


                ambientLightColor: me.gl.getUniformLocation(me.Program, 'ambientLightColor'),
                ambientLightLowColor: me.gl.getUniformLocation(me.Program, 'ambientLightLowColor'),
                specularColor: me.gl.getUniformLocation(me.Program, 'specularColor'),
                ambientMatColor: me.gl.getUniformLocation(me.Program, 'ambientMatColor'),
                emitColor: me.gl.getUniformLocation(me.Program, 'emitColor'),
                diffuseColor: me.gl.getUniformLocation(me.Program, 'diffuseColor'),


                SpecShine: me.gl.getUniformLocation(me.Program, 'SpecShine'),
                DToonTH: me.gl.getUniformLocation(me.Program, 'DToonTH'),
                SToonTh: me.gl.getUniformLocation(me.Program, 'SToonTh'),

                // Tipi
                ambientType: me.gl.getUniformLocation(me.Program, 'ambientType'),
                diffuseType: me.gl.getUniformLocation(me.Program, 'diffuseType'),
                specularType: me.gl.getUniformLocation(me.Program, 'specularType'),
                emissionType: me.gl.getUniformLocation(me.Program, 'emissionType'),
                 lightType: me.gl.getUniformLocation(me.Program, 'lightType'),

                meshColor: me.gl.getUniformLocation(me.Program, 'meshColor')
            };

            me.Program.attribs = {
                vPos: me.gl.getAttribLocation(me.Program, 'vPos'),
                vNorm: me.gl.getAttribLocation(me.Program, 'vNorm'),
                vTexCoord: me.gl.getAttribLocation(me.Program, 'vTexCoord')
            };

            // Crea la telecamera sull asse positivo delle Z che guarda l'origine
            me.Camera = new Camera(
                vec3.fromValues(0, 0.5, 0), // Posizione iniziale della Camera nell'origine
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
    }

    initializeShader(cb) {
	
        var alpha= this.Lights.directionalLightDir[0]*Math.PI/180;
        var beta= this.Lights.directionalLightDir[1]*Math.PI/180;
        var gl= this.gl;
        gl.useProgram(this.Program);

        gl.uniform3fv(this.Program.uniforms.pointLightPosition, this.Camera.position);
        gl.uniform1f(this.Program.uniforms.PLightDecay, this.Lights.PLightDecay);
        gl.uniform1f(this.Program.uniforms.PLightTarget, this.Lights.PLightTarget);
        gl.uniform4fv(this.Program.uniforms.PLColor, this.Lights.PLColor);

        gl.uniform4fv(this.Program.uniforms.directionalLightColor, this.Lights.directionalLightColor);
        gl.uniform3fv(this.Program.uniforms.directionalLightDir,[Math.sin(alpha)*Math.sin(beta), Math.cos(alpha), Math.sin(alpha)*Math.cos(beta)]);

        gl.uniform1f(this.Program.uniforms.SpecShine, this.Lights.SpecShine);    

        gl.uniform4fv(this.Program.uniforms.ambientLightColor, this.Lights.ambientLightColor);
        gl.uniform4fv(this.Program.uniforms.ambientLightLowColor, this.Lights.ambientLightLowColor);
        gl.uniform4fv(this.Program.uniforms.specularColor, this.Lights.specularColor);
        gl.uniform4fv(this.Program.uniforms.ambientMatColor, this.Lights.ambientMatColor);
        gl.uniform4fv(this.Program.uniforms.emitColor, this.Lights.emitColor);
        gl.uniform4fv(this.Program.uniforms.diffuseColor, this.Lights.diffuseColor);
        gl.uniform4fv(this.Program.uniforms.emitColor, this.Lights.emitColor);

        gl.uniform2fv(this.Program.uniforms.lightType, this.Lights.lightType);
        gl.uniform2fv(this.Program.uniforms.ambientType, this.Lights.ambientType);
        gl.uniform2fv(this.Program.uniforms.diffuseType, this.Lights.diffuseType);
        gl.uniform2fv(this.Program.uniforms.specularType, this.Lights.specularType);
        gl.uniform2fv(this.Program.uniforms.emissionType, this.Lights.emissionType);
    }

    getParameters(mesh) {
	
        // Prendo i valori direttamente dagli slider
        this.Lights.PLightDecay = document.getElementById('PLightDecay').value;
        this.Lights.PLightTarget = document.getElementById('PLightTarget').value;
        this.Lights.PLColor = colorToRGB(document.getElementById('pointLightColor').value);

        this.Lights.directionalLightColor = colorToRGB(document.getElementById('directionalLightColor').value);
        this.Lights.directionalLightDir[0] = document.getElementById('directionalLightDirAlpha').value;
        this.Lights.directionalLightDir[1] = document.getElementById('directionalLightDirBeta').value;

        // Se usiamo i materiali specifici della mesh
        if (document.getElementById('useMaterials').checked) {
            var m = mesh.material;
            this.Lights.ambientMatColor = [m.Ambient[0] * 255, m.Ambient[1] * 255, m.Ambient[2] * 255, 1.0];
            this.Lights.diffuseColor = [m.Diffuse[0] * 255, m.Diffuse[1] * 255, m.Diffuse[2] * 255, 1.0];
            this.Lights.specularColor = [m.Specular[0] * 255, m.Specular[1] * 255, m.Specular[2] * 255, 1.0];
            this.Lights.emitLightColor = [m.Emissive[0] * 255, m.Emissive[1] * 255, m.Emissive[2] * 255, 1.0];
        }
        // Altrimenti settiamo quelli dati dall'utente
        else {
            this.Lights.ambientMatColor = colorToRGB(document.getElementById('ambientMatColor').value);
            this.Lights.diffuseColor = colorToRGB(document.getElementById('diffuseLightColor').value);
            this.Lights.emitLightColor = colorToRGB(document.getElementById('emitLightColor').value);
            this.Lights.specularColor = colorToRGB(document.getElementById('specularLightColor').value);
        }
        
        this.Lights.ambientLightColor = colorToRGB(document.getElementById('ambientLightColor').value);
        this.Lights.ambientLightLowColor = colorToRGB(document.getElementById('ambientLightLowColor').value);

        // Tipo di diffusione
        if (document.getElementById('DiffuseType').value == 'Lambert') {
            this.Lights.diffuseType= [1,0]; // Lambert
        }
        else if(document.getElementById('DiffuseType').value == 'Toon') {
            this.Lights.diffuseType= [0,1]; // Toon
        }
        else {
            this.Lights.diffuseType=[0,0];
        }

        // Tipo di luce speculare
        if (document.getElementById('SpecularType').value == 'Phong') {
            this.Lights.specularType= [1,0]; // Phong
        }
        else if(document.getElementById('SpecularType').value == 'Blinn') {
            this.Lights.specularType= [0,1]; // Blinn
        }
        else {
            this.Lights.specularType= [0,0]; // none
        }
        
        // Tipo di ambient light
        if (document.getElementById('AmbientType').value == 'Ambient') {
            this.Lights.ambientType= [1,0];
        }
        else if(document.getElementById('AmbientType').value == 'Hemispheric') {
            this.Lights.ambientType= [0,1];
        }
        else {
            this.Lights.ambientType= [0,0];
        }

        // Tipo di light
        if(document.getElementById('LightType').value == 'OnlyPoint'){
            this.Lights.lightType= [1,0];
        }
        else if(document.getElementById('LightType').value == 'PointPlusDir') {
            this.Lights.lightType= [1,1];
        }
        else if (document.getElementById('LightType').value == 'OnlyDirectional') {
            this.Lights.lightType= [0,1];
        }
        else {
            this.Lights.lightType= [0,0];
        }
    }

    setShader(mesh) {
        
        this.getParameters(mesh);
        this.initializeShader();

    };

    // Aggancia gli eventi e inizia il loop
    begin() {

        console.log('Beginning the scene');

        var me = this;

        // Aggancia i listener degli eventi
        this.__ResizeWindowListener = this._onResizeWindow.bind(this);
        this.__KeyDownWindowListener = this._onKeyDown.bind(this);
        this.__KeyUpWindowListener = this._onKeyUp.bind(this);

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
            me.update(dt);
            
            // Il frame corrente diventa vecchio
            previousFrame = currentFrameTime;

            // Disegna effettivamente sullo schermo
            me.render();
            
            // Chiama di nuovo questa funzione
            me.nextFrameHandle = requestAnimationFrame(loop);
        };
        
        // Chiama il loop per la prima volta
        me.nextFrameHandle = requestAnimationFrame(loop);

        // Chiama il resize iniziale sulle dimensioni correnti della finestra
        this._onResizeWindow();
    }

    // Fai l'update della telecamera e della posizione/rotazione degli oggetti
    // in base a quali tasti sono premuti quando viene disegnato il frame
    update(dt) {

        var me = this;
        
        // Se viene premuto H, attiva il wall hack
        if (this.PressedKeys.H) this.wallHack = true;

        // Se viene premuto spazio, prova a interagire
        if (this.PressedKeys.F){
            var target = this.getTargetCell(false);
            this.interact(target.Y, target.X);
        }

        // Se una porta si sta aprendo, procedi con uno step nell'animazione
        if (this.Doors){
            for(var i = 0; i < this.Doors.length; i++){
                var door = this.Doors[i];
                if (door.status == 'opening'){
                    var nextElevation = this.interpolate(1, door.animDuration, performance.now() - door.animStart);
                    door.toElevate += nextElevation - door.elevation;
                    door.elevation = nextElevation;
                }
            }
        }

        // Se ci stiamo muovendo, non accettiamo input ma facciamo il display dell'animazione
        if (me.IsMoving) {

            var entity = this.interpolate(1, this.MovementAnimation.duration, performance.now() - this.MovementAnimation.start);

            // Ci muoviamo di una quantità che equivale al punto in cui dovremmo essere meno la distanza già coperta
            if (me.MovementAnimation.direction == 'forward'){

                this.Camera.moveForward(entity - this.MovementAnimation.covered);
            }
            else{

                this.Camera.moveForward(-(entity - this.MovementAnimation.covered));
            }

            this.MovementAnimation.covered = entity;

            this.Camera.getViewMatrix(this.viewMatrix);
            return;
        }

        // Se ci stiamo ruotando, non accettiamo input ma facciamo il display dell'animazione
        else if (me.IsRotating){

            var entity = this.interpolate(glMatrix.toRadian(90), this.RotationAnimation.duration, performance.now() - this.RotationAnimation.start);

            if (me.RotationAnimation.direction == 'right'){

                this.Camera.rotateRight(entity - this.RotationAnimation.covered);
            }
            else{

                this.Camera.rotateRight(-(entity - this.RotationAnimation.covered));
            }

            this.RotationAnimation.covered = entity;

            this.Camera.getViewMatrix(this.viewMatrix);
            return;
        }

        // Se premiamo destra, ruota di 90 gradi a destra
        if (this.PressedKeys.RotRight){
            //this.Camera.rotateRight(glMatrix.toRadian(90));
            me.Direction = this.getNextDirection(true);
            me.IsRotating = true;
            
            me.RotationAnimation = {
                direction: 'right',
                covered: 0,
                start: performance.now(),
                duration: me.RotateDelay
            }

            setTimeout(function() {me.IsRotating = false; me.performFinalRotation(1); }, me.RotateDelay); // Sblocca i comandi finita la rotazione
        }

        // Se premiamo sinistra, ruota di -90 gradi a destra
        else if (this.PressedKeys.RotLeft){
            //this.Camera.rotateRight(glMatrix.toRadian(-90));
            me.Direction = this.getNextDirection(false);
            me.IsRotating = true;
            
            me.RotationAnimation = {
                direction: 'left',
                covered: 0,
                start: performance.now(),
                duration: me.RotateDelay
            }

            setTimeout(function() {me.IsRotating = false; me.performFinalRotation(-1); }, me.RotateDelay); // Sblocca i comandi finita la rotazione
        }

        // Se premiamo avanti e non ci sono muri, vai avanti di uno step
        else if (this.PressedKeys.Forward){
            var target = this.getTargetCell(false);
            if (this.canMove(target.Y, target.X)){
                
                me.Cell = target;
                me.IsMoving = true;
                
                me.MovementAnimation = {
                    direction: 'forward',
                    covered: 0,
                    start: performance.now(),
                    duration: me.MoveDelay
                }

                setTimeout(function() {me.IsMoving = false; me.performFinalMovement(1); }, me.MoveDelay); // Sblocca i comandi finito il movimento

                // Aggiorniamo la minimappa
                ColorMinimapCell(target.Y, target.X, 'white');
                PlaceMinimapMarker(target.Y, target.X);

                // Inoltre se nella cella target c'è una chiave, interagiamo con essa
                if (this.isKey(target.Y, target.X)){
                    this.interact(target.Y, target.X);
                }

                // Se è la cella di fine livello, triggera l'evento
                if (target.X == this.WinCell.X && target.Y == this.WinCell.Y){
                    setTimeout(function() { NextLevel(); }, me.MoveDelay + 100); // Sblocca i comandi finito il movimento
                }
            }
        }

        // Se premiamo indietro e non ci sono muri, vai indietro di uno step
        else if (this.PressedKeys.Back){
            var target = this.getTargetCell(true);
            if (this.canMove(target.Y, target.X)){
                
                me.Cell = target;
                me.IsMoving = true;
                
                me.MovementAnimation = {
                    direction: 'back',
                    covered: 0,
                    start: performance.now(),
                    duration: me.MoveDelay
                }

                setTimeout(function() { me.IsMoving = false; me.performFinalMovement(-1); }, me.MoveDelay); // Sblocca i comandi finito il movimento

                // Aggiorniamo la minimappa
                ColorMinimapCell(target.Y, target.X, 'white');
                PlaceMinimapMarker(target.Y, target.X);

                // Inoltre se nella cella target c'è una chiave, interagiamo con essa
                if (this.isKey(target.Y, target.X)){
                    this.interact(target.Y, target.X);
                }

                // Se è la cella di fine livello, triggera l'evento
                if (target.X == this.WinCell.X && target.Y == this.WinCell.Y){
                    setTimeout(function() { NextLevel(); }, me.MoveDelay + 100); // Sblocca i comandi finito il movimento
                }
            }
        }

        this.Camera.getViewMatrix(this.viewMatrix);
    }

    interpolate(targetPoint, animationTime, currentTime) {

        // Calcola il coeff. angolare della retta passante per l'origine
        var m = targetPoint / animationTime;

        // Ritorna la posizione in cui dovremmo essere ora
        return m * currentTime;
    }

    performFinalMovement(forward) {

        // Se non facciamo questo, l'animazione potrebbe fermarsi prima di aver raggiunto il punto finale e muoversi ad es. di 0.97 invece che 1
        this.Camera.moveForward(forward * (1 - this.MovementAnimation.covered));
        this.Camera.getViewMatrix(this.viewMatrix);
    }

    performFinalRotation(right) {

        this.Camera.rotateRight(right * (glMatrix.toRadian(90) - this.RotationAnimation.covered));
        this.Camera.getViewMatrix(this.viewMatrix);
    }

    getTargetCell(behind) {
        
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

    // Ritorna true se possiamo muoverci nella cella target
    canMove(y, x){

        if (this.isClosedDoor(y, x)){
            return this.wallHack;
        }
        else{
            return this.occupation[y][x] == ' ' || this.wallHack;
        }
    }

    interact(y, x){

        if (this.isLever(y, x)){

            // Cicla sulle porte
            for (var i = 0; i < this.Doors.length; i++){
                var door = this.Doors[i];
    
                // Se questa porta è assegnata alla leva con cui stiamo interagendo
                if (door.leverY == y && door.leverX == x){
                    door.open();
                }
            }
        }
        else if (this.isDoorKey(y, x)){

            // Cicla sulle porte
            for (var i = 0; i < this.Doors.length; i++){
                var door = this.Doors[i];
    
                // Se è questa la porta in posizione y x
                if (door.y == y && door.x == x){

                    // Se abbiamo la chiave giusta
                    if (this.MyKeys.includes(door.keyType)){
                        door.open();
                    }
                }
            }
        }
        else if (this.isKey(y, x)){

            // Cicla sulle chiavi
            for (var i = 0; i < this.Keys.length; i++){
                var key = this.Keys[i];

                // Se è questa la chiave in posizione y x
                if (key.y == y && key.x == x){

                    this.MyKeys.push(key.type);
                    document.getElementById(key.type + 'Key').classList.remove('hidden');
                }
            }
        }
    }

    isKey(y, x){
        if (!this.Keys) return false;

        for (var i = 0; i < this.Keys.length; i++){
            var key = this.Keys[i];

            // Se abbiamo di fronte una chiave
            if (key.y == y && key.x == x){
                return true;
            }
        }

        return false;
    }

    isDoorKey(y, x){
        if (!this.Doors) return false;

        for (var i = 0; i < this.Doors.length; i++){
            var door = this.Doors[i];

            // Se abbiamo di fronte una porta di tipo DoorKey e non è ancora aperta
            if (door.constructor.name == 'DoorKey' && door.y == y && door.x == x && door.status != 'open'){
                return true;
            }
        }

        return false;
    }

    isClosedDoor(y, x){
        if (!this.Doors) return false;

        for (var i = 0; i < this.Doors.length; i++){
            var door = this.Doors[i];

            // Se abbiamo di fronte una porta e non è ancora aperta
            if (door.y == y && door.x == x && door.status != 'open'){
                return true;
            }
        }

        return false;
    }

    isLever(y, x){
        if (!this.Doors) return false;

        for (var i = 0; i < this.Doors.length; i++){
            var door = this.Doors[i];
            
            // Se abbiamo di fronte una leva e la porta è ancora chiusa
            if (door.leverY == y && door.leverX == x && door.status == 'closed'){
                return true;
            }
        }

        return false;
    }

    getNextDirection(clockwise) {

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
    render() {
        
        // Ottieni una reference comoda per gl
        var gl = this.gl;
    
        // prendo i valori dalla pagina HTML e creo il vettore posizione point light
        // var PLpositions= vec3.fromValues(document.getElementById("PLightX").value/10,document.getElementById("PLightY").value/10,document.getElementById("PLightZ").value/10);
        // var Decay= document.getElementById("PLightDecay").value/5;
        // var Target= document.getElementById("PLightTarget").value/20;

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
        //gl.uniform1f(this.Program.uniforms.PLightDecay,Decay );

        //gl.uniform1f(this.Program.uniforms.PLightTarget,Target );

        // Disegna i modelli
        for (var i = 0; i < this.Meshes.length; i++) {
        
            var mesh = this.Meshes[i];

            // Fai l'update dello shader in base ai valori settati dall'utente e ai valori specifici del materiale della mesh
            this.setShader(mesh);

            // Se la mesh è una porta ed esistono porte
            if (mesh.name.includes('Door') && this.Doors){

                // Cicla su tutte le porte in memoria
                for (var j = 0; j < this.Doors.length; j++){
                    var door = this.Doors[j];

                    // Se la porta si sta aprendo o c'è qualche elevazione rimasta da processare
                    if (door.name === mesh.name && (door.status === 'opening' || door.toElevate > 0)){

                        console.log(mesh);
                        console.log(door);
                        // Trasla la world matrix dell'oggetto sulle y
                        mat4.translate(mesh.world, mesh.world, vec3.fromValues(0, door.toElevate, 0));

                        // Non c'è più nulla di rimasto da elevare
                        door.toElevate = 0;
                    }
                }
            }

            // Se la mesh è una chiave ma è già stata raccolta
            if (mesh.name.includes('Key')){

                // Se le mie chiavi contengono il nome della mesh senza Key
                if (this.MyKeys.includes(mesh.name.replace('Key', '').toLowerCase())){

                    // Non fare nulla
                    continue;
                }
            }

            // Uniform del modello
            gl.uniformMatrix4fv(
                this.Program.uniforms.mWorld,
                gl.FALSE,
                mesh.world);
            gl.uniform4fv(
                this.Program.uniforms.meshColor,
                mesh.color
            );

            // Riempi il buffer dei vertici
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);
            gl.vertexAttribPointer(
                this.Program.attribs.vPos,
                3, gl.FLOAT, gl.FALSE,
                0, 0
            );
            gl.enableVertexAttribArray(this.Program.attribs.vPos);

            // Riempi il buffer delle normali
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nbo);
            gl.vertexAttribPointer(
                this.Program.attribs.vNorm,
                3, gl.FLOAT, gl.FALSE,
                0, 0
            );
            gl.enableVertexAttribArray(this.Program.attribs.vNorm);		

            // Riempi il buffer delle texture
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvbo);
            gl.vertexAttribPointer(
                this.Program.attribs.vTexCoord,
                2, gl.FLOAT, gl.FALSE,
                2 * Float32Array.BYTES_PER_ELEMENT, 0
            );
            gl.enableVertexAttribArray(this.Program.attribs.vTexCoord);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // Binda la texture corretta in base al nome della mesh
            var name = mesh.name;
            if (name.includes('Wall')) name = 'Wall';
            else if (name.includes('Lever')) name = 'Lever';
            else if (name.includes('KeyHole')) name = 'KeyHole';
            else if (name.includes('Door')) name = 'Door';

            switch(name){
                case 'Wall':
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.wallTexture);
                    break;

                case 'Floor':
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.floorTexture);
                    break;

                case 'Ceiling':
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.ceilingTexture);
                    break;

                case 'Border':
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.borderTexture);
                    break;

                case 'Door':
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.doorTexture);
                    break;

                case 'GoldKey':
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.goldKeyTexture);
                    break;

                case 'CopperKey':
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.copperKeyTexture);
                    break;

                // Qui dovremmo definire dei default per levers e keyholes!!
                default:
                    gl.bindTexture(gl.TEXTURE_2D, this.Textures.floorTexture);
                    break;
            }
            gl.activeTexture(gl.TEXTURE0);

            // Riempi il buffer degli indici
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
            gl.drawElements(gl.TRIANGLES, mesh.nPoints, gl.UNSIGNED_SHORT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    // Sgancia gli eventi e termina il loop
    end() {
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
    }

    // Scarica la scena dalla memoria
    unload() {
        
        this.Program = null;
        this.Camera = null;
        this.Lights = null;
        this.Meshes = null;

        //this.lightPosition = null; tolto momentaneamente

        this.PressedKeys = null;
        this.RotateDelay = null;
        this.MoveDelay = null;
        this.IsMoving = null;
        this.IsRotating = null;
        this.MovementAnimation = null;
        this.RotationAnimation = null;
    }
}