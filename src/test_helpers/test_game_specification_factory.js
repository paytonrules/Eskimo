var GameSpec = require('../game_spec'),
    TestAssetLoader = require('./test_asset_loader'),
    SoundLoader = require('../object_pipeline/sound_loader'),
    DefaultLoaders = require('../object_pipeline/register_default_loaders'),
    _ = require('underscore');

module.exports = {
  create: function(assetDefinition, screen) {
    function ProxiedJukeBox(jukebox) {
      var playedSounds = [],
          stoppedSounds = [];

      _.extend(this, jukebox);
      this.play = function() {
        playedSounds.push(arguments[0]);
        jukebox.play.apply(jukebox, arguments);
      };

      this.played = function(soundName) {
        return _.contains(playedSounds, soundName);
      };
      
      this.stopped = function(soundName) {
        return _.contains(stoppedSounds, soundName);
      };

      this.stop = function() {
        stoppedSounds.push(arguments[0]);
        jukebox.stop.apply(jukebox, arguments);
      };

      return this;
    }

    function ProxiedLevel(level) {
      var latestJukebox;
      
      _.extend(this, level);
      
      this.playedSound = function(soundName) {
        return latestJukebox.played(soundName);
      };

      this.stoppedSound = function(soundName) {
        return latestJukebox.stopped(soundName);
      };

      this.getJukebox = function() {
        latestJukebox = new ProxiedJukeBox(level.getJukebox());
        return latestJukebox;
      };

      return this;
    }

    function ProxiedGameSpec(gameSpec) {
      var mostRecentLevel;
      _.extend(this, gameSpec);

      this.load = function(name, callback) {
        gameSpec.load(name, function(level) {
          mostRecentLevel = new ProxiedLevel(level);
          callback(mostRecentLevel);
        });
      };

      this.level = function() {
        return mostRecentLevel;
      };

      return this;
    }

    var spec = new GameSpec({
      assetDefinition: assetDefinition,
      screen: screen
    });
    
    var gameSpec = new ProxiedGameSpec(spec);
    DefaultLoaders.register(gameSpec, TestAssetLoader);

    return gameSpec;
  }
};
