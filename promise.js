new Promise((resolve) => resolve(1))
  .then(() => {throw(2)})
  .then(null, () => Promise.resolve(3))
  .catch((e) => console.log('Does not get called after exception'))
  .then(() => console.log('Gets called after catch'));

Promise.prototype.then = (function () {
  const then = Promise.prototype.then;
  const fixCall = function(promise, next){
    if (!next) {
      return null;
    }
    return function (val) {
      try {
        let newPromise = next.call(promise, val);
        if(newPromise){
          newPromise.error = promise.error;
        }
        return newPromise;
      } catch (exception) {
        setTimeout(function () {
          if (promise.error) {
            promise.error(exception);
          } else {
            throw(exception);
          }
        }, 0);
        return new Promise(()=>{});
      }
    }
  };
  return function (success, fail, error) {
    let promise = then.call(this, fixCall(this, success), fixCall(this, fail));
    promise.error = this.error;
    return promise;
  }
}());

function createPromise(init, error){
  let promise = new Promise(init);
  promise.error = error;
  return promise;
}

createPromise((resolve) => resolve(), (e) => console.warn('Error caught'))
  .then(() => 5)
  .then(() => {throw new Error('error')});

createPromise((resolve) => resolve('value'))
  .then((val) => Promise.reject(val))
  .then(null, (val) => {
    console.log('Value rejected: ' + val);
    throw new Error('Will throw exception');
  })
  .then(() => console.log('Not called'));


// new Promise((resolve) => resolve(1))
//   .then(() => {throw(2)})
//   .then(null, () => Promise.resolve(3))
//   .catch((e) => console.log('does not get called'))
//   .then(() => console.log('gets called'));
