module.exports = {
  prod: require("../config.json").db_uri || process.env.MONGOURI,
  dev: "mongodb://localhost:27017/DBauth",
};
