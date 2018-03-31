Promise.prototype.then = (function () {
  const then = Promise.prototype.then;
  const fixCall = function(promise, next, error){
    return function (val) {
      try {
        return next.call(promise, val);
      } catch (exception) {
        setTimeout(function () {
          if (error) {
            error(exception);
          } else {
            throw(exception);
          }
        }, 0);
        return new Promise(()=>{});
      }
    }
  };
  return function (success, fail, error) {
    return then.call(this, fixCall(this, success, error), fixCall(this, fail, error));
  }
}());

new Promise((resolve) => resolve('ok'))
  .then((val) => Promise.reject(val))
  .then(null, (val) => {
    console.log('value rejected: ' + val);
    throw new Error('lol');
  }, (error) => {
    console.log(error)
  })
  .then(() => console.log('not called'));