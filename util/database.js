const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect("mongodb+srv://minhpham6:otb1CpVow1RPW8sW@cluster0.2uawqmu.mongodb.net/")
    .then(res => {
      _db = res.db("shop");
      callback();
    }).catch((err) => {
      console.log(err);
      throw err;
    })
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
}

module.exports = {
  mongoConnect,
  getDb
}