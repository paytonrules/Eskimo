describe("GameSpecification", function() {
  var should = require('should'),
      GameSpec = require('../src/game_specification'),
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
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("creates the gameSpec", function() {
    var gameSpec = GameSpec.createGameSpec({}, spiedJQuery, 'screen');

    should.exist(gameSpec);
  });

  it("loads no assets when the definition passed in is empty", function(done) {
    var gameSpec = GameSpec.createGameSpec({}, spiedJQuery, 'screen');

    gameSpec.load("monkey", function(level) {
      level.images().size().should.equal(0);
      done();
    });

  });

  it("creates image assets for any images on the objects in the game specification", function(done) {
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
    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');
   
    gameSpec.load("newLevel", function(level) {
      imageAssets = level.images();

      imageAssets.get("gameObject").src.should.equal('background.jpg');
      done();
    });

    spiedJQuery.returnValues[0].trigger('load');
  });

  it("creates a jukebox from the sounds on the objects in the level", function(done) {
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
    
    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');

    gameSpec.load("newLevel", function(level) {
      jukebox = level.getJukebox();

      jukebox.assets.get('gameObject').src.should.equal('sound.mp3');
      done();
    });

    spiedJQuery.returnValues[0].trigger('canplaythrough');
  });

  // Soon this test becomes obsolete
  it("removes the previous level images", function(done) {
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

    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');
    gameSpec.load("levelOne", function() {});
    gameSpec.load("levelTwo", function(level) {
      imageAssets = level.images();

      should.not.exist(imageAssets.get("gameObject_1"));
      imageAssets.get("gameObject_2").src.should.equal("christmasSong.png");

      done();
    });

    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');
  });

  it("removes the previous levels sounds as well", function(done) {
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

    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');
    gameSpec.load("levelOne", function() {});
    gameSpec.load("levelTwo", function(level) {
      soundAssets = level.getJukebox().assets;

      should.not.exist(soundAssets.get("gameObject_1"));
      should.exist(soundAssets.get("gameObject_2"));
      done();
    });
    
    spiedJQuery.returnValues[0].trigger('canplaythrough');
    spiedJQuery.returnValues[1].trigger('canplaythrough');
  });
   
  it("allows access to the game objects", function(done) {
    var gameDescription = {
      "levelOne": {
        "gameObject" : {
          "property" : 2
        }
      }
    };
     
    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');
    gameSpec.load("levelOne", function(level) {
      level.gameObject('gameObject').property.should.equal(2);
      done();
    });

  });

  it("allows adding a game object at any time to the current level", function(done) {
    var gameDescription = {
      "levelOne" : {}
    };
    
    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');
    gameSpec.load("levelOne", function(level) {
      level.addGameObject("key", {"object_id" : 2});
      level.gameObject('key').object_id.should.eql(2);
      done();
    });

  });

  it("makes a configurable callback when all the images on a level are loaded", function() {
    // This test becomes "you added everything to the screen"
/*    var gameDescription = {
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
    GameSpec.addImageLoaderCallback(callback);
    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');

    gameSpec.load("newLevel");
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');

    // 'what' is being tested elsewhere, just make sure you're sending something
    callback.objects[0].image.should.eql({src: "background.jpg"});*/
  });

  it("calls the complete callback after all images and sounds are loaded", function() {
    // This test is "You draw the pictures after the load"
/*    var gameDescription = {
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
    GameSpec.addImageLoaderCallback(imageCallback);
    var gameSpec = GameSpec.createGameSpec(gameDescription, spiedJQuery, 'screen');
    
    var loadCallback = sandbox.stub();
    gameSpec.load("newLevel", loadCallback);
    
    spiedJQuery.returnValues[0].trigger('load');
    loadCallback.called.should.eql(false);

    spiedJQuery.returnValues[1].trigger('canplaythrough');
    loadCallback.called.should.eql(true);
    */
  });
});
