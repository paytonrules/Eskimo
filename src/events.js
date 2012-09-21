var _ = require('underscore');

module.exports = {
  CANVAS_EVENTS: ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'],
  DOCUMENT_EVENTS: ['keydown', 'keyup'],
  bind: function(configuration) {
    var jquery = configuration.jquery,
        canvas = configuration.canvas,
        document = configuration.document,
        game = configuration.game;

    _(module.exports.DOCUMENT_EVENTS).each(function(eventName) {
      jquery(document).bind(eventName, function(event) {

        if (typeof(game[eventName]) !== "undefined") {
          game[eventName](event);
        }

      });
    });

    _(module.exports.CANVAS_EVENTS).each(function(eventName) {
      jquery(canvas).bind(eventName, function(event) {

        if (typeof(game[eventName]) !== "undefined") {
          if (typeof(canvas['offset']) !== "undefined") {

            game[eventName]({x: event.pageX - canvas.offset().left,
                             y: event.pageY - canvas.offset().top});

          } else {
            game[eventName](event);
          }
        }

      });
    });
  }
};
