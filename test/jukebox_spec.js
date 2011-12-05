describe("Eskimo#Jukebox", function() {
  var Jukebox, 
      Eskimo = require("./spec_helper").Eskimo,
      assets = new Eskimo.Assets({}),
      audioElement = {
        play: function() {},
        get: function() {
          return this;
        }
      },
      should = require('should'),
      Spies = require('./spies');

  beforeEach(function() {
    Jukebox = Eskimo.Jukebox(assets);
    
    Spies.stub(audioElement, "play");
  });

  it("should play a sound from the asset list", function() {
    var assetsSpy = Spies.spyOn(assets, "get", audioElement);
    Jukebox.play("bang");

    assetsSpy.wasCalled().should.be.true;
  });

  it("gets the right sound from the asset list", function() {
    var assetsSpy = Spies.spyOn(assets, "get", audioElement);
    Jukebox.play("bang");

    assetsSpy.wasCalled().should.be.true;
  });

  it("does not throw an exception if the sound doesnt exist", function() {
    Spies.stub(assets, "get", null);
    
    Jukebox.play("yo momma");
  });

});
