import HelloWorldScene from "./scenes/HelloWorldScene.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 1000,
      height: 700
    },
    max: {
      width: 1920,
      height: 1080,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Set gravity to zero
      debug: false,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [HelloWorldScene],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
