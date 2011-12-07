module.exports = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || require('./scheduler'),
      Assets = dependencies['assets'] || require('./assets'),
      Updater = dependencies["updater"],
      jquery = dependencies["jquery"],
      Screen = dependencies["screen"] || require("./screen"),
      UpdaterList = require("./updater_list"),
      FixedGameLoop = require("./fixed-game-loop");

  function bindEventsOn(eventList, element, updater) {
    _(eventList).each(function(eventName) {
      jquery(element).bind(eventName, function(event) {
        if (typeof(updater[eventName]) !== "undefined") {
          updater[eventName](event);
        }
      });
    });
  }

  // NOTE: This is probalby wrong - you should probably bind to the updater list
  function bindAllEvents(document, canvas, updater) {
    bindEventsOn(module.exports.DOCUMENT_EVENTS, document.documentElement, updater);
    bindEventsOn(module.exports.CANVAS_EVENTS, canvas, updater);
  };

  // Main needs to get streamlined.
  return {
    start: function(configuration) {
      var LevelLoader = require("./level_loader");
      LevelLoader.levels = configuration.levels;
      LevelLoader.initializeAssets(jquery);

      var FRAME_RATE = configuration.FRAME_RATE || 60,
          updaterList = new UpdaterList(),
          screen = new Screen(configuration.canvas),
          updater = new Updater(screen),
          scheduler = new Scheduler(FRAME_RATE);

      updaterList.add(updater);

      bindAllEvents(configuration.document, configuration.canvas, updater); 

      FixedGameLoop.start(scheduler, updaterList, screen);
    }
  };
};

module.exports.DOCUMENT_EVENTS = ['keydown', 'keyup'];
module.exports.CANVAS_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'];
