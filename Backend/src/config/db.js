const mongoose = require("mongoose");

async function connectToDb() {
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Db is connected");
    })
}

module.exports = connectToDb;
