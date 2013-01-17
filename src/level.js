// The tests for this are in game_spec_spec.js
// TODO: fix
var Level = function(imageAssets, soundAssets) {
  var Jukebox = require('./jukebox'),
      Assets = require('./assets'),
      levelLookup = {};

  // I think you want to get rid of the jukebox, in favor of an
  // audio object in the gameObjects.
  // This way everything could happen in the load, possibly by registering 
  // for an update when the level is loaded.
  this.getJukebox = function() {
    return Jukebox(this.soundAssets || new Assets());
  };

  this.setSoundAssets = function(soundAssets) {
    this.soundAssets = soundAssets;
  };

  this.gameObject = function(objectName) {
    return levelLookup[objectName]; 
  };

  this.addGameObject = function(objectName, object) {
    levelLookup[objectName] = object;
  };
};

module.exports = Level;

