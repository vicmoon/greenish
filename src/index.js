import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

const WIDTH = 1000;
const HEIGHT = 650;
const GreenPosition = { x: WIDTH * 0.2, y: HEIGHT / 2 };
const shared_config = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: GreenPosition,
};

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];

const createScene = (Scene) => new Scene(shared_config);

const initScenes = () => Scenes.map(createScene);

const config = {
  //WebGl (web graphics library)
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-app",
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  ...shared_config,
  pixelArt: true,

  parent: "phaser-game",
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
