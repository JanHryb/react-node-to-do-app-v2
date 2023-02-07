const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const taskSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  done: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: Schema.Types.ObjectId, ref: "TaskCategory" },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
