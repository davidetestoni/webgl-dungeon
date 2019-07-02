// Porta generica
class Door {

    // Costruisci una porta date le coordinate x, y della cella
	constructor(name, y, x, animDuration = 1000) {
        this.name = name;
        this.y = y;
        this.x = x;
        this.status = 'closed';
        this.elevation = 0;
        this.toElevate = 0;
        this.animDuration = animDuration;
    }
    
    // Apri la porta
    open() {
        if (this.status === 'closed'){
            this.status = 'opening';
            this.animStart = performance.now();

            var me = this;
            setTimeout(function() { 
                me.status = 'open';
                me.toElevate += 1 - me.elevation;
                me.elevation = 1;
            }, me.animDuration);
        }
    }
}