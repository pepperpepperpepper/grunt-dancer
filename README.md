# grunt-dancer

> Control your Perl Dancer server via Grunt

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

<!--npm install grunt-dancer --save-dev -->
In the shell...
```shell
npm install grunt-dancer
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dancer');
```

## The "dancer" task

### Overview
####dancer:start (the default dancer task)
Launches the server and leaves it running even when the parent process is no longer running.

####dancer:kill
Terminates an already running server.

####dancer:watch
A special configuration of dancer:start to work with grunt-contrib-watch

###Options
pidFile

Type: `String`
Default: `'/tmp/dancerServer.pid'`

Path to the pid file in case you want to run the server by itself.

debug
Type: `boolean`
Default: `false`

Extra logging output.

args
Type: `array`
Default: []

Any additional arguments to add to the dancer command can be supplied as an array of strings.


### Getting Started
In your project's Gruntfile, add `dancer:serve` to the taskList object passed into `grunt.registerTask`.

```js
	grunt.registerTask('local', [
		'concat',
		'uglify',
		'sass',
		'autoprefixer',
		'cssmin',
		'assemble',
		'imagemin',
		'copy',
		'dancer',
		'open:chromium',
		'watch'
	]);
```

##Running tests
To run the test suite, first invoke the following command within the repo, installing the development dependencies:
```shell
$ npm install
```
Then run the tests:
```shell
$ make tests
```

##With grunt-contrib-watch:

You can use this plugin with watch, but instead of using the dancer:start and dancer:kill tasks, you have
to use dancer:watch. Here's an example of my watch config:

   
    watch: {
      dancer: {
        options: {
          spawn : false, // IMPORTANT. will not work without this setting.
        },
        files: [
          'test/bin/app.pl'
        ],
        tasks: ['dancer:watch'] //IMPORTANT. here you must specify dancer:watch
      }
    },
 
//...
  grunt.registerTask('default', ['dancer:start', 'watch']);

## Special thanks to 
https://github.com/vjustov for grunt-sinatra
## Release History
_(Nothing yet)_
