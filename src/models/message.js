const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
