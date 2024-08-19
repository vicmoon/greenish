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
        fontSize: "45px",
        color: "#071952",
        backgroundColor: "#E9C46A",
      })
      .setOrigin(0.5);
  }
}

export default ScoreScene;
