// Impedisce di usare variabili non dichiarate
'use strict';

// Variabili globali
var Dungeon;

// Initializza webgl e carica la scena
function Init(difficulty) {
	
	var canvas = document.getElementById('gl-surface');
	canvas.classList.remove('hidden');
	document.getElementById('menu').classList.add('hidden');
	document.getElementById('controls').classList.remove('hidden');
	document.getElementById('contenitore').classList.remove('hidden');

	var gl = canvas.getContext('webgl');
    
    if (!gl) {
		console.log('Failed to get WebGL context - trying experimental context');
		gl = canvas.getContext('experimental-webgl');
    }
    
	if (!gl) {
		alert('Your browser does not support WebGL - please use a different browser!');
		return;
	}

	switch (difficulty){
		
		case 0: // Debug mode
			Dungeon = new TestScene(gl);
			break;
		
		case 1:
			Dungeon = new Dungeon1Scene(gl);
			break;
		
		default:
			alert('Invalid difficulty!');
			return;
	}

	Dungeon.Load(function (error) {
		if (error) {
			alert('Could not load the scene - see console for more details');
			console.error(error);
		} else {
			Dungeon.Begin();
		}
	});
}