// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
    this.paddle = null;
    this.ball = null;
    this.bricks = null;
    this.cursors = null;
    this.score = 0;
    this.scoreText = null;
    this.gameOverText = null;
    this.resetButton = null;
    this.isGameOver = false;
    this.rKey = null;
  }

  preload() {
    this.load.image("sky", "public/assets/space3.png");
    this.load.image("logo", "public/assets/phaser3-logo.png");
    this.load.image("red", "public/assets/particles/red.png");
    this.load.image("paddle", "public/assets/paddle.png");
    this.load.image("ball", "public/assets/ball.png");
    this.load.image("brick", "public/assets/brick.png");
  }

  create() {
    this.isGameOver = false;

    // Paddle (slightly wider than the ball)
    this.paddle = this.physics.add.image(960, 1000, "paddle").setImmovable();
    this.paddle.body.allowGravity = false;
    this.paddle.setCollideWorldBounds(true);

    // Ball
    this.ball = this.physics.add.image(960, 970, "ball")
      .setCollideWorldBounds(true)
      .setBounce(1);
    this.ball.body.allowGravity = false;
    this.ball.setData("onPaddle", false);
    this.ball.setVisible(true);
    // REMOVE this.ball.enableBody(true, 960, 970, true, true);

    // Adjust paddle width to be about 2.5x the ball's width
    this.paddle.displayWidth = this.ball.displayWidth * 2.5;
    this.paddle.displayHeight = this.ball.displayHeight * 1.2;

    // Bricks group
    this.bricks = this.physics.add.staticGroup();
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 14; x++) {
        this.bricks.create(200 + x * 110, 150 + y * 50, "brick");
      }
    }

    // Collisions
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Score text
    this.scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#fff" });

    // Game Over text (hidden at start)
    this.gameOverText = this.add.text(960, 540, "GAME OVER", { fontSize: "64px", fill: "#f00" })
      .setOrigin(0.5)
      .setVisible(false);

    // Reset button (hidden at start)
    this.resetButton = this.add.text(960, 650, "RESET", { fontSize: "48px", fill: "#fff", backgroundColor: "#333", padding: { x: 20, y: 10 } })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false)
      .on("pointerup", () => this.scene.restart());

    // Launch ball automatically at start
    this.time.delayedCall(500, () => this.launchBall());

    // Ground zone for game over (invisible, now lower)
    this.ground = this.add.zone(960, 1070, 1920, 5); // y=1070, height=40
    this.physics.add.existing(this.ground, true);

    // Ball-ground overlap triggers game over
    this.physics.add.overlap(this.ball, this.ground, () => this.gameOver(), null, this);
  }

  launchBall() {
    if (this.ball.getData("onPaddle") || this.ball.body.velocity.length() === 0) {
      // Limit the initial velocity to avoid excessive speed
      this.ball.setVelocity(Phaser.Math.Between(-180, 180), -400);
      this.ball.setData("onPaddle", false);
    }
  }

  hitBrick(ball, brick) {
    brick.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    // --- Increase ball speed slightly each time a brick is destroyed ---
    const speedIncrease = 15; // small increment
    let velocity = this.ball.body.velocity;
    let newVelocity = velocity.clone().normalize().scale(velocity.length() + speedIncrease);

    // Clamp to a reasonable max speed
    const maxSpeed = 700;
    if (newVelocity.length() > maxSpeed) {
      newVelocity = newVelocity.normalize().scale(maxSpeed);
    }
    this.ball.setVelocity(newVelocity.x, newVelocity.y);
    // -------------------------------------------------------------------

    // Win condition
    if (this.bricks.countActive() === 0) {
      this.ball.setVelocity(0);
      this.add.text(960, 540, "YOU WIN!", { fontSize: "64px", fill: "#0f0" }).setOrigin(0.5);
      this.scene.pause();
      this.showReset();
    }
  }

  hitPaddle(ball, paddle) {
    // Calculate difference and limit the resulting X velocity
    let diff = ball.x - paddle.x;
    let newVX = Phaser.Math.Clamp(diff * 8, -400, 400);
    ball.setVelocityX(newVX);

    // Clamp ball's total velocity to prevent tunneling
    let maxSpeed = 500;
    let velocity = ball.body.velocity;
    if (velocity.length() > maxSpeed) {
      velocity.normalize().scale(maxSpeed);
      ball.setVelocity(velocity.x, velocity.y);
    }
  }

  update() {
    if (this.isGameOver) return;

    // Paddle movement
    if (this.cursors.left.isDown) {
      this.paddle.setVelocityX(-700);
    } else if (this.cursors.right.isDown) {
      this.paddle.setVelocityX(700);
    } else {
      this.paddle.setVelocityX(0);
    }

    // Keep paddle within bounds
    const paddleWidth = this.paddle.displayWidth;
    if (this.paddle.x < paddleWidth / 2) {
      this.paddle.x = paddleWidth / 2;
    } else if (this.paddle.x > 1920 - paddleWidth / 2) {
      this.paddle.x = 1920 - paddleWidth / 2;
    }

    // REMOVE the manual Y-check for game over here

    // Reset on R key
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }

    // Clamp ball speed to prevent glitching
    if (this.ball.body && this.ball.body.velocity) {
      let maxSpeed = 500;
      let velocity = this.ball.body.velocity;
      if (velocity.length() > maxSpeed) {
        velocity.normalize().scale(maxSpeed);
        this.ball.setVelocity(velocity.x, velocity.y);
      }
    }
  }

  gameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.ball.setVelocity(0, 0);
    this.ball.setVisible(false);
    this.gameOverText.setVisible(true);
    this.showReset();
  }

  showReset() {
    this.resetButton.setVisible(true);
    this.resetButton.setInteractive();
  }
}
