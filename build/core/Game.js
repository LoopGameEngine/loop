class Game {

    constructor(game) {
        this.fontList = []; this.imageList = []; this.soundList = [];
        this.tagList = []; this.sceneList = [];

        if (!game.sceneList) { // if the game is empty
            this.name = "Untitled Game";
            Object.assign(this, this.properties); // add basic game properties
            this.sceneList[0] = new Scene({ "name": "Scene_1", "actorList": [] });
        }
        else {
            Object.assign(this, game);
            this.sceneList.forEach((scene, i) => this.sceneList[i] = new Scene(scene));
        }

        if (this.imageList) this.imageList.forEach((image, i) => this.imageList[i] = new Object({ "id": Utils.id(), "name": image }));
        if (this.soundList) this.soundList.forEach((sound, i) => this.soundList[i] = new Object({ "id": Utils.id(), "name": sound }));

        // add fixed fonts
        var fontList = ["Arial", "Arial Black", "Courier New", "Georgia", "Helvetica", "Impact", "Tahoma", "Times New Roman", "Verdana"];
        fontList.forEach((font, i) => this.fontList[i] = new Object({ "id": Utils.id(), "name": font }));
    }

    get properties() {
        var obj = {
            // Settings
            displayWidth: this.displayWidth || 800, displayHeight: this.displayHeight || 480,
            cameraX: this.cameraX || 0, cameraY: this.cameraY || 0, cameraAngle: this.cameraAngle || 0, cameraZoom: this.cameraZoom || 1,
            backgroundColor: this.backgroundColor || "#ffffff",
            // Sound
            soundOn: this.soundOn || false, soundtrack: this.soundtrack || "", volume: this.volume || 1, start: this.start || 0,
            pan: this.pan || 0, loop: this.loop || false,
            // Physics
            physicsOn: this.physicsOn || false, gravityX: this.gravityX || 0, gravityY: this.gravityY || 0
        }
        return (obj);
    }

    get newProperties() {
        var obj = Object.assign({}, this);
        Object.keys(this.properties).forEach(element => { delete obj[element]; });
        ["name", "imageList", "soundList", "fontList", "sceneList", "tagList"].forEach((property) => delete obj[property]);
        return (obj);
    }

    get inputProperties() {
        var obj = {
            FPS: 60,
            time: 0,
            deltaTime: 0.01,
            mouseX: 0, mouseY: 0,
            currentScene: this.sceneList[0].name, currentSceneNumber: 0,
            //  accelerationX: 0, accelerationY: 0, accelerationZ: 0,
            //  latitude: 0, longitude: 0
            //  exit: false,
        }
        return (obj);
    }

    get allProperties() {
        var obj = Object.assign({}, this.properties, this.newProperties, this.inputProperties);
        return (obj);
    }

    addScene(scene, pos) {
        this.sceneList.splice(pos, 0, scene);
    }

    removeScene(sceneID) {
        this.sceneList.splice(this.sceneList.findIndex(i => i.id == sceneID), 1);
    }

    addAsset(asset, type) {
        switch (type) {
            case "Sound": this.soundList.push(asset); break;
            case "Font": this.fontList.push(asset); break;
            case "Image": this.imageList.push(asset); break;
        }
    }

    removeAsset(assetID, type) {
        switch (type) {
            case "Sound": this.soundList.splice(this.soundList.findIndex(i => i.id == assetID), 1); break;
            case "Font": this.fontList.splice(this.fontList.findIndex(i => i.id == assetID), 1); break;
            case "Image": this.imageList.splice(this.imageList.findIndex(i => i.id == assetID), 1); break;
        }
    }
}
