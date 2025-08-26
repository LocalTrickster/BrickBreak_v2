// classes/Ball.js
export default class Ball {
  constructor(scene, x, y, radius = 18, color = 0xffffff) {
    this.scene = scene;
    this.radius = radius;

    this.sprite = scene.add.circle(x, y, radius, color);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCircle(radius);
    this.sprite.body.setCollideWorldBounds(true, 1, 1);
    this.sprite.body.setBounce(1, 1);
    this.sprite.body.allowGravity = false;
  }

  launch(initialSpeed = 400) {
    const angle = Phaser.Math.FloatBetween(
      Phaser.Math.DegToRad(30),
      Phaser.Math.DegToRad(150)
    );
    const vx = Math.cos(angle) * initialSpeed;
    const vy = Math.sin(angle) * initialSpeed;
    this.sprite.body.setVelocity(vx, vy);
  }

  limitSpeed(maxSpeed = 500) {
    const velocity = this.sprite.body.velocity;
    if (velocity.length() > maxSpeed) {
      const scaled = velocity.clone().normalize().scale(maxSpeed);
      this.sprite.body.setVelocity(scaled.x, scaled.y);
    }
  }

  increaseSpeed(amount = 10, maxSpeed = 700) {
    const velocity = this.sprite.body.velocity;
    const newSpeed = Math.min(velocity.length() + amount, maxSpeed);
    const newVelocity = velocity.clone().normalize().scale(newSpeed);
    this.sprite.body.setVelocity(newVelocity.x, newVelocity.y);
  }
}
