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
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post("/category", async (req, res) => {
  const { userId, queryParameter } = req.body;
  try {
    let data = await Task.find({
      userId: userId,
    }).populate("categoryId");
    data = data.reverse();

    const taskCategories = await TaskCategory.find({ custom: false }).sort({
      name: 1,
    });
    const customTaskCategories = await TaskCategory.find({
      userId: userId,
    }).sort({
      name: 1,
    });
    const categories = [...taskCategories, ...customTaskCategories];

    const tasks = data.filter(
      (task) => task.categoryId.name == queryParameter && task.done == false
    );
    const tasks2 = data.filter((task) => task.done == false);

    if (queryParameter == "all" && tasks2.length > 0) {
      const doneTasks = data.filter((task) => task.done == true);
      return res.status(StatusCodes.OK).json({
        tasks: tasks2,
        doneTasks,
        category: { name: "all", icon: "clipboard-list", color: "#3182ce" },
        categories,
      });
    }
    if (tasks.length > 0) {
      const doneTasks = data.filter(
        (task) => task.categoryId.name == queryParameter && task.done == true
      );
      return res
        .status(StatusCodes.OK)
        .json({ tasks, doneTasks, category: tasks[0].categoryId, categories });
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
    const existingCustomName = await TaskCategory.findOne({
      name: name,
      userId: userId,
    });
    const existingDefaultName = await TaskCategory.findOne({
      name: name,
      custom: false,
    });
    if (existingCustomName || existingDefaultName) {
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
    const existingCustomName = await TaskCategory.findOne({
      name: name,
      userId: userId,
    });
    const existingDefaultName = await TaskCategory.findOne({
      name: name,
      custom: false,
    });
    if (existingCustomName || existingDefaultName) {
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
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post("/update-task", async (req, res) => {
  const { taskEditId, taskEditName, taskEditDescription, taskEditDate } =
    req.body;
  try {
    await Task.findByIdAndUpdate(
      { _id: taskEditId },
      {
        name: taskEditName,
        description: taskEditDescription,
        date: taskEditDate,
      }
    );
    const updatedTask = await Task.findById({ _id: taskEditId }).populate(
      "categoryId"
    );
    return res.status(StatusCodes.OK).json(updatedTask);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post("/get-done-task", async (req, res) => {
  const { taskId } = req.body;
  try {
    await Task.findByIdAndUpdate(taskId, { done: true });
    return res.status(StatusCodes.OK).json("task is done");
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete("/delete-task/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  try {
    await Task.findByIdAndDelete(taskId);
    return res.status(StatusCodes.OK).json("task is deleted");
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = router;
