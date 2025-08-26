// classes/Brick.js
export default class Brick {
  constructor(scene, x, y, width, height, color) {
    this.scene = scene;
    this.active = true;

    this.sprite = scene.add.rectangle(x, y, width, height, color);
    scene.physics.add.existing(this.sprite, true);
  }

  destroy() {
    this.active = false;
    this.sprite.visible = false;
  }
}
