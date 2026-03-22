const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

blackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const blackListModel = mongoose.model("blacklist", blackListSchema);

module.exports = blackListModel;
