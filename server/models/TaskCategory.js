const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const taskCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  custom: { type: Boolean, default: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const TaskCategory = mongoose.model("TaskCategory", taskCategorySchema);

module.exports = TaskCategory;
