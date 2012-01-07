/*describe("Jukebox", function() {
  var Jukebox = require("../src/jukebox"),
      Assets = require("../src/assets"),
      sinon = require('sinon'),
      assets = new Assets({}),
      // Should be an actual HTML5 element - dis be bs
      audioElement = {
        play: function() {},
        pause: sinon.stub(),
        get: function() {
          return this;
        }
      },
      should = require('should'),
      Spies = require('./spies'),
      sandbox = sinon.sandbox.create(),
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
    assets.add("bang", audioElement);

    jukebox.stop("bang");

    audioElement.pause.called.should.be.true;
  });

  it("doesn't error when stopping a non-existent song", function() {
    jukebox.stop("nonsong");
  });

});*/
