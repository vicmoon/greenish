import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    const bestScore = localStorage.getItem("bestScore");
    this.add
      .text(...this.screenCenter, `Score: ${bestScore || 0}`, {
        fontSize: "32px",
        fill: "#000",
      })
      .setOrigin(0.5);
  }
}

export default ScoreScene;
