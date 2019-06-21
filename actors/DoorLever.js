class DoorLever extends Door {

    constructor (name, doorY, doorX, leverY, leverX, animDuration = 1000){
        super(name, doorY, doorX, animDuration);
        this.leverY = leverY;
        this.leverX = leverX;
    }
}