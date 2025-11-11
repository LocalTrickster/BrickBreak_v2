export default class Paddle extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width = 160, height = 30, color = 0x3366ff) {
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setImmovable(true);
    this.body.allowGravity = false;
    this.body.setCollideWorldBounds(true);

    this.widthValue = width;
  }

  moveLeft(speed) {
    this.body.setVelocityX(-speed);
  }

  moveRight(speed) {
    this.body.setVelocityX(speed);
  }

  stop() {
    this.body.setVelocityX(0);
  }

  constrainToScreen(screenWidth) {
    if (this.x < this.width / 2) {
      this.x = this.width / 2;
    } else if (this.x > screenWidth - this.width / 2) {
      this.x = screenWidth - this.width / 2;
    }
  }
}
