import HelloWorldScene from "./scenes/HelloWorldScene.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 1000, height: 700 },
    max: { width: 1920, height: 1080 },
  },
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false },
  },
  // only the scene that actually implements the game should be here
  scene: [HelloWorldScene],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
