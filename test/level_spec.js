describe("Level", function() {
  var Spies = require('./spies'),
      should = require('should'),
      level = require('../src/level'),
      FixedGameLoop = require('../src/fixed-game-loop'),
      _ = require("underscore"),
      updaterList,
      spiedJQuery;

  function spyOnJQueryCapturingElements() {
    var spiedJQuery = {
      jquery: (function() {
        var dom = require('jsdom').jsdom(),
            define = require('../node_modules/jsdom/lib/jsdom/level2/html').define,
            window = dom.createWindow(),
            $ = require("jquery").create(window);

        define("HTMLAudioElement", {
          tagName: 'AUDIO',
          attributes: [
            'src'
          ]
        });
     
        return $;
      })(),


      triggerEvent: function(eventName) {
        _(spiedJQuery.elements).each(function(element) {
          element.trigger(eventName);
        });
      },

      elements: []
    };

    Spies.stub(spiedJQuery, 'jquery').andCallFake(function(spy, params) {
      var newElement = spy.originalFunction(params['0']);

      spiedJQuery.elements.push(newElement);
      return newElement;
    });

    return spiedJQuery;
  };

  beforeEach(function() {
    spiedJQuery = spyOnJQueryCapturingElements();
    level.initializeAssets(spiedJQuery.jquery);
  });

  it("loads no assets when the levels passed in is empty", function() {
    level.levels = {};

    level.load("monkey");

    console.log(level);
    console.log(level.images);
    level.images().size().should.equal(0);
  });

  it("creates image assets for any images on the objects in the level", function() {
    var imageAssets;
    level.levels = {
      "newLevel": {
        "gameObject" : {
          "images" : {
            "imageName" : {
              "src" : "background.jpg"
            }
          }
        }
      }
    };

    level.load("newLevel");
    spiedJQuery.triggerEvent("load");

    imageAssets = level.images();

    imageAssets.get("imageName").src.should.equal('background.jpg');
  });

  it("creates a jukebox from the sounds on the objects in the level", function() {
    var jukebox;
    level.levels = {
      "newLevel": {
        "gameObject" : {
          "sounds": {
            "soundOne": {
              "src": "sound.mp3"
            },
            "soundTwo": {
              "src": "secondSound.mp3"
            }
          }
        }
      }
    };

    level.load("newLevel");
    spiedJQuery.triggerEvent("canplaythrough");

    jukebox = level.getJukebox();

    jukebox.assets.get('soundOne').src.should.equal('sound.mp3');
    jukebox.assets.get('soundTwo').src.should.equal('secondSound.mp3');
  });

  it("removes the previous level images", function() {
    var imageAssets;
    level.levels = {
      "levelOne": {
        "gameObject" : {
          "images": {
            "oldImage": {
              "src": "witchDoctor.png"
            }
          }
        }
      },
      "levelTwo": {
        "gameObject" : {
          "images": {
            "newImage": {
              "src": "christmasSong.png"
            }
          }
        }
      }
    };

    level.load("levelOne");
    level.load("levelTwo");
    spiedJQuery.triggerEvent("load");

    imageAssets = level.images();

    should.not.exist(imageAssets.get("oldImage"));
    imageAssets.get("newImage").should.be.ok;
  });

  it("removes the previous levels sounds as well", function() {
    var soundAssets;

    level.levels = {
      "levelOne": {
        "gameObject" : {
          "sounds": {
            "oldSound": {
              "src": "witchDoctor.mp3"
            }
          }
        }
      },
      "levelTwo": {
        "gameObject" : {
          "sounds": {
            "newSound": {

              "src": "christmasSong.mp3"
            }
          }
        }
      }
    };

    level.load("levelOne");
    level.load("levelTwo");
    spiedJQuery.triggerEvent("canplaythrough");

    soundAssets = level.getJukebox().assets;

    should.not.exist(soundAssets.get("oldSound"));
    soundAssets.get("newSound").should.exist;
  });
    
  it("does not clear the previous level if the requested level doesn't exist", function() {
    var soundAssets, imageAssets;
    
    level.levels = {
      "levelOne": {
        "gameObject" : {
          "sounds": {
            "sound": {
              "src": "soundy.mp3"
            }
          },
          "images": {
            "image": {
              "src": "image.jpg"
            }
          }
        }
      }
    };

    level.load("levelOne");
    level.load("badLevel");
    spiedJQuery.triggerEvent("canplaythrough");
    spiedJQuery.triggerEvent("load");

    soundAssets = level.getJukebox().assets;
    imageAssets = level.images();

    soundAssets.get("sound").should.exist;
    imageAssets.get("image").should.exist;
  });

  it("allows access to the currentLevel game objects", function() {
    level.levels = {
      "levelOne": {
        "gameObject" : {
          "property" : 2
        }
      }
    };
     
    level.load("levelOne");

    level.gameObject('gameObject').property.should.equal(2);
  });

});
