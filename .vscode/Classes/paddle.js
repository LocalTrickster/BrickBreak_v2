// classes/Paddle.js
export default class Paddle {
  constructor(scene, x, y, width = 160, height = 30, color = 0x3366ff) {
    this.scene = scene;
    this.width = width;
    this.height = height;

    this.sprite = scene.add.rectangle(x, y, width, height, color);
    scene.physics.add.existing(this.sprite, false);
    this.sprite.body.setImmovable(true);
    this.sprite.body.allowGravity = false;
    this.sprite.body.setCollideWorldBounds(true);
  }

  moveLeft(speed = 700) {
    this.sprite.body.setVelocityX(-speed);
  }

  moveRight(speed = 700) {
    this.sprite.body.setVelocityX(speed);
  }

  stop() {
    this.sprite.body.setVelocityX(0);
  }

  clampToWorld() {
    const halfWidth = this.width / 2;
    if (this.sprite.x < halfWidth) {
      this.sprite.x = halfWidth;
    } else if (this.sprite.x > 1920 - halfWidth) {
      this.sprite.x = 1920 - halfWidth;
    }
  }
}
