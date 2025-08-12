// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    this.load.image("sky", "./assets/space3.png");
    this.load.image("logo", "./assets/phaser3-logo.png");
    this.load.image("red", "./assets/particles/red.png");
  }

  create() {
    this.add.rectangle(950, 950, 300, 100, 0x7777ff);
    this.add.circle(400, 300, 100, 0x6666ff).setInteractive();
  }

  update() {
    // update game objects
  }
}
