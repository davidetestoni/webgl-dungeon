'use strict';

// USARE QUESTA FUNZIONE SOLO SE SERVE
// Ottieni parametro nella GET query di un URL dato il suo nome
// esempio dato count ritorna 3 in http://example.com/index.php?count=3
/*
function getParameterByName(name, url) {
    // Se non viene specificato un URL, usa quello della pag. corrente
    if (!url) url = window.location.href;
    // Esegui un match regex e ritorna il risultato oppure null se non trovato
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
*/

// Binda di un evento
function AddEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

// Rimuove il binding di un evento
function RemoveEvent(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.removeEventListener) {
        object.removeEventListener(type, callback, false);
    } else if (object.detachEvent) {
        object.detachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

// Carica risorsa testuale (es. file GLSL)
function LoadTextResource (url, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onload = function (e) {
        if (xmlhttp.status < 200 || xmlhttp.status >= 300) {
            console.error('ERROR loading text resource', url, xmlhttp.status, xmlhttp.statusText);
            cb(new Error(xmlhttp.statusText));
        } else {
            cb(null, xmlhttp.responseText);
        }
    };
    xmlhttp.onerror = cb;
    xmlhttp.send();
};

// Carica risorsa json (es. modelli 3D codificati come oggetti json)
// Utile se si utilizza https://github.com/acgessler/assimp2json
function LoadJSONResource (url, cb) {
    LoadTextResource(url, function (err, res) {
        if (err) {
            cb(err);
        } else {
            try {
                var obj = JSON.parse(res);
                cb(null, obj);
            } catch (e) {
                cb(e);
            }
        }
    });
};

// Carica immagine
function LoadImage (url, cb) {
    var image = new Image();
    image.onload = function () {
        cb (null, image);
    };
    image.src = url;
};