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
  }

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
          "image" : {
            "src" : "background.jpg"
          }
        }
      }
    };

    level.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');

    imageAssets = level.images();

    imageAssets.get("gameObject").src.should.equal('background.jpg');
  });

  it("creates a jukebox from the sounds on the objects in the level", function() {
    var jukebox;
    level.levels = {
      "newLevel": {
        "gameObject" : {
          "sound": {
            "src": "sound.mp3"
          }
        }
      }
    };

    level.load("newLevel");

    spiedJQuery.returnValues[0].trigger('canplaythrough');

    jukebox = level.getJukebox();

    jukebox.assets.get('gameObject').src.should.equal('sound.mp3');
  });

  it("removes the previous level images", function() {
    var imageAssets;
    level.levels = {
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

    level.load("levelOne");
    level.load("levelTwo");

    // Note we trigger load on the second created jquery object (levelTwo)
    spiedJQuery.returnValues[1].trigger('load');

    imageAssets = level.images();

    should.not.exist(imageAssets.get("gameObject_1"));
    imageAssets.get("gameObject_2").src.should.equal("christmasSong.png");
  });

  it("removes the previous levels sounds as well", function() {
    var soundAssets;

    level.levels = {
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

    level.load("levelOne");
    level.load("levelTwo");
    
    spiedJQuery.returnValues[1].trigger('canplaythrough');

    soundAssets = level.getJukebox().assets;

    should.not.exist(soundAssets.get("gameObject_1"));
    should.exist(soundAssets.get("gameObject_2"));
  });
    
  it("does not clear the previous level if the requested level doesn't exist", function() {
    var soundAssets, imageAssets;
    
    level.levels = {
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

    level.load("levelOne");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('canplaythrough');
    
    level.load("badLevel");

    soundAssets = level.getJukebox().assets;
    imageAssets = level.images();

    should.exist(soundAssets.get("gameObject_1"));
    should.exist(imageAssets.get("gameObject_2"));
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
    };
    level.load("levelOne");

    level.addGameObject("key", {"object_id" : 2});

    level.gameObject('key').object_id.should.eql(2);
  });

  it("makes a configurable callback when all the images on a level are loaded", function() {
    level.levels = {
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

    level.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');

    // 'what' is being tested elsewhere, just make sure you're sending something
    callback.objects[0].image.should.eql({src: "background.jpg"});
  });
});
