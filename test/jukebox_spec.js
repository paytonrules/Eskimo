describe("Jukebox", function() {
  var Jukebox = require("../src/jukebox"),
      Assets = require("../src/assets"),
      assets = new Assets({}),
      // Should be an actual HTML5 element - dis be bs
      audioElement = {
        play: function() {},
        pause: function() {},
        get: function() {
          return this;
        }
      },
      should = require('should'),
      sandbox = require('sinon').sandbox.create(),
      jukebox; 

  beforeEach(function() {
    jukebox = Jukebox(assets);

    sandbox.stub(audioElement, "play");
  });
  
  afterEach(function() {
    sandbox.restore();
  });

  it("should plays the sound from the asset list", function() {
    assets.add("bang", audioElement);
    
    jukebox.play("bang");

    audioElement.play.called.should.be.true;
  });

  it("plays nothing if the sound doesn't exist", function() {
    jukebox.play("nuttin");

    audioElement.play.called.should.be.false;
  });

  it("stops the song when stop is called", function() {
    var pauseSpy = sandbox.spy(audioElement, 'pause');
    assets.add("bang", audioElement);

    jukebox.stop("bang");

    pauseSpy.called.should.be.true;
  });

  it("doesn't error when stopping a non-existent song", function() {
    jukebox.stop("nonsong");
  });

});
