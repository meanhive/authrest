const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    username: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      sparse: true,
    },
    password: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "users",
  }
);

// unique
UserSchema.plugin(uniqueValidator, { message: " is already taken." });

// schema export
module.exports = mongoose.model("UserSchema", UserSchema);
