# grunt-dancer

> Control your Perl Dancer server via Grunt

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

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
In your project's Gruntfile, add `dancer` to the taskList object passed into `grunt.registerTask`.
ie:

```js
	grunt.registerTask('local', [
		'concat',
		'uglify',
		'dancer',
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

You can use this plugin with watch. This is awesome because it enables the server to live reload when you make changes to server files (or any files that you specify). Here's an example of my watch config:

```   
    watch: {
      dancer: {
        options: {
          spawn : false, // IMPORTANT. will not work without this setting.
        },
        files: [
          'test/bin/app.pl'
        ],
        tasks: ['dancer'] 
      }
    },
 
//...
  grunt.registerTask('default', ['dancer', 'watch']);
```
The dancer task knows if watch is running, and on interrupt will kill the dancer server along with it.

