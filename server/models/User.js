
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    studentId: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ studentId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
