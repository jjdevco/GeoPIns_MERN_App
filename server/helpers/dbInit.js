const mongoose = require("mongoose");

module.exports = function initConnection(callback) {
  mongoose.Promise = global.Promise;

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.error("Failed to connect to database");
    process.exit(1);
  });

  db.once("open", () => {
    console.info("Connected to database");
    callback();
  });
};
