const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String // Ideally store hashed, but plain text for now if testing
});

module.exports = mongoose.model("Admin", AdminSchema);
