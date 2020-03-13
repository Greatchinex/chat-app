const mongoose = require("mongoose");

mongoose.Promise = global.Promise; // To Use Promises With Mongoose

try {
  // Connect to DB
  mongoose.connect("mongodb://localhost:27017/chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }); // { useNewUrlParser: true, useUnifiedTopology: true }: To remove depreciation Warnings
} catch (err) {
  throw err;
}

// Message if Successfully Connected to DB
mongoose.connection.on("connected", () => {
  console.log("Connected to database mongodb://localhost:27017/chat-app");
});

// Message if There is an error in database Connection
mongoose.connection.on("error", err => {
  throw err;
});

// To Remove moongoose depreciation warnings
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
