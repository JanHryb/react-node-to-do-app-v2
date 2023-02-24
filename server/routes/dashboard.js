const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const TaskCategory = require("../models/TaskCategory");
const Task = require("../models/Task");

router.post("/data", async (req, res) => {
  const { userId } = req.body;
  try {
    const tasks = await Task.find({ userId: userId })
      .populate("categoryId")
      .sort({ categoryId: 1 });
    const taskCategories = await TaskCategory.find({ custom: false }).sort({
      name: 1,
    });
    const customTaskCategories = await TaskCategory.find({
      userId: userId,
    }).sort({
      name: 1,
    });
    const categories = [...taskCategories, ...customTaskCategories];

    let categoriesWithNumOfTasks = [];
    if (tasks.length > 0) {
      for (let i = 0; i < tasks.length; i++) {
        if (i == 0) {
          categoriesWithNumOfTasks.push({
            category: tasks[i].categoryId,
            numOfTasks: 1,
          });
          continue;
        }
        if (
          tasks[i].categoryId.name ==
          categoriesWithNumOfTasks[categoriesWithNumOfTasks.length - 1].category
            .name
        ) {
          categoriesWithNumOfTasks[categoriesWithNumOfTasks.length - 1]
            .numOfTasks++;
        } else {
          categoriesWithNumOfTasks.push({
            category: tasks[i].categoryId,
            numOfTasks: 1,
          });
        }
      }
    }
    categoriesWithNumOfTasks.sort((a, b) => {
      return b.numOfTasks - a.numOfTasks;
    });

    const data = {
      tasks,
      categories,
      categoriesWithNumOfTasks,
    };
    return res.status(StatusCodes.OK).json(data);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post("/create-category", async (req, res) => {
  let { name, icon, color, userId } = req.body;
  name = name.toLowerCase();
  let errorMessages = { categoryName: "" };
  try {
    const existingName = await TaskCategory.findOne({
      name: name,
      userId: userId,
    });
    if (existingName) {
      const error = new Error("this list category already exists");
      error.code = 11000;
      throw error;
    }
    await TaskCategory.create({
      name,
      icon,
      color,
      userId,
    });
    return res.status(StatusCodes.CREATED).json("category has been created");
  } catch (err) {
    if (err.code === 11000) {
      errorMessages.categoryName = err.message;
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
