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

  afterEach(function() {
    sandbox.restore();
  });

  it("loads no jukebox when the definition passed in is empty", function(done) {
    var gameSpec = new GameSpec({
      assetDefinition: {},
      screen: 'screen'
    });

    gameSpec.load("monkey", function(level) {
      Assert.equal(0, level.getJukebox().assets.size());
      done();
    });
  });

  it("adds image assets for any images in level", function() {
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
      var imageAsset = level.gameObject('gameObject');
      Assert.equal('background.jpg', imageAsset.asset.src);
    });
  });

  it("creates a jukebox from the sounds on the objects in the level", function() {
    addAudioTagToTheDOM();
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
      addAudioTagToTheDOM();
      var jukebox = level.getJukebox();

      Assert.equal('sound.mp3', jukebox.assets.get('gameObject').src);
    });
  });

  it("doesnt fire the complete callback until both asset loaders are finished", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject" : {
          "sound": {
            "src": "sound.mp3"
          }
        }
      }
    };

    var callback = sandbox.stub();
    var fakeImageLoader = {load: function() {}};
    var fakeSoundLoader = {load: function() {}};

    var TestAssetLoaderFactoryWithLongRunningTypes = {
      create: function(type, callback) {
        if (type === 'image') {
          fakeImageLoader.callback = callback;
          return fakeImageLoader;
        } else if (type === 'sound') {
          fakeSoundLoader.callback = callback;
          return fakeSoundLoader;
        }
      }
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactoryWithLongRunningTypes, 
      screen: 'screen'
    });

    gameSpec.load("newLevel", callback);
    Assert.ok(!callback.called);

    fakeImageLoader.callback({get: function() {}});
    Assert.ok(!callback.called);

    fakeSoundLoader.callback();
    Assert.ok(callback.called);
  });
  
  it("allows access to the game objects", function() {
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
    });

  });

  it("allows adding a game object at any time", function() {
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
    });
  });
  
  it("puts all the visible images on the screen after loading", function() {
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
    });
  });

  it("does not change the original game spec when the level game objects are modified", function() {
    var gameDescription = {
      "newLevel": {
        "gameObject_1" : { }
      }
    };
    
    var gameSpec = new GameSpec({
      assetDefinition: gameDescription, 
      assetLoaderFactory: TestAssetLoaderFactory,
      screen: 'screen'
    });

    gameSpec.load("newLevel", function(level) {
      var gameObject = level.gameObject("gameObject_1");
      gameObject.x = 2;
    });

    gameSpec.load("newLevel", function(level) {
      var gameObject = level.gameObject("gameObject_1");
      Assert.ifError(gameObject.x);
    });
  });
});
