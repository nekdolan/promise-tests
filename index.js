console.log('Node version: '+process.version);

// we use old version of monk-middleware-handle-callback via lock file
const monk = require('monk');
const async = require('async');
const db = monk('localhost:27017/db');
const collection = db.get('collection');

collection.find({}).then(function (err, result) {
  // gives warning: TypeError: Cannot read property 'test1' of undefined
  console.log(result.test1.test1);
});

collection.find({}, function (err, result) {
  // does not throw exception,
  // gives warning: TypeError: Cannot read property 'test2' of undefined
  console.log(result.test2.test2);
});

async.parallel({
  value: cb => collection.find({}, cb)
}, function (err, result) {
  // does not throw exception, gives incorrect warning: Callback was already called.
  console.log(result.test3.test3);
});

collection.find({}).then(function (err, result) {
  console.log(result.test4.test4);
}).catch(function (exception) {
  // gives warning TypeError: Cannot read property 'test4' of undefined
  throw exception;
});

try {
  collection.find({}).then(function (err, result) {
    console.log(result.test5.test5);
  }).catch(function (exception) {
    setTimeout(function () {
      // throws exception (unlike test4): TypeError: Cannot read property 'test5' of undefined
      // stacktrace points to correct line
      throw exception;
    });
  })
} catch (exception) {
  console.error(exception);
}

setTimeout(function() {
  process.exit();
}, 1000);
