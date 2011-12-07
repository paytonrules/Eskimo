Eskimo = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || Eskimo.Scheduler,
      Assets = dependencies['assets'] || Eskimo.Assets,
      Updater = dependencies["updater"],
      jquery = dependencies["jquery"],
      Screen = dependencies["screen"] || Eskimo.Screen,
      Jukebox = Eskimo.Jukebox,
      UpdaterList = require("../src/updater_list");

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
    bindEventsOn(Eskimo.DOCUMENT_EVENTS, document.documentElement, updater);
    bindEventsOn(Eskimo.CANVAS_EVENTS, canvas, updater);
  };

  // Main needs to get streamlined.
  return {
    start: function(configuration) {
      Eskimo.LevelLoader.levels = configuration.levels;
      Eskimo.LevelLoader.initializeAssets(jquery);

      var FRAME_RATE = configuration.FRAME_RATE || 60,
          updaterList = new UpdaterList(),
          screen = new Screen(configuration.canvas),
          updater = new Updater(screen),
          scheduler = new Scheduler(FRAME_RATE);

      updaterList.add(updater);

      bindAllEvents(configuration.document, configuration.canvas, updater); 

      Eskimo.FixedGameLoop.start(scheduler, updaterList, screen);
    }
  };
};

Eskimo.DOCUMENT_EVENTS = ['keydown', 'keyup'];
Eskimo.CANVAS_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'];
