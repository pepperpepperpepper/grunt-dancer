'use strict';

var spawn = require('child_process').spawn,
       fs = require('fs'),
   mkdirp = require('mkdirp'),
     path = require('path');

var _currentProcess;
var pid;

module.exports.pid = function(){ return pid };

module.exports.start = function(options) {
  _currentProcess = spawn('perl', [options.app_path].concat(options.args), {
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

module.exports.kill = function(options){
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
