function sh(command) {
  var sys = require('sys')
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) { sys.puts(stdout); }
  exec(command, puts);
}

desc('Run Specs')
task("spec", function() {
  sh('jessie spec');
});

desc("Install dependencies")
task("dependencies", function() {
  sh('npm install glob');
  sh('npm install html5');
  sh('npm install mocha -g');
  sh('npm install jquery');
  sh('npm install jsdom');
  sh('npm install underscore');
});

desc('Build the project')
task("build", function() {
  var glob = require('glob');
  var _ = require('underscore'); 
  var files = glob.globSync("./src/*.js");

  command_string = "java -jar compiler.jar --js=node_modules/underscore/underscore-min.js";
  command_string += " --js=./src/main.js"; // Main needs to come first

  files = _.reject(files, function(fileName) { return fileName.indexOf("main.js") != -1 } );
  _(files).each(function(file) {
    command_string += " --js=" + file;
  });
  command_string += " --create_source_map=eskimo.map";
  command_string += " --js_output_file=eskimo.min.js";
  console.log(command_string);

  sh(command_string);
});
