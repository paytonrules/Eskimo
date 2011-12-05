describe("Eskimo#UpdaterList", function() {
  var updater = {
    update: function() {}
  },
      Spies = require('./spies'),
      should = require('should');

  it("updates the updater it is created with", function() {
    var updaterSpy = Spies.spyOn(updater, "update");
    var updateList = new Eskimo.UpdaterList(updater);

    updateList.update();

    updaterSpy.wasCalled().should.be.true;
  });

  it("updates all updaters in its list", function() {
    var updaterSpy = Spies.spyOn(updater, "update");
    var updateList = new Eskimo.UpdaterList(updater);

    updateList.add(updater);

    updateList.update();

    updaterSpy.callCount().should.equal(2);
  });

  it("can be created with an empty list", function() {
    var updateList = new Eskimo.UpdaterList();

    updateList.size().should.equal(0);
  });

  it("can be created with any number of updaters", function() {
    var updateList = new Eskimo.UpdaterList('one', 'two');

    updateList.size().should.equal(2);
  });

  it("allows array like access", function() {
    var updateList = new Eskimo.UpdaterList('one', 'two');

    updateList.get(1).should.equal('two');
  });

});