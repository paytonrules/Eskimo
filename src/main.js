var _ = require("underscore");
module.exports = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || require('./scheduler'),
      Assets = dependencies['assets'] || require('./assets'),
      game = dependencies["game"],
      jquery = dependencies["jquery"],
      Screen = dependencies["screen"] || require("./screen"),
      FixedGameLoop = require("./fixed-game-loop"),
      Events = require('./events');

  // Main needs to get streamlined.
  return {
    start: function(configuration) {
      // TODO - this doesn't feel right here 
      // It isn't right - you should have to initialize the level loader with assets and jquery to use it
      // JQuery pattern? You can pass a constructor or just use the object
      var LevelLoader = require("./level");
      LevelLoader.levels = configuration.levels;
      LevelLoader.initializeAssets(jquery);

      var FRAME_RATE = configuration.FRAME_RATE || 60;
      var scheduler = new Scheduler(FRAME_RATE);
      var screen = new Screen(configuration.canvas);
      
      Events.bind({jquery: jquery,
                  document: configuration.document.documentElement,
                  game: game,
                  canvas: configuration.canvas});

      FixedGameLoop.start(scheduler, game, screen);
    }
  };
};
