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

  function bindEvents(document, updater) {
    jquery(document.documentElement).bind({
      keydown: function(event) {
        if (typeof(updater.keydown) !== "undefined") {
          updater.keydown(event);
        }
      },

      keyup: function(event) {
        if (typeof(updater.keyup) !== "undefined") {
          updater.keyup(event);
        }
      }
    });

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

      bindEvents(configuration.document, updater); 

      loop.start();
    }
  };
};
