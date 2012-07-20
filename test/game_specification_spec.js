describe("Level", function() {
  var should = require('should'),
      level = require('../src/game_specification'),
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
  }

  beforeEach(function() {
    setupJQueryWithASpy();
    level.initializeAssets(window.jQuery);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("creates the gameSpec", function() {
    var gameSpec = level.createGameSpec({}, spiedJQuery, 'screen');

    should.exist(gameSpec);
  });

  it("loads no assets when the levels passed in is empty", function() {
    var gameSpec = level.createGameSpec({}, spiedJQuery, 'screen');

    var thisLevel = gameSpec.load("monkey");

    thisLevel.images().size().should.equal(0);
  });

  it("creates image assets for any images on the objects in the level", function() {
    var imageAssets;
    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "image" : {
            "src" : "background.jpg"
          }
        }
      }
    };
    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');
    
    var thisLevel = gameSpec.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');

    imageAssets = thisLevel.images();

    imageAssets.get("gameObject").src.should.equal('background.jpg');
  });

  it("creates a jukebox from the sounds on the objects in the level", function() {
    var jukebox;
    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "sound": {
            "src": "sound.mp3"
          }
        }
      }
    };
    
    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');

    var thisLevel = gameSpec.load("newLevel");

    spiedJQuery.returnValues[0].trigger('canplaythrough');

    jukebox = thisLevel.getJukebox();

    jukebox.assets.get('gameObject').src.should.equal('sound.mp3');
  });

  it("removes the previous level images", function() {
    var imageAssets;
    var gameDescription = {
      "levelOne": {
        "gameObject_1" : {
          "image": {
            "src": "witchDoctor.png"
          }
        }
      },
      "levelTwo": {
        "gameObject_2" : {
          "image": {
            "src": "christmasSong.png"
          }
        }
      }
    };

    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');
    var levelOne =  gameSpec.load("levelOne");
    var levelTwo = gameSpec.load("levelTwo");

    // Note we trigger load on the second created jquery object (levelTwo)
    spiedJQuery.returnValues[1].trigger('load');

    imageAssets = levelTwo.images();

    should.not.exist(imageAssets.get("gameObject_1"));
    imageAssets.get("gameObject_2").src.should.equal("christmasSong.png");
  });

  it("removes the previous levels sounds as well", function() {
    var soundAssets;

    var gameDescription = {
      "levelOne": {
        "gameObject_1" : {
          "sound": {
            "src": "witchDoctor.mp3"
          }
        }
      },
      "levelTwo": {
        "gameObject_2" : {
          "sound": {
            "src": "christmasSong.mp3"
          }
        }
      }
    };

    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');
    var levelOne = gameSpec.load("levelOne");
    var levelTwo = gameSpec.load("levelTwo");
    
    spiedJQuery.returnValues[1].trigger('canplaythrough');

    soundAssets = levelTwo.getJukebox().assets;

    should.not.exist(soundAssets.get("gameObject_1"));
    should.exist(soundAssets.get("gameObject_2"));
  });
    
  it("does not clear the previous level if the requested level doesn't exist", function() {
    var soundAssets, imageAssets;
    
    var gameDescription = {
      "levelOne": {
        "gameObject_1" : {
          "sound": {
            "src": "soundy.mp3"
          }
        },
        "gameObject_2" : {
          "image": {
            "src": "image.jpg"
          }
        }
      }
    };

    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');
    var levelOne = gameSpec.load("levelOne");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('canplaythrough');
    
    var levelTwo = gameSpec.load("badLevel");

    soundAssets = levelTwo.getJukebox().assets;
    imageAssets = levelTwo.images();

    should.exist(soundAssets.get("gameObject_1"));
    should.exist(imageAssets.get("gameObject_2"));
  });

  it("allows access to the currentLevel game objects", function() {
    var gameDescription = {
      "levelOne": {
        "gameObject" : {
          "property" : 2
        }
      }
    };
     
    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');
    var levelOne = gameSpec.load("levelOne");

    levelOne.gameObject('gameObject').property.should.equal(2);
  });

  it("allows adding a game object at any time to the current level", function() {
    var gameDescription = {
      "levelOne" : {}
    };
    
    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');
    var levelOne = gameSpec.load("levelOne");

    levelOne.addGameObject("key", {"object_id" : 2});

    levelOne.gameObject('key').object_id.should.eql(2);
  });

  it("makes a configurable callback when all the images on a level are loaded", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject_1" : {
          "image" : {
            "src" : "background.jpg"
          }
        },
        "gameObject_2" : {
          "image" : {
            "src" : "alsoBackground.jpg"
          }
        }
      }
    };

    var callback = function callback(objects) {
      callback.objects = objects;
    };
    level.addImageLoaderCallback(callback);
    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');

    gameSpec.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');

    // 'what' is being tested elsewhere, just make sure you're sending something
    callback.objects[0].image.should.eql({src: "background.jpg"});
  });

  it("calls the complete callback after all images and sounds are loaded", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject_1" : {
          "image" : {
            "src" : "background.jpg"
          }
        },
        "gameObject_2" : {
          "sound" : {
            "src" : "soundy.mp3"
          }
        }
      }
    };

    var imageCallback = sandbox.stub();
    level.addImageLoaderCallback(imageCallback);
    var gameSpec = level.createGameSpec(gameDescription, spiedJQuery, 'screen');
    
    var loadCallback = sandbox.stub();
    gameSpec.load("newLevel", loadCallback);
    
    spiedJQuery.returnValues[0].trigger('load');
    loadCallback.called.should.eql(false);

    spiedJQuery.returnValues[1].trigger('canplaythrough');
    loadCallback.called.should.eql(true);
  });
});
