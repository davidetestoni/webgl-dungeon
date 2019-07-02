// Impedisce di usare variabili non dichiarate
'use strict';

// Variabili globali
var Dungeon;
var Difficulty;

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

	Difficulty = parseInt(difficulty);
	ResetMinimap();
	
	var gl = canvas.getContext('webgl');
	
    if (!gl) {
		console.log('Failed to get WebGL context - trying experimental context');
		gl = canvas.getContext('experimental-webgl');
    }
    
	if (!gl) {
		alert('Your browser does not support WebGL - please use a different browser!');
		return;
	}

	// Se siamo in debug, carica la scena 0
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
	else {
		// In base alla difficoltà selezionata
		switch (Difficulty){
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

		// Carica il dungeon
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

// Vai al prossimo livello
function NextLevel() {

	// Termina il loop
	Dungeon.end();
	Dungeon.unload();

	// Vai al prossimo livello
	if (Difficulty < 3) {
		alert('You beat difficulty ' + Difficulty + '! Loading the next level...');
		Init(Difficulty + 1, false);
	}
	// Oppure termina il gioco
	else {
		alert('You beat the game!');
	}
}

// Ridisegna la minimappa con tutte le celle nere
function ResetMinimap() {
	var minimap = document.getElementById('minimap');
	minimap.removeChild(minimap.firstChild);
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	for (var i = 0; i < 24; i++) {
		var tr = document.createElement('tr');
		for (var j = 0; j < 24; j++) {
			var td = document.createElement('td');
			td.style.background = '#222';
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	minimap.appendChild(table);
}

// Colora una cella della minimappa
function ColorMinimapCell(y, x, color) {

	var cell = document.querySelector(`#minimap table tbody tr:nth-child(${y + 1}) td:nth-child(${x + 1})`);
	cell.style.background = color;
}

// Sposta il marker sulla minimappa
function PlaceMinimapMarker(y, x) {

	// Rimuovi marker precedenti
	var cells = document.querySelectorAll('#minimap table tbody tr td');
	for (var i = 0; i < cells.length; i++){
		var cell = cells[i];
		if (cell.firstChild) cell.removeChild(cell.firstChild);
	}

	// Crea il div marker
	var marker = document.createElement('div');
	marker.classList.add('marker');
	
	// Ottieni la cella corretta e aggiungi il marker
	var cell = document.querySelector(`#minimap table tbody tr:nth-child(${y + 1}) td:nth-child(${x + 1})`);
	cell.appendChild(marker);
}