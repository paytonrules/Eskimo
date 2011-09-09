

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

});
