Eskimo = function(depend) {
  var dependencies = depend || {}, 
      Scheduler = dependencies['scheduler'] || Eskimo.Scheduler,
      GameLoop = dependencies['gameLoop'] || Eskimo.FixedGameLoop,
      Assets = dependencies['assets'] || Eskimo.Assets,
      Updater = dependencies["updater"],
      jquery = dependencies["jquery"],
      Screen = Eskimo.Screen,
      Jukebox = Eskimo.Jukebox,
      scheduler;

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
      var FRAME_RATE = configuration.FRAME_RATE || 60;
      scheduler = new Scheduler(FRAME_RATE);
      var imageAssets = new Assets({jquery: jquery, tag: 'IMG', loadEvent: 'load'});
      var soundAssets = new Assets({jquery: jquery, tag: 'audio', loadEvent: 'canplaythrough'});
      var screen = new Screen(configuration.canvas, imageAssets)
      var updater = new Updater({images: imageAssets, sounds: soundAssets}, screen);
      var loop = new GameLoop(scheduler, updater, screen);

      bindAllEvents(configuration.document, configuration.canvas, updater); 

      loop.start();
    }
  };
};

Eskimo.DOCUMENT_EVENTS = ['keydown', 'keyup'];
Eskimo.CANVAS_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'];
