export default class Brick extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color) {
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.active = true;
  }

  hit() {
    this.active = false;
    this.setVisible(false);
    this.body.enable = false;
  }
}
