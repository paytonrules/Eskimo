// The tests for this are in game_spec_spec.js
// TODO: fix
var Level = function() {
  var Jukebox = require('./jukebox'),
      Assets = require('./assets'),
      soundAssets = new Assets(),
      levelLookup = {};

  // I think you want to get rid of the jukebox, in favor of an
  // track object in the gameObjects.
  // This way everything could happen in the load, possibly by registering 
  // for an update when the level is loaded.
  this.getJukebox = function() {
    return Jukebox(soundAssets);
  };

  this.gameObject = function(objectName) {
    return levelLookup[objectName]; 
  };

  this.addGameObject = function(objectName, object) {
    levelLookup[objectName] = object;
  };

  this.addSoundAsset = function(objectName, object) {
    var jquery = require('jquery');
    soundAssets.add(objectName, jquery(object.asset));
  };
};

module.exports = Level;

