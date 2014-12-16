#!/usr/bin/env node 
var fs = require('fs');
var async = require('async');
var child_process = require('child_process');
var running = require("is-running");
var should = require("should");
var options = {//these match the Gruntfile
  pidFile : "/tmp/dancerServer.pid", 
  args : [],
  app_path : 'bin/app.pl', 
};
var pid, grunt_watch_pid;
describe("start dancer server", function(){
  this.timeout(10000);
  before(function(done){
    async.waterfall([
        function start_dancer(start_callback){
          child_process.exec('grunt dancer', { 'cwd' : './' }, function(err, stdout, stderr){
            start_callback(err, stdout, stderr);
          });
        },
        function check_errors(stdout, stderr){
          console.log(stdout, stderr);
          done();
        },
    ], function (err, result) {
         console.log(err);
         console.log(result);
       // result now equals 'done'    
    });
  });
  it("should start the server, and have an accessible pid file and pid", function(done){
    //code here
    async.waterfall([
        function read_pid(pid_callback){
          fs.readFile(options.pidFile, function(err, data){
            pid = parseInt(data.toString());
            running(pid).should.equal(true);
            pid_callback(null, pid);
            done();
          });
        },
      ], function (err, result) {
           console.log(err);
           console.log(result);
         // result now equals 'done'    
      });
   }); 
});
describe("kill dancer server", function(){
  this.timeout(10000);
  before(function(done){
    async.waterfall([
        function kill_dancer(kill_callback){
          child_process.exec('grunt dancer:kill', { 'cwd' : './' }, function(err, stdout, stderr){
            kill_callback(err, stdout, stderr);
          });
        },
        function check_errors(stdout, stderr, check_error_callback){
          console.log(stdout, stderr);
          done();
        },
    ], function (err, result) {
         console.log(err);
         console.log(result);
       // result now equals 'done'    
    });
  });
  it("should be killed", function(done){
    async.waterfall([
        function check_pid(){
          var retries = 3;
          var delay = 1000;
          (function testSync(){
            try { 
             var test = process.kill(pid, 0);
             if (test && retries){
               retries--;
               setTimeout(testSync, delay);
             }
             throw('Could not determine if dancer process was killed');
            }
            catch(err) { 
              (err.code).should.equal('ESRCH');
              return done();
            }
          })();
        },
      ], function (err, result) {
           console.log(err);
           console.log(result);
         // result now equals 'done'    
      });
  }); 
  it("should have no pid", function(done){
    async.waterfall([
        function test_pid_file(file_callback){
          fs.readFile(options.pidFile, function(err, data){
            (err.code).should.equal('ENOENT');
            return done();
          });
        },
     ], function (err, result) {
           console.log(err);
           console.log(result);
         // result now equals 'done'    
     });
   }); 
});

//ALMOST WORKING...FIX ME
//describe("start dancer with grunt watch", function(){
//  this.timeout(8000);
//  before(function(done){
//        var myproc = child_process.exec('grunt test-watch', { 'cwd' : '../', stdio: 'pipe', detached: true }, function(err, stdout, stderr){
//          console.log(err);
//        });
//        grunt_watch_pid = myproc.pid;
//        myproc.stderr.on('data', function(data){
//          console.log(data.toString());
//        });
//        myproc.stdout.on('data', function(data){
//          console.log(data.toString());
//          if(data.toString().match(/Dancer.*listening/)){
//            done();
//          }
//        });
//  });
//  it("should start the server, and have an accessible pid file and pid", function(done){
//    //code here
//    async.waterfall([
//        function read_pid(pid_callback){
//          fs.readFile(options.pidFile, function(err, data){
//            pid = parseInt(data.toString());
//            running(pid).should.equal(true);
//            pid_callback(null, pid);
//            done();
//          });
//        },
//      ], function (err, result) {
//           console.log(err);
//           console.log(result);
//         // result now equals 'done'    
//      });
//   }); 
//   it('should have a new pid, after restarting when the watched file is modified', function(done){
//    //code here
//    async.waterfall([
//        function read_data(read_callback){
//          fs.readFile(options.app_path, function(err, data){
//            var file_data = data.toString();
//            var modification = file_data + "#";
//            read_callback(null, modification);
//          });
//        },
//        function write_new(modification, write_callback){
//          console.log(modification);
//          fs.writeFile(options.app_path, modification, function(err){
//            setTimeout(function(){ write_callback(null); }, 2000 ); //wait for server to reset
//          });
//        },
//        function read_pid(pid_callback){
//          fs.readFile(options.pidFile, function(err, data){
//            var newpid = parseInt(data.toString());
//            running(newpid).should.equal(true);
//            pid_callback(null, newpid);
//          });
//        },
//        function compare_pids(newpid){
//          pid.should.not.equal(newpid);
//          pid = newpid; 
//          done();
//        }
//      ], function (err, result) {
//           console.log(err);
//           console.log(result);
//         // result now equals 'done'    
//      });
//   }); 
//});
//describe("kill grunt watch server on interrupt", function(){
//  this.timeout(8000);
//  before(function(done){
//    try { 
//      var test = process.kill(grunt_watch_pid, 'SIGINT');
//      setTimeout(done, 1500);
//    }
//    catch(err) { 
//      throw(err);
//    }
//  });
//  it("should be killed", function(done){
//    async.waterfall([
//        function check_pid(){
//          var retries = 3;
//          var delay = 1000;
//          (function testSync(){
//            try { 
//             var test = process.kill(pid, 0);
//             if (test && retries){
//               retries--;
//               setTimeout(testSync, delay);
//             }
//             throw('Could not determine if dancer process was killed');
//            }
//            catch(err) { 
//              (err.code).should.equal('ESRCH');
//              return done();
//            }
//          })();
//        },
//      ], function (err, result) {
//           console.log(err);
//           console.log(result);
//         // result now equals 'done'    
//      });
//  }); 
//  it("should have no pid", function(done){
//    async.waterfall([
//        function delay(delay_callback){
//          setTimeout(delay_callback, 1000);
//        },
//        function test_pid_file(){
//          fs.readFile(options.pidFile, function(err, data){
//            console.log(err, data);
//            (err.code).should.equal('ENOENT');
//            return done();
//          });
//        },
//     ], function (err, result) {
//           console.log(err);
//           console.log(result);
//         // result now equals 'done'    
//     });
//   }); 
//});
