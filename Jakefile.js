function sh(command) {
  var sys = require('util');
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) { sys.puts(stdout); }
  exec(command, puts);
}

desc('Run Specs');
task("spec", function() {
  sh('. run_specs');
});

desc("Install dependencies");
task("dependencies", function() {
  sh('npm install canvas html5 jquery jsdom mocha -g should sinon underscore');
});
