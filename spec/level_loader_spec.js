describe("Eskimo.LevelLoader", function() {
  var levelLoader;

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

    spyOn(spiedJQuery, 'jquery').andCallFake(function(params) {
      var newElement = spiedJQuery.jquery.originalValue(params);

      spiedJQuery.elements.push(newElement);
      return newElement;
    });

    return spiedJQuery;
  };

  beforeEach(function() {
    spiedJQuery = spyOnJQueryCapturingElements();
    levelLoader = Eskimo.LevelLoader;
    levelLoader.initializeAssets(spiedJQuery.jquery);
  });

  it("loads no assets when the levels passed in is empty", function() {
    levelLoader.levels = {};

    levelLoader.load("monkey");

    expect(levelLoader.getImageAssets().size()).toEqual(0);
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

    expect(imageAssets.get("imageName").src).toEqual('background.jpg');
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

    expect(jukebox.assets.get('soundOne').src).toEqual('sound.mp3');
    expect(jukebox.assets.get('soundTwo').src).toEqual('secondSound.mp3');
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

    expect(imageAssets.get("oldImage")).toBeNull();
    expect(imageAssets.get("newImage")).not.toBeNull();
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

    expect(soundAssets.get("oldSound")).toBeNull();
    expect(soundAssets.get("newSound")).not.toBeNull();
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

    expect(soundAssets.get("sound")).not.toBeNull();
    expect(imageAssets.get("image")).not.toBeNull();
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
      levelLoader = Eskimo.LevelLoader;
      levelLoader.initializeAssets(jquery);
      Eskimo.FixedGameLoop.updaterList = new Eskimo.UpdaterList()
      levelLoader.levels = levelsWithControl;
    });

    it("adds to the update list for any controls", function() {
      levelLoader.load("levelOne");

      expect(Eskimo.FixedGameLoop.updaterList.get(0) instanceof String).toBeTruthy();
    });

    it("passes in any other data to the structure field", function() {
      levelLoader.load("levelOne");

      expect(Tests.MyControl.structure.data).toEqual("data");
    });

    it("does this for sounds as well - ugh this stupid duplication", function() {
      levelLoader.load("levelOne");
      
      expect(Tests.MySoundControl.structure.extraSoundData).toEqual("soundData");
    });

    it("optionally takes a context that is passed to any created controls", function() {
      context = "test";

      levelLoader.load("levelOne", context);

      expect(Tests.MyControl.context).toEqual("test");
    });
  });

});
