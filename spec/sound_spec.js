describe("Eskimo#Jukebox", function() {
  var Jukebox, 
      assets = new Eskimo.Assets(),
      audioElement = {
        play: function() {},
        get: function() {
          return this;
        }
      };


  beforeEach(function() {
    Eskimo = require("spec_helper").Eskimo;

    Jukebox = Eskimo.Jukebox(assets);
    
    spyOn(assets, "get").andReturn(audioElement);
    spyOn(audioElement, "play");
  });

  it("should play a sound from the asset list", function() {
    Jukebox.play("bang");

    expect(audioElement.play).toHaveBeenCalled();
  });

  it("gets the right sound from the asset list", function() {
    Jukebox.play("bang");

    expect(assets.get).toHaveBeenCalledWith("bang");
  });

});
