'use strict';
var fs = require('fs');

module.exports = function(grunt) {

  var spawn = require('child_process').spawn,
      dancer = require('../lib/dancer');

  grunt.registerTask('dancer', 'Control your dancer server via Grunt', function(command) {

//    command = command || 'start';
    //defaults
    var options = this.options({
      pidFile : "/tmp/dancerServer.pid",
      args : [],
      app_path : 'bin/app.pl', 
      debug : true,
    });

    if (command === 'watch'){
        process.on('SIGINT', function(){
          dancer.kill(grunt, options, function(){
            //needs to remove pid
            process.exit(); 
          });
        });
        process._watch = true;
        var done = this.async();
        process.once('exit', done);
        dancer.kill(grunt, options, function(){
          dancer.start(grunt, options, function(){});
        });
    }else if(command === 'start'){    
        var done = this.async();
        dancer.start(grunt, options, done);
    }else if (command === 'kill' || command === 'exit'){
        var done = this.async();
        dancer.kill(grunt, options, done);
    }
  })
}
