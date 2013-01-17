describe("Eskimo.ObjectPipeLine.DisplayVisibleObjects", function() {
  var Screen = require('../../src/screen'),
      $ = require('jquery'),
      Canvas = require('canvas'),
      assert = require('assert'),
      Sprite = require('../../src/sprite'),
      screen,
      Level = require('../../src/level'),
      ObjectPipeline;

  beforeEach(function() {
    screen = new Screen($(new Canvas()));
    ObjectPipeline = require('../../src/object_pipeline/display_visible_objects.js');
  });
                
  it("puts any visible objects on the screen", function() {
    var levelSpec = {
      "object_1" : {
        "image" : {
          asset: "asset",
          src: 'fake',
          visible: true
        }
      },
      "object_2" : {
        "image" : {
          asset: "asset",
          src: 'also fake',
          visible: true
        }
      }
    };
    var level = new Level();
    level.addGameObject("object_1", Sprite("object_1", levelSpec['object_1']['image']));
    level.addGameObject("object_2", Sprite("object_2", levelSpec['object_2']['image']));

    ObjectPipeline.displayVisibleObjects(screen, levelSpec, level);

    var image = screen.findObjectNamed('object_1');
    assert.equal(image.src, 'fake');
    
    var second_image = screen.findObjectNamed('object_2');
    assert.equal(second_image.src, 'also fake');
  });

  it("only puts them if they are visibile (duh)", function() {
    var levelSpec = {
      'object_1' : {
        'image' : {
          asset: 'asset'
        }
      },
      'object_2' : {
        'image' : {
          visible: true
        }
      }
    };
    var level = new Level();
    level.addGameObject('object_1', Sprite('object_1', levelSpec['object_1']['image']));
    level.addGameObject('object_2', Sprite('object_2', levelSpec['object_2']['image']));

    ObjectPipeline.displayVisibleObjects(screen, levelSpec, level);

    assert.ifError(screen.findObjectNamed('object_1'));
    assert.ok(screen.findObjectNamed('object_2'));
  });
});
