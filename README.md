# grunt-dancer

> Use grunt to control your Perl Dancer's development server, and live-reload with grunt-contrib-watch! 


## The "dancer" task

### Overview
####dancer:start (the default dancer task)
Launches the server and leaves it running even when the parent process is no longer running.

####dancer:stop --or-- dancer:kill
Terminates an already running server.

###Options
The `dancer` task should be configured with the following options:

| Name | Type | Default  | Description                                               |
| -----| ---- | -------- | ----------------------------------------------------------|
| pidFile | `string` | `'/tmp/dancerServer.pid'` | Path to the pid file. (REQUIRED) |
| debug | `boolean` | `false` | Extra logging output (OPTIONAL)                      |
| args | `array` | `[]` | Additional arguments to add to the dancer command, supplied as an array of strings. (OPTIONAL) |



### Getting Started
In the shell...
```shell
npm install grunt-dancer
```

Load it by adding this to Gruntfile.js:

```js
grunt.loadNpmTasks('grunt-dancer');
```
Then add `dancer` to the taskList object passed into `grunt.registerTask` in Gruntfile.js.
(example:)
```js
	grunt.registerTask('default', [
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
$ mocha test/test.js
```

##With grunt-contrib-watch:

You can use this plugin with watch. This is awesome because it enables you to live-reload the dancer server when you make changes to server files (or really, any files that you specify). Here's an example of my watch config:

```   
    watch: {
      dancer: {
        options: {
          spawn : false, // IMPORTANT. will not work without this setting.
        },
        files: [
          '/bin/app.pl'
        ],
        tasks: ['dancer'] 
      }
    },
 
//...
  grunt.registerTask('default', ['dancer', 'watch']);
```
The dancer task knows if watch is running, and on interrupt will kill the dancer server along with it.

