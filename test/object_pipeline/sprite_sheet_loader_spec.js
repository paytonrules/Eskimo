describe("SpriteSheetLoader", function() {
  var SpriteSheetLoader = require('../../src/object_pipeline/sprite_sheet_loader'),
      sinon = require('sinon'),
      sandbox = sinon.sandbox.create(),
      assert = require('assert'),
      TestAssetLoader = require('../../src/test_helpers/test_asset_loader');

  beforeEach(function() {
    sandbox.restore();
  });

  it("callsback with a spritesheet, with the right object", function() {
    var spriteSheetLoader = SpriteSheetLoader.create(TestAssetLoader),
        loadingComplete = sandbox.stub(),
        isSpriteSheet = sinon.match(function(object) {
          return object.location.x == '1' && 
                 object.name === "SpriteSheet" && 
                 object.index === 0;
        }),
        levelSpec = {
          'SpriteSheet' : {
            sprite_sheet: {
              location: {x: '1'}
            }
          }
        };

    spriteSheetLoader.load(levelSpec, "SpriteSheet", null, loadingComplete);

    assert.ok(loadingComplete.calledWith('SpriteSheet', isSpriteSheet));
  });
});
