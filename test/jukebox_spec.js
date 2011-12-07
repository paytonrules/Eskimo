describe("Jukebox", function() {
  var Jukebox = require("../src/JukeBox"),
      Assets = require("../src/Assets"),
      assets = new Assets({}),
      audioElement = {
        play: function() {},
        get: function() {
          return this;
        }
      },
      should = require('should'),
      Spies = require('./spies'),
      jukebox; 

  beforeEach(function() {
    jukebox = Jukebox(assets);
    
    Spies.stub(audioElement, "play");
  });

  it("should play a sound from the asset list", function() {
    var assetsSpy = Spies.spyOn(assets, "get", audioElement);
    jukebox.play("bang");

    assetsSpy.wasCalled().should.be.true;
  });

  it("gets the right sound from the asset list", function() {
    var assetsSpy = Spies.spyOn(assets, "get", audioElement);
    jukebox.play("bang");

    assetsSpy.wasCalled().should.be.true;
  });

  it("does not throw an exception if the sound doesnt exist", function() {
    Spies.stub(assets, "get", null);
    
    jukebox.play("yo momma");
  });

});
