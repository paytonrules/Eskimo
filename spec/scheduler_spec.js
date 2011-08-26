describe("Eskimo#scheduler", function() {
  var Eskimo, counter;
  
  var CallCounterUpTo = function(maximum) {
    var calls = 0;
    var self = this;
    this.call = function() {
      calls += 1;

      if (calls === maximum) {
        self.scheduler.stop();
      }

    };

    this.completed = function() {
      return (calls === maximum);
    };

    this.getCalls = function() {
      return calls;
    };
  };
  
  beforeEach( function() {
    Eskimo = require('specHelper').Eskimo;
    counter = new CallCounterUpTo(2);
  });

  it('schedules method called for repeated calls', function() {
    var scheduler = new Eskimo.Scheduler(100);
    counter.scheduler = scheduler;
    
    scheduler.start(counter.call);

    waitsFor(function() {
      return (counter.completed());
    }, "Calls never complete", 1001);
  });

  it('calls that method with the tick rate', function() {
    var framesPerSecond = 10;
    var scheduler = new Eskimo.Scheduler(framesPerSecond);
    counter.scheduler = scheduler;
    var startTime;

    startTime = (new Date()).getTime();

    scheduler.start(counter.call);

    waitsFor(function() {
      return (counter.completed());
    }, "Calls never complete", 1001);

    runs(function() {
      var doneTime = (new Date()).getTime();
      expect(doneTime - startTime).toBeGreaterThan(199);
      expect(doneTime - startTime).toBeLessThan(220); // This should be able to be around 200 - 203 - something isn't right
    });
  });

  it('stops calling after ...it stops', function() {
    var scheduler = new Eskimo.Scheduler(100);
    counter.scheduler = scheduler;

    scheduler.start(counter.call);

    waitsFor(function() {
      return (counter.completed());
    }, "Calls didn't complete", 100);

    waits(15);

    runs(function() {
      expect(counter.getCalls()).toEqual(2);
    });
  });

  it('returns the time for tics', function() {
    var scheduler = new Eskimo.Scheduler(100);

    expect(scheduler.getTicks()).toEqual((new Date()).getTime());
  });

  it('returns its tick time', function() {
    var scheduler = new Eskimo.Scheduler(23);

    expect(scheduler.getTickTime()).toEqual(1000 / 23);
  });
});
