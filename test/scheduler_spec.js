describe("Scheduler", function() {
  var Scheduler = require("../src/scheduler");
  
  var CallCounterUpTo = function(scheduler, maximum) {
    var calls = 0;
    this.call = function() {
      calls += 1;

      if (calls === maximum) {
        scheduler.stop();
      }
    };

    this.completed = function() {
      return (calls === maximum);
    };
  };
  
  it('schedules method called for repeated calls', function(done) {
    var scheduler = new Scheduler(100);
    var counter = new CallCounterUpTo(scheduler, 2);
    
    scheduler.start(function() {
      counter.call();
      if (counter.completed()) {
        done();
      }
    });
  });

  it('clears the interval when stop is called', function() {
    var TestInterval = {
      clearInterval: function() {this.cleared = true;}
    };
    var scheduler = new Scheduler(100);
    scheduler.setIntervalWrapper(TestInterval);

    scheduler.stop();

    TestInterval.cleared.should.be.true;
  });

  it('calls that method with the tick rate', function(done) {
    var framesPerSecond = 10;
    var scheduler = new Scheduler(framesPerSecond);
    var counter = new CallCounterUpTo(scheduler, 2);

    var startTime = (new Date()).getTime();

    scheduler.start(function() {
      counter.call();
      if (counter.completed()) {
        var doneTime = (new Date().getTime());
        (doneTime - startTime).should.be.within(199, 220);
        done();
      }
    });
  });

  it('returns the time for tics', function() {
    var scheduler = new Scheduler(100);

    scheduler.getTicks().should.equal((new Date()).getTime());
  });

  it('returns its tick time', function() {
    var scheduler = new Scheduler(23);

    scheduler.getTickTime().should.equal(1000 / 23);
  });
});
