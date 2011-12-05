// Blatantly stolen Corey Haines, converted to be a module
function stub() {
  var spy;

  spy = spyOn.apply(null, arguments);
  spy.removeStub = spy.stopSpying;

  return spy;
}

function spyOn() {
  var obj, functionName, returnValue, 
      wasCalled, capturedArgs, originalFunction, 
      spy, fake;

  if(typeof arguments[0] === 'string') {
    obj = {};
    functionName = arguments[0];
    returnValue = arguments[1];
  }else{
    obj = arguments[0];
    functionName = arguments[1];
    returnValue = arguments[2];
  }

  function initialize() {
    wasCalled = false;
    capturedArgs = [];
    fake = null;
  }

  function passedArguments(index) {
    if(arguments.length === 0) {
      return capturedArgs;
    } else {
      return capturedArgs[index - 1];
    }
  }

  function spyFunction() { 
    capturedArgs = arguments;
    wasCalled = true;
    if (fake) {
      return fake(this, capturedArgs);
    }
    else {
      return returnValue;
    }
  }

  originalFunction = obj[functionName];

  function resetOriginalFunction() {
    obj[functionName] = originalFunction; 
  }

  function andCallFake(fn) {
    fake = fn;
  }

  obj[functionName] = spyFunction;

  spy = {
    wasCalled: function() {return wasCalled;},
    passedArguments: passedArguments,
    stopSpying: resetOriginalFunction,
    resetSpy: initialize,
    object: obj,
    spyFunction: spyFunction,
    andCallFake: andCallFake 
  };

  spy.resetSpy();
  return spy;
}

exports.stub = stub;
exports.spyOn = spyOn;

