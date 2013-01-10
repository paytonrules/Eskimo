describe("Eskimo.ObjectPipeLine.DisplayVisibleObjects", function() {
  var Screen = require('../../src/screen'),
      $ = require('jquery'),
      Canvas = require('canvas'),
      assert = require('assert'),
      Sprite = require('../../src/sprite'),
      screen,
      ObjectPipeline;

  beforeEach(function() {
    screen = new Screen($(new Canvas()));
    ObjectPipeline = require('../../src/object_pipeline/display_visible_objects.js');
  });
                
  it("puts any visible objects on the screen", function() {
    var gameObjects = {
      object_1:  Sprite("object_1", {
        asset: "asset",
        visible: true
      })
    };

    ObjectPipeline.displayVisibleObjects(screen, gameObjects);

    var image = screen.findObjectNamed('object_1');
   
    assert.equal(image.name, 'object_1');
    assert.ok(image.draw);
  });

  it("only puts them if they are visibile (duh)", function() {
    var gameObjects = {
      object_1: {
        asset: "asset",
      }
    };

    ObjectPipeline.displayVisibleObjects(screen, gameObjects);

    var image = screen.findObjectNamed('object_1');
    assert.ifError(image);
  });

});
