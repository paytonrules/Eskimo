Eskimo = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || Eskimo.Scheduler,
      Assets = dependencies['assets'] || Eskimo.Assets,
      Updater = dependencies["updater"],
      jquery = dependencies["jquery"],
      Screen = dependencies["screen"] || Eskimo.Screen,
      Jukebox = Eskimo.Jukebox;

  function bindEventsOn(eventList, element, updater) {
    _(eventList).each(function(eventName) {
      jquery(element).bind(eventName, function(event) {
        if (typeof(updater[eventName]) !== "undefined") {
          updater[eventName](event);
        }
      });
    });
  }

  function bindAllEvents(document, canvas, updater) {
    bindEventsOn(Eskimo.DOCUMENT_EVENTS, document.documentElement, updater);
    bindEventsOn(Eskimo.CANVAS_EVENTS, canvas, updater);
  };

  return {
    start: function(configuration) {
      // Ugh - no likey
      Eskimo.LevelLoader.levels = configuration.levels;
      Eskimo.LevelLoader.initializeAssets(jquery);

      var FRAME_RATE = configuration.FRAME_RATE || 60,
          updaterList = new Eskimo.UpdaterList(),
          screen = new Screen(configuration.canvas),
          updater = new Updater(screen),
          scheduler = new Scheduler(FRAME_RATE);

      updaterList.add(updater);

      Eskimo.FixedGameLoop.init(scheduler, updaterList, screen);

      bindAllEvents(configuration.document, configuration.canvas, updater); 

      Eskimo.FixedGameLoop.start();
    }
  };
};

Eskimo.DOCUMENT_EVENTS = ['keydown', 'keyup'];
Eskimo.CANVAS_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'];
