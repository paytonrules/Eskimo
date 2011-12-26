describe("binding events", function() {
  var document,
      jquery,
      domCanvas = {getContext: function() {}}, 
      canvas = [domCanvas],
      events = require("../src/events"); 

  beforeEach(function() {
    var jsdom = require("jsdom").jsdom,
        emptyPage = jsdom("<html><head></head><body>hello world</body></html>"),
        window  = emptyPage.createWindow();

    document = window.document;
    jquery = require("jquery").create(window);
  });

  it("sends one DOCUMENT_EVENT to the game", function() {
    events.DOCUMENT_EVENTS = ['keydown'];
    var game = {
      keydown: function(event) {
        this.event = event;
      }
    };

    events.bind({game: game,
                 jquery: jquery,
                 document: document.documentElement,
                 canvas: canvas});

    jquery(document.documentElement).keydown();

    game.event.should.be.ok;
  });

  it("passes the correct event to the DOCUMENT EVENT", function() {
    events.DOCUMENT_EVENTS = ['keydown'];
    var game = {
      keydown: function(event) {
        this.key = event.which;
      }
    };

    events.bind({game: game,
                 jquery: jquery,
                 document: document.documentElement,
                 canvas: canvas});
    
    jquery(document.documentElement).trigger({type: 'keydown',
                                             which: 87});

    game.key.should.equal(87);
  });

  it("doesn't cause an error if the game doesn't have that event", function() {
    events.DOCUMENT_EVENTS = ['keydown'];

    events.bind({game: {},
                 jquery: jquery,
                 document: document.documentElement,
                 canvas: canvas});

    jquery(document.documentElement).keydown();
  });

  it("works with multiple events", function() {
    events.DOCUMENT_EVENTS = ['keydown', 'keyup'];
    var game = {
      keyup: function(event) {
        this.event = event;
      }
    };

    events.bind({game: game,
               jquery: jquery, 
             document: document,
               canvas: canvas}); 

    jquery(document.documentElement).keyup();

    game.event.should.be.ok;
  });

  it("sends CANVAS_EVENTS to the game", function() {
    events.CANVAS_EVENTS = ['mousedown'];
    var game = {
      mousedown: function(event) {
        this.mousedown = true;
      }
    };

    events.bind({game: game,
               jquery: jquery, 
               canvas: canvas,
             document: document});

    jquery(canvas).mousedown();

    game.mousedown.should.be.true;
  });

  it("does not throw an exception if the game hasn't defined the canvas event", function() {
    events.CANVAS_EVENTS = ['mousedown'];

    events.bind({game: {},
               jquery: jquery,
               canvas: canvas, 
             document: document});

    jquery(canvas).mousedown();
  });

  it("works with multiple CANVAS_EVENTS", function() {
    events.CANVAS_EVENTS = ['mousedown', 'mouseup'];

    var game = {
      mouseup: function(event) {
        this.mouseup = true;
      }
    };

    events.bind({game: game,
               jquery: jquery, 
               canvas: canvas,
             document: document});

    jquery(canvas).mouseup();

    game.mouseup.should.be.true;
  });

  it("normalizes CANVAS event locations to the canvas", function() {
    events.CANVAS_EVENTS = ['mouseup'];

    var game = {
      mouseup: function(location) {
        this.location = location;
      }
    };

    canvas.offset = function() {
      return {left: 10, top: 10};
    };

    events.bind({game: game,
               jquery: jquery,
               canvas: canvas,
             document: document});

    jquery(canvas).trigger({type: 'mouseup', 
                            pageX: 15,
                            pageY: 20});

    game.location.x.should.equal(5);
    game.location.y.should.equal(10);
  });
});
