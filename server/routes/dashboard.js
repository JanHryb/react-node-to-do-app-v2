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

router.post("/create-category", async (req, res) => {
  let { name, icon, color, userId } = req.body;
  name = name.toLowerCase();
  let errorMessages = { categoryName: "" };
  try {
    await TaskCategory.create({
      name,
      icon,
      color,
      userId,
    });
    return res.status(StatusCodes.CREATED).json("category has been created");
  } catch (err) {
    if (err.code === 11000) {
      errorMessages.categoryName = "this list category already exists";
      return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post("/create-task", async (req, res) => {
  const { name, description, date, userId, categoryId } = req.body;
  try {
    await Task.create({ name, description, date, userId, categoryId });
    return res.status(StatusCodes.CREATED).json("task has been created");
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
