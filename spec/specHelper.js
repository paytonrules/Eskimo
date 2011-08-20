var glob = require('glob');
var fs = require('fs');
files = fs.readFileSync(__dirname + "/../build.config", 'ascii').split('\n').filter(function(fileName) { return fileName.length > 0; });
files.forEach(function(fileName, index, array) {
  require(__dirname + "/../" + fileName);
});

Breakout.GameRecipie = {
};

_ = require('underscore');
exports.Game = global.Game;
exports.Breakout = global.Breakout;
