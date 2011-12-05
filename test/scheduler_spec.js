describe("Eskimo#scheduler", function() {
  var Eskimo, 
      counter;
  
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
    Eskimo = require('./spec_helper').Eskimo;
    counter = new CallCounterUpTo(2);
  });

  it('schedules method called for repeated calls', function(done) {
    var scheduler = new Eskimo.Scheduler(100);
    counter.scheduler = scheduler;
    
    scheduler.start(function() {
      counter.call();
      if (counter.completed()) {
        done();
      }
    });
  });

  it('calls that method with the tick rate', function() {
    var framesPerSecond = 10;
    var scheduler = new Eskimo.Scheduler(framesPerSecond);
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
/*
  it('stops calling after ...it stops', function(done) {
    var scheduler = new Eskimo.Scheduler(100);
    counter.scheduler = scheduler;

    scheduler.start(counter.call);

    setTimeout(function() {
      counter.getCalls().should.equal(2);
      done();
    }, 200);

  });
  */

  it('returns the time for tics', function() {
    var scheduler = new Eskimo.Scheduler(100);

    scheduler.getTicks().should.equal((new Date()).getTime());
  });

  it('returns its tick time', function() {
    var scheduler = new Eskimo.Scheduler(23);

    scheduler.getTickTime().should.equal(1000 / 23);
  });
});
