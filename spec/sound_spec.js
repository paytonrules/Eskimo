describe("Eskimo#Jukebox", function() {
  var Jukebox;
  // Because JSDom don't do HTML5 - a simulator for the audio element
  var audioElement = {
    play: function() {
    }
  };
 
  // Because JSDom don't do HTML5 I'm faking assets (which would load an audio element) 
  // I might be able to remove this fake
  var fakeAssets = {
    getSound: function(name) {
    }
  };

  beforeEach(function() {
    Jukebox = require("spec_helper").Eskimo.Jukebox;
    Jukebox.assets = fakeAssets;
    spyOn(audioElement, "play");
    spyOn(fakeAssets, "getSound").andReturn(audioElement);
  });

  it("should play a sound from the asset list", function() {
    Jukebox.play("bang");

    expect(audioElement.play).toHaveBeenCalled();
  });

  it("gets the right sound from the asset list", function() {
    Jukebox.play("bang");

    expect(fakeAssets.getSound).toHaveBeenCalledWith("bang");
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
