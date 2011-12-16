// Weird - where the hell is spec helper being required?  And yet this works!
// It's in the global
describe("LevelLoader", function() {
  var levelLoader,
      Spies = require('./spies'),
      should = require('should'),
      LevelLoader = require('../src/level_loader'),
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
    levelLoader = LevelLoader;
    levelLoader.initializeAssets(spiedJQuery.jquery);
  });

  it("loads no assets when the levels passed in is empty", function() {
    levelLoader.levels = {};

    levelLoader.load("monkey");

    levelLoader.getImageAssets().size().should.equal(0);
  });

  it("creates image assets for any images in the level", function() {
    var imageAssets;
    levelLoader.levels = {
      "newLevel": {
        "images" : {
          "imageName" : {
            "src" : "background.jpg"
          }
        }
      }
    };

    levelLoader.load("newLevel");
    spiedJQuery.triggerEvent("load");

    imageAssets = levelLoader.getImageAssets();

    imageAssets.get("imageName").src.should.equal('background.jpg');
  });

  it("creates a jukebox from the sounds in the level", function() {
    var jukebox;
    levelLoader.levels = {
      "newLevel": {
        "sounds": {
          "soundOne": {
            "src": "sound.mp3"
          },
          "soundTwo": {
            "src": "secondSound.mp3"
          }
        }
      }
    };

    levelLoader.load("newLevel");
    spiedJQuery.triggerEvent("canplaythrough");

    jukebox = levelLoader.getJukebox();

    jukebox.assets.get('soundOne').src.should.equal('sound.mp3');
    jukebox.assets.get('soundTwo').src.should.equal('secondSound.mp3');
  });

  it("removes the previous level images", function() {
    var imageAssets;
    levelLoader.levels = {
      "levelOne": {
        "images": {
          "oldImage": {
            "src": "witchDoctor.png"
          }
        }
      },
      "levelTwo": {
        "images": {
          "newImage": {
            "src": "christmasSong.png"
          }
        }
      }
    };

    levelLoader.load("levelOne");
    levelLoader.load("levelTwo");
    spiedJQuery.triggerEvent("load");

    imageAssets = levelLoader.getImageAssets();

    should.not.exist(imageAssets.get("oldImage"));
    imageAssets.get("newImage").should.be.ok;
  });

  it("removes the previous levels sounds as well", function() {
    var soundAssets;

    levelLoader.levels = {
      "levelOne": {
        "sounds": {
          "oldSound": {
            "src": "witchDoctor.mp3"
          }
        }
      },
      "levelTwo": {
        "sounds": {
          "newSound": {
            "src": "christmasSong.mp3"
          }
        }
      }
    };

    levelLoader.load("levelOne");
    levelLoader.load("levelTwo");
    spiedJQuery.triggerEvent("canplaythrough");

    soundAssets = levelLoader.getJukebox().assets;

    should.not.exist(soundAssets.get("oldSound"));
    soundAssets.get("newSound").should.exist;
  });
    
  it("does not clear the previous level if the requested level doesn't exist", function() {
    var soundAssets, imageAssets;
    
    levelLoader.levels = {
      "levelOne": {
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
    };

    levelLoader.load("levelOne");
    levelLoader.load("badLevel");
    spiedJQuery.triggerEvent("canplaythrough");
    spiedJQuery.triggerEvent("load");

    soundAssets = levelLoader.getJukebox().assets;
    imageAssets = levelLoader.getImageAssets();

    soundAssets.get("sound").should.exist;
    imageAssets.get("image").should.exist;
  });

  describe("The controls", function() {
    var levelsWithControl = {
          "levelOne": {
            "images": {
              "image": {
                "src": "src.jpg",
                "control": "Tests.MyControl",
                "data": "data"
              }
            },
            "sounds": {
              "sound": {
                "control": "Tests.MySoundControl",
                "extraSoundData": "soundData"
              }
            }
          }
        },
        jquery,
        updateList,
        levelLoader;

    Tests = {
      MyControl: {
        create: function(structure, context) {
          this.structure = structure;
          this.context = context;
          return new String(); // Ha - bad practice - but perfect for this test
        }
      },
      MySoundControl: {
        create: function(structure, context) {
          this.structure = structure;
          return {};
        }
      }
    };

    beforeEach(function() {
      jquery = require('jquery');
      levelLoader = LevelLoader;
      levelLoader.initializeAssets(jquery);
      var UpdaterList = require("../src/updater_list");
      updaterList = new UpdaterList()
      var emptyFunction = function() {};
      FixedGameLoop.start({start: emptyFunction, getTicks: emptyFunction}, updaterList, {});
      levelLoader.levels = levelsWithControl;
    });

    it("adds to the update list for any controls", function() {
      levelLoader.load("levelOne");

      updaterList.get(0).should.be.an.instanceof(String);
    });

    it("passes in any other data to the structure field", function() {
      levelLoader.load("levelOne");

      Tests.MyControl.structure.data.should.equal('data');
    });

    it("does this for sounds as well - ugh this stupid duplication", function() {
      levelLoader.load("levelOne");
      
      Tests.MySoundControl.structure.extraSoundData.should.equal('soundData');
    });

    it("optionally takes a context that is passed to any created controls", function() {
      var context = "test";

      levelLoader.load("levelOne", context);

      Tests.MyControl.context.should.equal('test');
    });
  });

});
