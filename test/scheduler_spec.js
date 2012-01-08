describe("Scheduler", function() {
  var counter,
      Scheduler = require("../src/scheduler");
  
  var CallCounterUpTo = function(maximum) {
    var calls = 0;
    var self = this;
    self.call = function() {
      calls += 1;

      if (calls === maximum) {
        self.scheduler.stop();
      }
    };

    self.completed = function() {
      return (calls === maximum);
    };

    self.getCalls = function() {
      return calls;
    };

    self.maximum = maximum;
  };
  
  beforeEach( function() {
    counter = new CallCounterUpTo(2);
  });

  it('schedules method called for repeated calls', function(done) {
    var scheduler = new Scheduler(100);
    counter.scheduler = scheduler;
    
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

  it('calls that method with the tick rate', function() {
    var framesPerSecond = 10;
    var scheduler = new Scheduler(framesPerSecond);
    counter.scheduler = scheduler;
    var startTime;

    startTime = (new Date()).getTime();

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
