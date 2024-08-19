import BaseScene from "./BaseScene";
const futurePipes = 10;
const futureSeeds = 10;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.greenish = null;
    this.pipes = null;
    this.seeds = null;
    this.statePause = false;

    this.horizontalPipeDistance = 0;
    this.flapVelocity = 300;

    this.score = 0;

    this.scoreText = "";
    this.currentDifficulty = "easy";
    this.difficulties = {
      easy: {
        pipeHorizonDistanceRange: [450, 500], // Wider gaps between pipes
        pipeVerticalRange: [300, 200], // Wider vertical space
      },
      normal: {
        pipeHorizonDistanceRange: [380, 430], // Moderate gaps between pipes
        pipeVerticalRange: [250, 180], // Moderate vertical space
      },
      hard: {
        pipeHorizonDistanceRange: [320, 370], // Tighter gaps between pipes
        pipeVerticalRange: [200, 150], // Tighter vertical space
      },
    };
  }

  create() {
    super.create(); // calling the function in the Base scene
    this.createGreenish();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.createSeed();
    this.handleInputs();
    this.listenEvents();
    this.playGameMusic();

    // Load the crunch sound
    this.crunchSound = this.sound.add("crunch");
    this.deadSound = this.sound.add("dead");

    // Set up collision detection between greenish and seeds
    this.physics.add.overlap(
      this.greenish,
      this.seeds,
      this.handleSeedCollision,
      null,
      this
    );

    // Create and play the fly animation
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("greenish", {
        start: 0,
        end: 9,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.greenish.play("fly");
  }

  handleSeedCollision(greenish, seed) {
    // Play the eating sound
    this.crunchSound.play();

    // Increase the score
    this.increaseScore();

    // Remove the seed from the game
    seed.destroy();
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  createSeedSpawner() {
    this.seeds = this.physics.add.group();

    this.time.addEvent({
      delay: 2000, // Adjust this value to control how often seeds appear (e.g., every 2 seconds)
      callback: this.spawnSeed,
      callbackScope: this,
      loop: true,
    });
  }

  spawnSeed() {
    const x = this.config.width;
    const y = Phaser.Math.Between(50, this.config.height - 50);

    const seed = this.seeds.create(x, y, "seed");
    seed.setOrigin(0.5);
    seed.setVelocityX(-100);

    this.addFloatingEffect(seed); // Apply floating effect
  }

  // UPDATE

  update() {
    this.checkPlayerStatus();
    this.reusePipes();
  }

  // FUNCTIONS

  playGameMusic() {
    this.gameMusic = this.sound.add("musicGame", {
      loop: true,
      volume: 0.3,
    });
    this.gameMusic.play();
  }

  playDeadMusic() {
    this.deadSound = this.sound.add("dead", {
      loop: true,
      volume: 0.4,
    });
  }

  listenEvents() {
    if (this.pauseEvent) {
      return;
    }
    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          "Fly in: " + this.initialTime,
          this.fontOptions
        )
        .setOrigin(0.5);

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown, // Call the countDown method
        callbackScope: this, // Make sure 'this' refers to the correct scope
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText("Fly in: " + this.initialTime);

    if (this.initialTime <= 0) {
      this.statePause = false;
      this.countDownText.setText(" ");
      this.physics.resume(); // Assuming you want to resume physics here
      this.timedEvent.remove();
    }
  }

  checkPlayerStatus() {
    if (
      this.greenish.getBounds().bottom >= this.config.height ||
      this.greenish.y <= 0
    ) {
      this.gameOver();
    }
  }

  createBackground() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createGreenish() {
    this.greenish = this.physics.add
      .sprite(
        this.config.startPosition.x,
        this.config.startPosition.y,
        "greenish"
      )

      .setOrigin(0);
    this.greenish.setBodySize(
      this.greenish.width - 30,
      this.greenish.height - 10
    );
    this.greenish.body.gravity.y = 600;
    this.greenish.setCollideWorldBounds(true);
  }

  createColliders() {
    this.physics.add.collider(
      this.greenish,
      this.pipes,
      this.gameOver,
      null,
      this
    );
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      color: "#071952",
      backgroundColor: "#E9C46A",
      fontSize: "30px",
    });

    this.add.text(16, 50, `Best score: ${bestScore || 0}`, {
      fontSize: "18px",
      color: "#071952",
      backgroundColor: "#E9C46A",
    });
  }

  createPause() {
    this.statePause = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on("pointerdown", () => {
      this.statePause = true;
      this.gameMusic.stop();
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene"); //it will not shut down the
    });
  }

  createSeed() {
    this.seeds = this.physics.add.group(); // Initialize the seeds group

    for (let i = 0; i < futureSeeds; i++) {
      // Create seeds with random positions
      const x = Phaser.Math.Between(
        this.config.width + i * 200,
        this.config.width + 400 + i * 200
      );
      const y = Phaser.Math.Between(50, this.config.height - 50);

      const seed = this.seeds.create(x, y, "seed");
      seed.setOrigin(0.5);
      seed.setVelocityX(-100); // Make seeds move left like the pipes

      this.addFloatingEffect(seed); // Apply floating effect
    }
  }

  // Helper function to apply floating effect
  addFloatingEffect(seed) {
    this.tweens.add({
      targets: seed,
      y: seed.y - 20, // Move up by 20 pixels
      duration: 1000, // Duration of the tween
      yoyo: true, // Move back to the starting position
      repeat: -1, // Repeat indefinitely
      ease: "Sine.easeInOut", // Smooth easing for a more natural float
    });
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < futurePipes; i++) {
      const upperPipe = this.pipes
        .create(350, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);

      const lowerPipe = this.pipes
        .create(350, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.positionPipes(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }

  positionPipes(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];

    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizonDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  reusePipes() {
    let tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.positionPipes(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }
  increaseDifficulty() {
    if (this.score === 20) {
      this.currentDifficulty === "normal";
    }
    if (this.score === 40) {
      this.currentDifficulty === "hard";
    }
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);
    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }

  gameOver() {
    this.deadSound.play();
    this.physics.pause();
    this.greenish.setTint(0xee4824);
    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    if (this.statePause) {
      return;
    }
    this.greenish.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
