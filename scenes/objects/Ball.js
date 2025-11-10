export default class Ball extends Phaser.GameObjects.Arc {
  constructor(scene, x, y, radius = 18, color = 0xffffff) {
    super(scene, x, y, radius, 0, 360, false, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCircle(radius);
    this.body.setCollideWorldBounds(true, 1, 1);
    this.body.setBounce(1, 1);
    this.body.allowGravity = false;
  }

  launch(initialSpeed = 400) {
    if (this.body.velocity.length() === 0) {
      const angles = [30, 150, 210, 330];
      const angleDeg = Phaser.Math.RND.pick(angles);
      const angleRad = Phaser.Math.DegToRad(angleDeg);
      const vx = Math.cos(angleRad) * initialSpeed;
      const vy = Math.sin(angleRad) * initialSpeed;
      this.body.setVelocity(vx, vy);
    }
  }

  clampSpeed(maxSpeed) {
    let velocity = this.body.velocity;
    if (velocity.length() > maxSpeed) {
      velocity = velocity.normalize().scale(maxSpeed);
      this.body.setVelocity(velocity.x, velocity.y);
    }
  }

  bounceFromPaddle(paddle) {
    const diff = this.x - paddle.x;
    const newVX = Phaser.Math.Clamp(diff * 8, -400, 400);
    let speed = this.body.velocity.length();
    if (speed < 200) speed = 200;

    const signY = Math.sign(this.body.velocity.y) || -1;
    const vy = Math.sqrt(Math.max(0, speed * speed - newVX * newVX)) * signY;

    this.body.setVelocity(newVX, vy);
    this.clampSpeed(500);
  }
}

