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

/*
 *
 *    
 *
 *    var sound = Eskimo.Sound(assets);
 *    $ = require("jquery");
 *    var sound = Eskimo.Sound("song.mp3");
 *    var soundPlayed = false;
 *
 *    $('audio#eskimo_sound').bind('play', function(e) {
 *      console.log("FUCK YOU FUCKING FUCKERS");
 *      e.preventDefault();
 *      // Check sound
 *      soundPlayed = true;
 *    });
 *
 *    sound.play();
 *
 *    expect(soundPlayed).toBeTruthy();
 *
*
 *
 *  Eskimo.Speaker.play("fuck");
 *  Eskmio.Speaker.playSong("lolololo");
 */
