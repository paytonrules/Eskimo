var _ = require("underscore");
module.exports = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || require('./scheduler'),
      Game = dependencies["game"],
      jquery = require('jquery'),
      Screen = dependencies["screen"] || require("./screen"),
      FixedGameLoop = require("./fixed-game-loop"),
      Events = require('./events'),
      ObjectPipeline = require('./object_pipeline/display_visible_objects.js');


  // Main needs to get streamlined.
  return {
    start: function(configuration) {
      var FRAME_RATE = configuration.FRAME_RATE || 60;
      var scheduler = new Scheduler(FRAME_RATE);
      var screen = new Screen(configuration.canvas);

      var GameSpec = require("./game_spec_factory");
      var spec = GameSpec.createGameSpec(configuration.levels, screen);
      var game = Game.create(spec, screen);
      
      Events.bind({jquery: jquery,
                  document: configuration.document.documentElement,
                  game: game,
                  canvas: configuration.canvas});

      FixedGameLoop.start(scheduler, game, screen);
    }
  };
};
