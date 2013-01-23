describe("SpriteSheet", function() {
  var SpriteSheet = require('../src/sprite_sheet'),
      sandbox = require('sinon').sandbox.create(),
      assert = require('assert'),
      Canvas = require('canvas'),
      context = new Canvas().getContext('2d');

  afterEach(function() {
    sandbox.restore();
  });

  it("is initialized with an asset and location", function() {
    var sheet = SpriteSheet({asset: "asset", 
                             location: {x: 1, y:2}
    });

    assert.equal(1, sheet.location.x); 
    assert.equal(2, sheet.location.y); 
    assert.equal("asset", sheet.asset); 
  });

  it("has an optional name", function() {
    var sheet = SpriteSheet({asset: "asset", 
                             location: {x: 1, y:2}
    }, "spriteSheet");

    assert.equal("spriteSheet", sheet.name); 
  });

  it("draws its first sheet", function() {
    var sheet = SpriteSheet({ asset: 'asset',
                              location: {x: 100, y:200},
                              map: [ {
                                 x: 1, 
                                 y:2, 
                                 width: 10, 
                                 height: 12
                               } ]
                             });
    var contextSpy = sandbox.stub(context, "drawImage");

    sheet.draw(context);

    assert.ok(contextSpy.calledWith('asset', 1, 2, 10, 12, 100, 200, 10, 12));
  });

  it("draws a particular index in the sheet", function() {
    var sheet = SpriteSheet({asset: "asset", 
                             location: {x: 100, y:200},
                             map: [ {}, // Note theres a first entry
                               {
                                 x: 1, 
                                 y:2, 
                                 width: 10, 
                                 height: 12
                               } ]
                             });
    var contextSpy = sandbox.stub(context, "drawImage");

    sheet.index = 1;
    sheet.draw(context);

    assert.ok(contextSpy.calledWith('asset', 1, 2, 10, 12, 100, 200, 10, 12));
  });

  it("gets its right based on the current entry in the map", function() {
    var sheet = SpriteSheet({ location: {x: 100},
                              map: [ {}, // Note theres a first entry
                                    { width: 10 } ]
                             });

    sheet.index = 1;

    assert.equal(110, sheet.right());
  });

  it("gets its left based on the location", function() {
    var sheet = SpriteSheet({ location: {x: 100},
                              map: [ {} ]                             
    });

    sheet.index = 1;

    assert.equal(100, sheet.left());
  });

  it("gets its top based on location", function() {
    var sheet = SpriteSheet({ location: { y:200 },
                              map: [ {} ] });

    sheet.index = 1;

    assert.equal(200, sheet.top());
  });

  it("gets its bottom based on location plus height", function() {
    var sheet = SpriteSheet({ location: { y:200 },
                              map: [ {},
                                {
                                  height: 20
                                }] });

    sheet.index = 1;

    assert.equal(220, sheet.bottom());
  });

  it("has intersection based on the current map", function() {
    var sheet = SpriteSheet({ location: { x: 10, y:200 },
                              map: [ {},
                              {
                                width: 10,
                                height: 20
                              }] });

    sheet.index = 1;

    var intersectingRect = { 
      left: sandbox.stub().returns(11),
      top: sandbox.stub().returns(201),
      right: sandbox.stub().returns(22),
      bottom: sandbox.stub().returns(222)
    };

    var nonIntersectingRect = { 
      left: sandbox.stub().returns(22),
      top: sandbox.stub().returns(221),
      right: sandbox.stub().returns(24),
      bottom: sandbox.stub().returns(222)
    };

    assert.ok(sheet.intersects(intersectingRect));
    assert.ifError(sheet.intersects(nonIntersectingRect));
  });

  it("provides a height and width based on index", function() {
    var sheet = SpriteSheet({ location: { x: 10, y:200 },
                              map: [ {},
                              {
                                width: 10,
                                height: 20
                              }] });

    sheet.index = 1;
    
    assert.equal(sheet.width(), 10);
    assert.equal(sheet.height(), 20);
  });

});
