const promiseQuery = (model, query) =>
  new Promise((resolve, reject) =>
    model.find(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  );

module.exports = { promiseQuery }
