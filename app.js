// Impedisce di usare variabili non dichiarate
'use strict';

// Variabili globali
var Dungeon;

// Initializza webgl e carica la scena
function Init(difficulty, debugMode) {
	
	// Nascondi il menu
	document.getElementById('menu').classList.add('hidden');

	// Mostra canvas e HUD
	var canvas = document.getElementById('gl-surface');
	var hudElems = document.getElementsByClassName('hud');
	for (var i = 0; i < hudElems.length; i++){
		hudElems[i].classList.remove('hidden');
	}

	// Nascondi tutte le immagini degli item
	var items = document.querySelector('#items img');
	for (var i = 0; i < items.length; i++){
		items[i].classList.add('hidden');
	}
	
	var gl = canvas.getContext('webgl');
	
    if (!gl) {
		console.log('Failed to get WebGL context - trying experimental context');
		gl = canvas.getContext('experimental-webgl');
    }
    
	if (!gl) {
		alert('Your browser does not support WebGL - please use a different browser!');
		return;
	}

	// In base alla difficoltà selezionata
	if (debugMode){
		Dungeon = new Dungeon0Scene(gl);

		Dungeon.load(function (error) {
			if (error) {
				alert('Could not load the scene - see console for more details');
				console.error(error);
			} else {
				Dungeon.begin();
			}
		}, difficulty);
	}
	else{
		switch (parseInt(difficulty)){
			case 1:
				Dungeon = new Dungeon1Scene(gl);
				break;
	
			case 2:
				Dungeon = new Dungeon2Scene(gl);
				break;
	
			case 3:
				Dungeon = new Dungeon3Scene(gl);
				break;
			
			default:
				alert('Invalid difficulty! ' + difficulty);
				return;
		}

		Dungeon.load(function (error) {
			if (error) {
				alert('Could not load the scene - see console for more details');
				console.error(error);
			} else {
				Dungeon.begin();
			}
		});
	}
}