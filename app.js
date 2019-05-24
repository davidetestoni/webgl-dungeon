// Impedisce di usare variabili non dichiarate
'use strict';

// Variabili globali
var Dungeon;

// Initializza webgl e carica la scena
function Init() {
	var canvas = document.getElementById('gl-surface');
	var gl = canvas.getContext('webgl');
    
    if (!gl) {
		console.log('Failed to get WebGL context - trying experimental context');
		gl = canvas.getContext('experimental-webgl');
    }
    
	if (!gl) {
		alert('Your browser does not support WebGL - please use a different browser!');
		return;
	}

    // Crea il dungeon e carica la scena
	Dungeon = new TestScene(gl);
	Dungeon.Load(function (error) {
		if (error) {
			alert('Could not load the scene - see console for more details');
			console.error(error);
		} else {
			Dungeon.Begin();
		}
	});
}