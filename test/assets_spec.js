describe("Assets", function() {
  var should = require('should'),
      sinon = require('sinon'),
      sandbox = sinon.sandbox.create(),
      Assets = require("../src/assets"),
      jquerySpy,
      assets,
      window;

  function prepareHTML5() {
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

    jquerySpy = sandbox.spy(window, 'jQuery');
  }

  beforeEach(function() {
    prepareHTML5();

    assets = new Assets({jquery: window.jQuery, 
                         tag: 'img',
                         loadEvent: 'loadEvent'});
  });

  afterEach(function() {
    sandbox.restore();
  });
  
  it("doesn't have an asset if it hasn't been loaded yet by the user", function() {
    should.not.exist(assets.get('key'));
  });

  it("doesn't get the asset if the image hasn't been loaded into the DOM", function() {
    assets.load('key', 'src');

    should.not.exist(assets.get('key'));
  });

  it("can get the asset after it's loadevent is triggered", function() {
    assets.load('key', 'src');
    jquerySpy.returnValues[0].trigger('loadEvent');

    var asset = assets.get('key');

    asset.should.be.ok;
  });

  it("sets up the asset with the passed in source", function() {
    assets.load('key', 'src');
    jquerySpy.returnValues[0].trigger('loadEvent');

    var asset = assets.get('key');

    asset.src.should.equal('src');
  });

  it("gives the asset the tag passed into the constructor", function() {
    assets.load('key', 'src');
    jquerySpy.returnValues[0].trigger('loadEvent');

    var asset = assets.get('key');

    asset.tagName.should.equal('IMG');
  });

  it("raises an exception if there is already an asset with that key", function() {
    assets.load('key', 'src');

    try {
      assets.load('key', 'error');
      should.fail("Should have thrown an exception, but didn't");
    } catch (err) {
      err.should.eql({name: "Eskimo.AssetAlreadyExists",
                      message:"Asset 'error' already exists"});
    }
  });
});
