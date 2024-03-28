class App {
    constructor(gameID) {
        this.file = new File();
        this.loader = new PIXI.Loader();
        this.playList = {};
        this.gameId = gameID;
        this.json = {};
        this.load = new LoadingView("white","var(--mdc-theme-primary)");
        document.body.appendChild(this.load.html);
        this.file.loadJson(this.gameId, this.onJsonLoaded.bind(this));
    }

    onJsonLoaded(json) {
        this.json = json;
        this.file.loadImages(this.gameId, this.loader, this.onImagesLoaded.bind(this));
    }

    onImagesLoaded() {
        this.json.imageList = Object.keys(this.loader.resources);
        this.file.loadSounds(this.gameId, this.playList, this.onSoundsLoaded.bind(this));
    }

    onSoundsLoaded(playList) {
        this.json.soundList = Object.keys(playList);
        this.launchEditor();
    }

    launchEditor() {
       var editor = new Editor(new EditorView(), new Game(this.json));
       new CmdManager(editor);
       document.body.appendChild(editor.view.html);
       this.load.closeDialog();
    }
}