module.exports = {
  audioTag: {
    addToDom: function() {
      var dom = require('jsdom').jsdom(),
      define = require('../node_modules/jsdom/lib/jsdom/level2/html').define;

      define("HTMLAudioElement", {
        tagName: 'AUDIO',
        proto: {
          play: function() {
          }
        },
        attributes: [
          'src'
        ]
      });
    }
  }
};
