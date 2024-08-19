import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);
    this.menu = [
      {
        scene: "PlayScene",
        text: "Continue",
      },
      {
        scene: "MenuScene",
        text: "Exit",
      },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGameObject = menuItem.textGameObject;
    textGameObject.setInteractive();

    textGameObject.on("pointerover", () => {
      textGameObject.setStyle({
        fill: "#379777",
      });
    });

    textGameObject.on("pointerout", () => {
      textGameObject.setStyle({
        fill: "#DC5F00",
      });
    });

    textGameObject.on("pointerup", () => {
      if (menuItem.scene && menuItem.text === "Continue") {
        //stop the Pause Scene and resume the Play
        this.scene.stop();
        this.scene.resume(menuItem.scene);
        this.gameMusic.play();
      } else {
        // stopping PlayScee, PauseScene and running Menu
        this.scene.stop("PlayScene");
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;
