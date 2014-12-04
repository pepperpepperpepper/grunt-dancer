var should = require("should"),
    running = require("is-running"),
      dancer = require("../lib/dancer");

describe("grunt-dancer", function(){
  var args = [];
  var opts = {
    pidFile: "/tmp/dancerServer.pid"
  }

  it("should start the server", function(){
    //code here
    dancer.start(args, opts);
    running(dancer.pid()).should.equal(true);
  });

  it("should kill the server", function(){
    var pid = dancer.pid();
    running(pid).should.equal(true);
    dancer.kill(args, opts);
    setTimeout(function(){
      running(pid).should.equal(false);
    }, 500);
  });

  it("should restart a running server");
  it("should kill the server when the task finishes");

})
