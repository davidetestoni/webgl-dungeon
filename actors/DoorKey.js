class DoorKey extends Door {

    constructor (name, doorY, doorX, keyType, animDuration = 1000){
        super(name, doorY, doorX, animDuration);
        this.keyType = keyType;
    }
}