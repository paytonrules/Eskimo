describe("GameSpec", function() {
  var sandbox = require('sinon').sandbox.create(),
      GameSpec = require('../src/game_spec'),
      Assert = require('assert'),
      TestAssetLoaderFactory = require('../src/test_helpers/test_asset_loader_factory'),
      window;

  function addAudioTagToTheDOM() {
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
  }

  beforeEach(function() {
    addAudioTagToTheDOM();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("loads no assets when the definition passed in is empty", function(done) {
    var gameSpec = new GameSpec({
      assetDefinition: {},
      screen: 'screen'
    });

    gameSpec.load("monkey", function(level) {
      Assert.equal(0, level.images().size());
      Assert.equal(0, level.getJukebox().assets.size());
      done();
    });
  });

  it("adds image assets for any images in level", function(done) {
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
      assetLoaderFactory: TestAssetLoaderFactory,
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level) {
      var imageAssets = level.images();

      Assert.equal('background.jpg', imageAssets.get('gameObject').src);
      done();
    });
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
      assetLoaderFactory: TestAssetLoaderFactory, 
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level) {
      jukebox = level.getJukebox();

      Assert.equal('sound.mp3', jukebox.assets.get('gameObject').src);
      done();
    });
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
      assetLoaderFactory: TestAssetLoaderFactory, 
      screen: 'screen'
    });

    gameSpec.load("levelOne", function(level) {
      Assert.equal(2, level.gameObject('gameObject').property);
      done();
    });

  });

  it("allows adding a game object at any time", function(done) {
    var gameDescription = {
      "levelOne" : {}
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory, 
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
      assetLoaderFactory: TestAssetLoaderFactory,
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
  });
});
