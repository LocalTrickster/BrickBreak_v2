// src/HelloWorldScene.js
import paddle from "./objects/paddle.js";
import ball from "./objects/ball.js";
import brick from "./objects/brick.js";

export default {
  key: "hello-world",
  preload: function () {},

  create: function () {
    this.score = 0;

    // Paddle
    this.paddle = new paddle(this, 960, 1000);

    // Ball
    this.ball = new ball(this, 960, 540);

    // Bricks
    this.brickRows = 6;
    this.brickCols = 14;
    this.brickWidth = 80;
    this.brickHeight = 32;
    this.brickSpacingX = 4;
    this.brickSpacingY = 4;
    this.bricks = [];

    const totalBricksWidth = this.brickCols * this.brickWidth + (this.brickCols - 1) * this.brickSpacingX;
    const startX = (1920 - totalBricksWidth) / 2 + this.brickWidth / 2;

    for (let y = 0; y < this.brickRows; y++) {
      for (let x = 0; x < this.brickCols; x++) {
        let color = Phaser.Display.Color.GetColor(100 + y * 20, 100 + x * 10, 255);
        let brick = new brick(
          this,
          startX + x * (this.brickWidth + this.brickSpacingX),
          150 + y * (this.brickHeight + this.brickSpacingY),
          this.brickWidth,
          this.brickHeight,
          color
        );
        this.bricks.push(brick);
      }
    }

    // Paddle collision
    this.physics.add.collider(this.ball, this.paddle, (ball, paddle) => {
      this.ball.bounceFromPaddle(this.paddle);
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Score
    this.scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#fff" });

    // Launch ball
    this.time.delayedCall(500, () => {
      this.ball.launch();
    });

    // Ground = lose zone
    this.ground = this.add.zone(960, 1150, 1920, 150);
    this.physics.add.existing(this.ground, true);
    this.physics.add.overlap(this.ball, this.ground, () => {
      this.scene.restart();
    }, null, this);
  },

  update: function () {
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
      return;
    }

    // Paddle movement
    if (this.cursors.left.isDown) {
      this.paddle.moveLeft(700);
    } else if (this.cursors.right.isDown) {
      this.paddle.moveRight(700);
    } else {
      this.paddle.stop();
    }

    this.paddle.constrainToScreen(1920);

    // Ball speed limit
    if (this.ball.body && this.ball.body.velocity) {
      this.ball.clampSpeed(500);
    }

    // Brick collisions
    for (let i = 0; i < this.bricks.length; i++) {
      let brick = this.bricks[i];
      if (!brick.active) continue;

      if (this.physics.world.overlap(this.ball, brick)) {
        let ballRect = this.ball.getBounds();
        let brickRect = brick.getBounds();
        let dx = ballRect.centerX - brickRect.centerX;
        let dy = ballRect.centerY - brickRect.centerY;

        let overlapX = (brick.width / 2 + this.ball.radius) - Math.abs(dx);
        let overlapY = (brick.height / 2 + this.ball.radius) - Math.abs(dy);

        if (overlapX < overlapY) {
          this.ball.body.setVelocityX(-this.ball.body.velocity.x);
        } else {
          this.ball.body.setVelocityY(-this.ball.body.velocity.y);
        }

        brick.hit();
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        // Speed up
        const speedIncrease = 10;
        let velocity = this.ball.body.velocity;
        let newSpeed = velocity.length() + speedIncrease;
        const maxSpeed = 700;
        if (newSpeed > maxSpeed) newSpeed = maxSpeed;
        let newVelocity = velocity.clone().normalize().scale(newSpeed);
        this.ball.body.setVelocity(newVelocity.x, newVelocity.y);

        // Win check
        if (this.bricks.every(b => !b.active)) {
          this.scene.restart();
          return;
        }

        break;
      }
    }
  }
};
//hola 