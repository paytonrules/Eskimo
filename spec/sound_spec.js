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
    
    spyOn(audioElement, "play");
  });

  it("should play a sound from the asset list", function() {
    spyOn(assets, "get").andReturn(audioElement);
    Jukebox.play("bang");

    expect(audioElement.play).toHaveBeenCalled();
  });

  it("gets the right sound from the asset list", function() {
    spyOn(assets, "get").andReturn(audioElement);
    Jukebox.play("bang");

    expect(assets.get).toHaveBeenCalledWith("bang");
  });

  it("does not throw an exception if the sound doesnt exist", function() {
    spyOn(assets, "get").andReturn(null);
    
    expect(function() { Jukebox.play("yo momma"); }).not.toThrow();
  });

});
