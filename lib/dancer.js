'use strict';

var spawn = require('child_process').spawn,
       fs = require('fs'),
   mkdirp = require('mkdirp'),
     path = require('path');

var _currentProcess;
var pid;

module.exports.pid = function(){ return pid };
module.exports.serve = function(args, options){
  options = options || { pidFile : "/tmp/dancerServer.pid" };
  args = args || [];
  _currentProcess = spawn('perl', ['bin/app.pl'].concat(args), {
    cwd: options.cwd || process.cwd(),
//    stdio: 'ignore'//['ignore', process.stdout, 'ignore']
  });
  _currentProcess.stdout.pipe(process.stdout)
  _currentProcess.stderr.pipe(process.stderr)
  pid = _currentProcess.pid;
  console.log("Dancer server started. PID: " + pid );

  process.on('exit', function() {
    _currentProcess.kill();
  });
};

module.exports.start = function(args, options) {
  options = options || { pidFile : "/tmp/dancerServer.pid" };
  args = args || [];
  _currentProcess = spawn('perl', ['bin/app.pl'].concat(args), {
    cwd: options.cwd || process.cwd(),
//    stdio: 'ignore'//['ignore', process.stdout, 'ignore']
  });
  _currentProcess.stdout.pipe(process.stdout)
  _currentProcess.stderr.pipe(process.stderr)
  pid = _currentProcess.pid;
  mkdirp(path.dirname(options.pidFile), function (err){
    if(err){ 
      throw("Could not create pidfile "+err) 
    }
  });
  fs.writeFileSync(options.pidFile, pid);
  console.log("Dancer server started. PID: " + pid );
};

module.exports.kill = function(args, options){
  if(!_currentProcess) {
    var _pidFile = options.pidFile;
    if(fs.existsSync(_pidFile)) {
      pid = fs.readFileSync(_pidFile);
    }
  }
  console.log("Killing the process: " + pid);
  process.kill(pid, 'SIGKILL');
  pid = undefined;
  fs.unlinkSync(options.pidFile);
};
