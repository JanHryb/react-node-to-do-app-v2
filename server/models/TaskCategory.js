const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const taskCategorySchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const TaskCategory = mongoose.model("TaskCategory", taskCategorySchema);

module.exports = TaskCategory;
