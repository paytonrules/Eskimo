describe("Level", function() {
  var should = require('should'),
      level = require('../src/level'),
      spiedJQuery,
      window,
      sandbox = require('sinon').sandbox.create();

  function setupJQueryWithASpy() {
    var dom = require('jsdom').jsdom(),
        define = require('../node_modules/jsdom/lib/jsdom/level2/html').define;

    window = dom.createWindow();
    require("jquery").create(window);

    define("HTMLAudioElement", {
      tagName: 'AUDIO',
      attributes: [
        'src'
      ]
    });
  
    spiedJQuery = sandbox.spy(window, 'jQuery');
  };

  beforeEach(function() {
    setupJQueryWithASpy();
    level.initializeAssets(window.jQuery);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("loads no assets when the levels passed in is empty", function() {
    level.levels = {};

    level.load("monkey");

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
    spiedJQuery.returnValues[0].trigger('load');

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

    spiedJQuery.returnValues[0].trigger('canplaythrough');
    spiedJQuery.returnValues[1].trigger('canplaythrough');

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

    // Note we trigger load on the second created jquery object (levelTwo)
    spiedJQuery.returnValues[1].trigger('load');

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
    
    spiedJQuery.returnValues[1].trigger('canplaythrough');

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
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('canplaythrough');
    
    level.load("badLevel");

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

  it("allows adding a game object at any time to the current level", function() {
    level.levels = {
      "levelOne" : {}
    }
    level.load("levelOne");

    level.addGameObject("key", {"object_id" : 2});

    level.gameObject('key').object_id.should.eql(2);
  });

  it("makes a configurable callback when all the images on a level are loaded", function() {
    level.levels = {
      "newLevel": {
        "gameObject" : {
          "images" : {
            "imageName" : {
              "src" : "background.jpg"
            },
            "imageNameTwo" : {
              "src" : "alsoBackground.jpg"
            }
          }
        }
      }
    };

    level.allImagesLoaded = sandbox.stub();

    level.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');

    var orderedImageAssets = [level.images().get('imageName'),
                              level.images().get('imageNameTwo')];

    level.allImagesLoaded.calledWith(orderedImageAssets).should.be.true;
  });

  it("makes that same call once if the images are spread over multiple objects", function() {
    level.levels = {
      "newLevel": {
        "gameObject" : {
          "images" : {
            "imageName" : {
              "src" : "background.jpg"
            }
          }
        },
        "gameObjectTwo" : {
          "images" : {
            "imageNameTwo" : {
              "src" : "alsoBackground.jpg"
            }
          }
        }
      }
    };

    var assetsAtCallTime;
    level.allImagesLoaded = function(assets) {
      assetsAtCallTime = assets.slice(0);
    }

    level.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');

    var orderedImageAssets = [level.images().get('imageName'),
                              level.images().get('imageNameTwo')];

    assetsAtCallTime.length.should.equal(2);
    assetsAtCallTime[0].should.equal(orderedImageAssets[0]);
    assetsAtCallTime[1].should.equal(orderedImageAssets[1]);
  });

});
