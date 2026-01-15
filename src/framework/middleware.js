export function compose(middlewares) {
  return function (req, res) {
    let index = -1;
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      const fn = middlewares[i];
      if (!fn) return Promise.resolve();
      return Promise.resolve(fn(req, res, () => dispatch(i + 1)));
    }
    return dispatch(0);
  };
}
