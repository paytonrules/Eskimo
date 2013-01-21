var SpriteLoader = require('./sprite_loader'),
    SoundLoader = require('./sound_loader');

module.exports = {
  register: function(spec, assetLoader) {
    spec.registerLoader('sprite', SpriteLoader.create(assetLoader));
    spec.registerLoader('sound', SoundLoader.create(assetLoader));
  }
};
