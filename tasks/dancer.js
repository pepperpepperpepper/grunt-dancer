'use strict';
var fs = require('fs');

module.exports = function(grunt) {

  var spawn = require('child_process').spawn,
      dancer = require('../lib/dancer');

  grunt.event.once('watch',function(){
    process._dancer_session = true;
  });
  grunt.registerTask('dancer', 'Control your dancer server via Grunt', function(command) {

    command = command || 'start';
    //defaults
    var options = this.options({
      pidFile : "/tmp/dancerServer.pid",
      args : [],
      app_path : 'bin/app.pl', 
      debug : false,
    });

    if (command === 'start'){
        if( process._dancer_session){
          process.on('SIGINT', function(){
            dancer.kill(grunt, options, function(){
              process.exit(); 
            });
          });
          process._dancer_session = true;
          var done = this.async();
          process.once('exit', done);
          dancer.kill(grunt, options, function(){
            dancer.start(grunt, options, function(){});
          });
        }else{
          var done = this.async();
          dancer.start(grunt, options, done);
        }
    }else if (command === 'kill' || command === 'exit' || command == 'stop'){
        var done = this.async();
        dancer.kill(grunt, options, done);
    }
  })
}
