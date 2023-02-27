const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const TaskCategory = require("../models/TaskCategory");
const Task = require("../models/Task");

router.post("/data", async (req, res) => {
  const { userId } = req.body;
  try {
    const tasks = await Task.find({ userId: userId, done: false })
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

router.post("/category", async (req, res) => {
  const { userId, queryParameter } = req.body;
  try {
    const data = await Task.find({
      userId: userId,
    }).populate("categoryId");
    const tasks = data.filter((task) => task.categoryId.name == queryParameter);
    const taskCategories = await TaskCategory.find({ custom: false }).sort({
      name: 1,
    });
    const customTaskCategories = await TaskCategory.find({
      userId: userId,
    }).sort({
      name: 1,
    });
    const categories = [...taskCategories, ...customTaskCategories];

    if (queryParameter == "all" && data.length > 0) {
      return res.status(StatusCodes.OK).json({
        tasks: data,
        category: { name: "all", icon: "clipboard-list", color: "#3182ce" },
        categories,
      });
    }
    if (tasks.length > 0) {
      return res
        .status(StatusCodes.OK)
        .json({ tasks, category: tasks[0].categoryId, categories });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(`empty set of tasks in category named ${queryParameter}`);
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post("/create-category", async (req, res) => {
  let { name, icon, color, userId } = req.body;
  name = name.toLowerCase();
  let errorMessages = {
    categoryName: "",
    categoryColor: "",
  };
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

router.post("/update-category", async (req, res) => {
  let { name, color, categoryId, userId, editColorOnly } = req.body;
  name = name.toLowerCase();
  let errorMessages = {
    categoryName: "",
    categoryColor: "",
  };
  try {
    if (editColorOnly) {
      await TaskCategory.findByIdAndUpdate({ _id: categoryId }, { color });
      return res.status(StatusCodes.OK).json({ redirect: false });
    }
    const existingName = await TaskCategory.findOne({
      name: name,
      userId: userId,
    });
    if (existingName) {
      const error = new Error("this list category already exists");
      error.code = 11000;
      throw error;
    }
    await TaskCategory.findByIdAndUpdate({ _id: categoryId }, { name, color });
    return res
      .status(StatusCodes.OK)
      .json({ url: `/category?name=${name}`, redirect: true });
  } catch (err) {
    if (err.code === 11000) {
      errorMessages.categoryName = err.message;
      return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete("/delete-category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    await Task.deleteMany({ categoryId });
    await TaskCategory.findByIdAndDelete(categoryId);
    return res
      .status(StatusCodes.OK)
      .json(
        "category with all tasks related to it has been deleted successfully"
      );
  } catch (err) {
    console.log(err);
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
