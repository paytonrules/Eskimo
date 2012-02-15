describe("Eskimo.ObjectPipeLine.DisplayVisibleObjects", function() {
  var Screen = require('../../src/screen'),
      $ = require('jquery'),
      Canvas = require('canvas'),
      should = require('should');
                
  it("puts any visible objects on the screen", function() {
    var screen = new Screen($(new Canvas())),
        ObjectPipeline = require('../../src/object_pipeline/display_visible_objects.js');

    var gameObjects = {
      object_1: {
        asset: "asset",
        visible: true
      }
    };

    ObjectPipeline.displayVisibleObjects(screen, gameObjects);

    var image = screen.findObjectNamed('object_1');
    image.name.should.equal('object_1');
    should.exist(image.draw);
  });
});

