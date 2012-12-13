var GameSpec = require('../game_spec');
var TestAssetLoaderFactory = require('./test_asset_loader_factory');
var _ = require('underscore');

module.exports = {
  create: function(assetDefinition, screen) {
    function ProxiedJukeBox(jukebox) {
      var playedSounds = [];

      this.play = function() {
        playedSounds.push(arguments[0]);
        jukebox.play.apply(jukebox, arguments);
      };

      this.played = function(soundName) {
        return _.contains(playedSounds, soundName);
      };

      return this;
    }

    function ProxiedLevel(level) {
      var latestJukebox;
      this.playedSound = function(soundName) {
        return latestJukebox.played(soundName);
      };

      this.getJukebox = function() {
        latestJukebox = new ProxiedJukeBox(level.getJukebox());
        return latestJukebox;
      };
      
      return this;
    }

    function ProxiedGameSpec(gameSpec) {
      var mostRecentLevel;

      this.load = function(name, callback) {
        gameSpec.load(name, function(level) {
          mostRecentLevel = new ProxiedLevel(level);
          callback(mostRecentLevel);
        });
      };

      this.level = function() {
        return mostRecentLevel;
      };

      var that = this; // Javascript seriously - fuck off
      _.each(_.pairs(gameSpec), function(pair) {
        if (!that[pair[0]]) {
            that[pair[0]] = function() {
              return gameSpec[pair[0]].apply(gameSpec, arguments);
            };
        }
      });

      return this;
    }

    var spec = new GameSpec({
      assetDefinition: assetDefinition,
      screen: screen,
      assetLoaderFactory: TestAssetLoaderFactory
    });

    return new ProxiedGameSpec(spec);
  }
};
