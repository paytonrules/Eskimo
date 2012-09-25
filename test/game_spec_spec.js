describe("GameSpec", function() {
  var sandbox = require('sinon').sandbox.create(),
      GameSpec = require('../src/game_spec'),
      Assert = require('assert'),
      window,
      spiedJQuery;

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

  it("is created by default with real jquery", function() {
    var gameSpec = new GameSpec({assetDefinition: {},
                                screen: ""});

    Assert.equal(gameSpec.getJQuery(), require('jquery'));
  });

  it("loads no assets when the definition passed in is empty", function(done) {
    var gameSpec = new GameSpec({
      assetDefinition: {},
      screen: 'screen'
    });

    gameSpec.load("monkey", function(level) {
      Assert.equal(0, level.images().size());
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
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      jquery: spiedJQuery, 
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level) {
      imageAssets = level.images();

      Assert.equal('background.jpg', imageAssets.get("gameObject").src);
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
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      jquery: spiedJQuery, 
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level) {
      jukebox = level.getJukebox();

      Assert.equal('sound.mp3', jukebox.assets.get('gameObject').src);
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

    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      jquery: spiedJQuery, 
      screen: 'screen'
    });
    gameSpec.load("levelOne", function() {});

    gameSpec.load("levelTwo", function(level) {
      imageAssets = level.images();

      Assert.ok(!imageAssets.get("gameObject_1"));
      Assert.equal('christmasSong.png', imageAssets.get("gameObject_2").src);

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

    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      jquery: spiedJQuery, 
      screen: 'screen'
    });

    gameSpec.load("levelOne", function() {});
    gameSpec.load("levelTwo", function(level) {
      soundAssets = level.getJukebox().assets;

      Assert.ok(!soundAssets.get("gameObject_1"));
      Assert.ok(soundAssets.get("gameObject_2"));
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
     
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      jquery: spiedJQuery, 
      screen: 'screen'
    });

    gameSpec.load("levelOne", function(level) {
      Assert.equal(2, level.gameObject('gameObject').property);
      done();
    });

  });

  it("allows adding a game object at any time to the current level", function(done) {
    var gameDescription = {
      "levelOne" : {}
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      jquery: spiedJQuery, 
      screen: 'screen'
    });

    gameSpec.load("levelOne", function(level) {
      level.addGameObject("key", {"object_id" : 2});
      Assert.equal(2, level.gameObject('key').object_id);
      done();
    });
  });
  
  it("puts all the visibile images on the screen after loading", function(done) {
    var gameDescription = {
      "newLevel": {
        "gameObject_1" : {
          "image" : {
            "src" : "background.jpg"
          },
          "visible" : true
        },
        "gameObject_2" : {
          "image" : {
            "src" : "alsoBackground.jpg"
          },
          "visible" : true
        }
      }
    };

    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      jquery: spiedJQuery, 
      screen: 'screen'
    });

    var Pipeline = require("../src/object_pipeline/display_visible_objects");
    var displayStub = sandbox.stub(Pipeline, "displayVisibleObjects");

    gameSpec.load("newLevel", function(level) {
      var firstParam = displayStub.args[0][0]
      Assert.equal('screen', firstParam);

      var secondParam = displayStub.args[0][1];
      Assert.deepEqual(secondParam['gameObject_1'].image, {src: "background.jpg"});
      Assert.deepEqual(secondParam['gameObject_2'].image, {src: "alsoBackground.jpg"});

      done();
    });
    spiedJQuery.returnValues[0].trigger('load');
    spiedJQuery.returnValues[1].trigger('load');
  });
});
