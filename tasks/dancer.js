'use strict';
var fs = require('fs');

module.exports = function(grunt) {

  var spawn = require('child_process').spawn,
      dancer = require('../lib/dancer');

//    {{{ old news
//    grunt.event.once('test',function(){
//      process._test = true;
//    });
//  grunt.event.once('watch',function(){
//    process._watch = true;
//  });
//  }}}
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
        process._watch = true;
        var done = this.async();
        dancer.kill(grunt, options, function(){
          console.log("calling our boy");
          dancer.start(grunt, options, function(){});
        });
    }else if(command === 'start'){    
        console.log('calling start guys');
        var done = this.async();
        dancer.start(grunt, options, done);
    }else if (command === 'kill'){
        var done = this.async();
        dancer.kill(grunt, options, done);
    }
  })
}
