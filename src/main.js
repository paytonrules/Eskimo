var _ = require("underscore");

module.exports = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || require('./scheduler'),
      Assets = dependencies['assets'] || require('./assets'),
      game = dependencies["game"],
      jquery = dependencies["jquery"],
      Screen = dependencies["screen"] || require("./screen"),
      FixedGameLoop = require("./fixed-game-loop");

  function bindAllEvents(document, canvas) {
    _(module.exports.DOCUMENT_EVENTS).each(function(eventName) {
      jquery(canvas).bind(eventName, function(event) {
        if (typeof(game[eventName]) !== "undefined") {
          game[eventName](event);
        }
      });

    _(module.exports.CANVAS_EVENTS).each(function(eventName) {
      jquery(canvas).bind(eventName, function(event) {
        if (typeof(game[eventName]) !== "undefined") {
          if (typeof(canvas.offset) !== "undefined") {
            game[eventName]({x: event.pageX - canvas.offset().left,
                             y: event.pageY - canvas.offset().top});
          } else {
            game[eventName](event);
          }
        }
      });
    });
  };

  // Main needs to get streamlined.
  return {
    start: function(configuration) {
      // TODO - this doesn't feel right here 
      // It isn't right - you should have to initialize the level loader with assets and jquery to use it
      // JQuery pattern? You can pass a constructor or just use the object
      var LevelLoader = require("./level_loader");
      LevelLoader.levels = configuration.levels;
      LevelLoader.initializeAssets(jquery);

      var FRAME_RATE = configuration.FRAME_RATE || 60;
      var scheduler = new Scheduler(FRAME_RATE);
      var screen = new Screen(configuration.canvas);

      bindAllEvents(configuration.document, configuration.canvas); 

      FixedGameLoop.start(scheduler, game, screen);
    }
  };
};

module.exports.DOCUMENT_EVENTS = ['keydown', 'keyup'];
module.exports.CANVAS_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'];
