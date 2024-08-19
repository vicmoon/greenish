import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);
    this.menu = [
      {
        scene: "PlayScene",
        text: "Play",
      },
      {
        scene: "ScoreScene",
        text: "Score",
      },
      {
        scene: "null",
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
        backgroundColor: "#F6E96B ",
      });
    });

    textGameObject.on("pointerout", () => {
      textGameObject.setStyle({
        fill: "#DC5F00",
        backgroundColor: "",
      });
    });

    textGameObject.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);
      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
