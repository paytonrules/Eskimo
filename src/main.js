var _ = require("underscore");
module.exports = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || require('./scheduler'),
      Assets = dependencies['assets'] || require('./assets'),
      game = dependencies["game"],
      jquery = dependencies["jquery"],
      Screen = dependencies["screen"] || require("./screen"),
      FixedGameLoop = require("./fixed-game-loop");

  function bindEventsOn(eventList, element) {
    _(eventList).each(function(eventName) {
      jquery(element).bind(eventName, function(event) {
        if (typeof(game[eventName]) !== "undefined") {
          game[eventName](event);
        }
      });
    });
  }

  function bindAllEvents(document, canvas) {
    bindEventsOn(module.exports.DOCUMENT_EVENTS, document.documentElement, game);
    bindEventsOn(module.exports.CANVAS_EVENTS, canvas, game);
  };

  // Main needs to get streamlined.
  return {
    start: function(configuration) {
      // TODO - this doesn't feel right here 
      var LevelLoader = require("./level_loader");
      LevelLoader.levels = configuration.levels;
      LevelLoader.initializeAssets(jquery);

      var FRAME_RATE = configuration.FRAME_RATE || 60;
      var scheduler = new Scheduler(FRAME_RATE);
      var screen = new Screen(configuration.canvas);
      
      game.screen = screen;

      bindAllEvents(configuration.document, configuration.canvas); 

      FixedGameLoop.start(scheduler, game, screen);
    }
  };
};

module.exports.DOCUMENT_EVENTS = ['keydown', 'keyup'];
module.exports.CANVAS_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'];
