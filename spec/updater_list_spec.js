describe("Eskimo#UpdaterList", function() {
  var updater = {
    update: function() {}
  };

  it("updates the updater it is created with", function() {
    spyOn(updater, "update");
    var updateList = new Eskimo.UpdaterList(updater);

    updateList.update();

    expect(updater.update).toHaveBeenCalled();
  });

  it("updates all updaters in its list", function() {
    spyOn(updater, "update");
    var updateList = new Eskimo.UpdaterList(updater);

    updateList.add(updater);

    updateList.update();

    expect(updater.update.callCount).toEqual(2);
  });

  it("can be created with an empty list", function() {
    var updateList = new Eskimo.UpdaterList();

    expect(updateList.size()).toEqual(0);
  });

  it("can be created with any number of updaters", function() {
    var updateList = new Eskimo.UpdaterList('one', 'two');

    expect(updateList.size()).toEqual(2);
  });

  it("allows array like access", function() {
    var updateList = new Eskimo.UpdaterList('one', 'two');

    expect(updateList.get(1)).toEqual('two');
  });

});
