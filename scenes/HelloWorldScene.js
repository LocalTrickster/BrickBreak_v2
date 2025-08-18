// Arkanoid-like game using only this.add.* objects for ball and bricks, no class syntax

export default {
  key: "hello-world",
  preload: function () {},

  create: function () {
    this.score = 0;

    // Paddle
    this.paddleWidth = 160;
    this.paddleHeight = 30;
    this.paddle = this.add.rectangle(960, 1000, this.paddleWidth, this.paddleHeight, 0x3366ff);
    this.physics.add.existing(this.paddle, false);
    this.paddle.body.setImmovable(true);
    this.paddle.body.allowGravity = false;
    this.paddle.body.setCollideWorldBounds(true);

    // Ball
    this.ballRadius = 18;
    this.ball = this.add.circle(960, 540, this.ballRadius, 0xffffff);
    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(this.ballRadius);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1, 1);
    this.ball.body.allowGravity = false;

    // Bricks (array, not group)
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
        let color = Phaser.Display.Color.GetColor(
          100 + y * 20,
          100 + x * 10,
          255
        );
        let brick = this.add.rectangle(
          startX + x * (this.brickWidth + this.brickSpacingX),
          150 + y * (this.brickHeight + this.brickSpacingY),
          this.brickWidth,
          this.brickHeight,
          color
        );
        this.physics.add.existing(brick, true);
        brick.active = true;
        this.bricks.push(brick);
      }
    }

    // Paddle collision
    this.physics.add.collider(this.ball, this.paddle, (ball, paddle) => {
      let diff = ball.x - paddle.x;
      let newVX = Phaser.Math.Clamp(diff * 8, -400, 400);
      let speed = ball.body.velocity.length();
      if (speed < 200) speed = 200;
      let signY = Math.sign(ball.body.velocity.y) || -1;
      let vy = Math.sqrt(Math.max(0, speed * speed - newVX * newVX)) * signY;
      ball.body.setVelocity(newVX, vy);

      let maxSpeed = 500;
      let velocity = ball.body.velocity;
      if (velocity.length() > maxSpeed) {
        velocity = velocity.normalize().scale(maxSpeed);
        ball.body.setVelocity(velocity.x, velocity.y);
      }
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Score text
    this.scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#fff" });

    // Launch ball
    this.time.delayedCall(500, () => {
      if (this.ball.body.velocity.length() === 0) {
        let angleRanges = [
          Phaser.Math.DegToRad(30), Phaser.Math.DegToRad(150),
          Phaser.Math.DegToRad(210), Phaser.Math.DegToRad(330)
        ];
        let angle;
        if (Math.random() < 0.5) {
          angle = Phaser.Math.FloatBetween(angleRanges[0], angleRanges[1]);
        } else {
          angle = Phaser.Math.FloatBetween(angleRanges[2], angleRanges[3]);
        }
        let speed = 400;
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;
        this.ball.body.setVelocity(vx, vy);
      }
    });

    // Ground
    this.ground = this.add.zone(960, 1150, 1920, 150);
    this.physics.add.existing(this.ground, true);
    this.physics.add.overlap(
      this.ball,
      this.ground,
      () => { this.scene.restart(); },
      null,
      this
    );
  },

  update: function () {
    // Paddle movement
    if (this.cursors.left.isDown) {
      this.paddle.body.setVelocityX(-700);
    } else if (this.cursors.right.isDown) {
      this.paddle.body.setVelocityX(700);
    } else {
      this.paddle.body.setVelocityX(0);
    }

    // Keep paddle within bounds
    const paddleWidth = this.paddle.width;
    if (this.paddle.x < paddleWidth / 2) {
      this.paddle.x = paddleWidth / 2;
    } else if (this.paddle.x > 1920 - paddleWidth / 2) {
      this.paddle.x = 1920 - paddleWidth / 2;
    }

    // Clamp ball speed
    if (this.ball.body && this.ball.body.velocity) {
      let maxSpeed = 500;
      let velocity = this.ball.body.velocity;
      if (velocity.length() > maxSpeed) {
        velocity.normalize().scale(maxSpeed);
        this.ball.body.setVelocity(velocity.x, velocity.y);
      }
    }

    // --- Manual brick collision detection ---
    for (let i = 0; i < this.bricks.length; i++) {
      let brick = this.bricks[i];
      if (!brick.active) continue;
      if (this.physics.world.overlap(this.ball, brick)) {
        // --- Bounce calculation ---
        let ballRect = this.ball.getBounds();
        let brickRect = brick.getBounds();

        let ballCenterX = ballRect.centerX;
        let ballCenterY = ballRect.centerY;
        let brickCenterX = brickRect.centerX;
        let brickCenterY = brickRect.centerY;

        let dx = ballCenterX - brickCenterX;
        let dy = ballCenterY - brickCenterY;

        let overlapX = (brick.width / 2 + this.ballRadius) - Math.abs(dx);
        let overlapY = (brick.height / 2 + this.ballRadius) - Math.abs(dy);

        if (overlapX < overlapY) {
          this.ball.body.setVelocityX(-this.ball.body.velocity.x);
        } else {
          this.ball.body.setVelocityY(-this.ball.body.velocity.y);
        }

        brick.active = false;
        brick.visible = false;
        brick.body.enable = false;
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        // Slightly increase ball speed
        const speedIncrease = 10;
        let velocity = this.ball.body.velocity;
        let newSpeed = velocity.length() + speedIncrease;
        const maxSpeed = 700;
        if (newSpeed > maxSpeed) newSpeed = maxSpeed;
        let newVelocity = velocity.clone().normalize().scale(newSpeed);
        this.ball.body.setVelocity(newVelocity.x, newVelocity.y);

        // Win condition
        if (this.bricks.filter(b => b.active).length === 0) {
          this.ball.body.setVelocity(0, 0);
          // You can add a win condition here if needed
        }
        break; // Only handle one brick per frame
      }
    }
  }
};
