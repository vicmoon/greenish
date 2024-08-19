import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor(config) {
    super("PreloadScene");
  }

  preload() {
    this.load.image("sky", "assets/background.png");
    this.load.spritesheet("greenish", "assets/greenishSprite.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("seed", "assets/seed.png");
    this.load.image("back", "assets/back.png");
    this.load.audio("crunch", "assets/crunch.mp3");
    this.load.audio("musicGame", "assets/music.mp3");
  }

  create() {
    this.scene.start("MenuScene");
  }

  update() {}
}

export default PreloadScene;
