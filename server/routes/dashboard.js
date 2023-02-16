const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const TaskCategory = require("../models/TaskCategory");
const Task = require("../models/Task");

router.post("/categories", async (req, res) => {
  const { userId } = req.body;
  try {
    const taskCategories = await TaskCategory.find({ custom: false });
    const customTaskCategories = await TaskCategory.find({ userId: userId });
    const categories = [...taskCategories, ...customTaskCategories];

    return res.status(StatusCodes.OK).json(categories);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
