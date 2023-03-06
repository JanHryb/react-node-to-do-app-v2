import React, { useState, useEffect } from "react";
import styles from "./Category.module.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faXmarkCircle,
  faChevronLeft,
  faPenToSquare,
  faPencil,
  faClipboardList, // use if for all category(for all tasks)
  faHeart,
  faSchool,
  faWallet,
  faBook,
  faBriefcase,
  faUserGroup,
  faHouse,
  faCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(
  faHeart,
  faSchool,
  faWallet,
  faBook,
  faBriefcase,
  faUserGroup,
  faHouse,
  faPencil,
  faClipboardList
);

function Category({ user }) {
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#000000");
  const [categoryEditName, setCategoryEditName] = useState("");
  const [categoryEditColor, setCategoryEditColor] = useState("#000000");
  const [categoryEditColorDefault, setCategoryEditColorDefault] =
    useState("#000000");
  const [formCreateTaskStyle, setFormCreateTaskStyle] = useState({
    display: "none",
  });
  const [formCreateCategoryStyle, setFormCreateCategoryStyle] = useState({
    display: "none",
  });
  const [formEditCategoryStyle, setFormEditCategoryStyle] = useState({
    display: "none",
  });
  const [blurStyle, setBlurStyle] = useState({ display: "none" });
  const [taskViewStyle, setTaskViewStyle] = useState({ display: "none" });
  const [taskViewData, setTaskViewData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [category, setCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [errorMessages, setErrorMessages] = useState({
    categoryName: "",
    categoryColor: "",
  });
  const minCalendarDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParameter = new URLSearchParams(location.search).get("name");

  useEffect(() => {
    axios
      .post(
        "dashboard/category",
        {
          userId: user._id,
          queryParameter,
        },
        {
          baseURL: "http://localhost:5000/",
        }
      )
      .then((res) => {
        setTasks(res.data.tasks);
        setDoneTasks(res.data.doneTasks);
        setCategory(res.data.category);
        setCategories(res.data.categories);
        if (queryParameter != "all") {
          setTaskCategory(res.data.category._id);
        }
        if (res.data.category.custom) {
          setCategoryEditColorDefault(res.data.category.color);
          setCategoryEditColor(res.data.category.color);
        }
      })
      .catch((err) => {
        navigate("/");
        console.log(err);
      })
      .finally(() => {
        setLoading(true);
      });
  }, [updateData]);

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const handleTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };
  const handleTaskCategoryChange = (e) => {
    setTaskCategory(e.target.value);
  };
  const handleTaskDateChange = (e) => {
    setTaskDate(e.target.value);
  };
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };
  const handleCategoryColorChange = (e) => {
    setCategoryColor(e.target.value);
  };
  const handleCategoryEditNameChange = (e) => {
    setCategoryEditName(e.target.value);
  };
  const handleCategoryEditColorChange = (e) => {
    setCategoryEditColor(e.target.value);
  };

  const openForm = (e, formType) => {
    if (formType == "createTask") {
      setBlurStyle({ display: "flex" });
      setFormCreateTaskStyle({ display: "flex" });
    }
    if (formType == "createCategory") {
      setFormCreateCategoryStyle({ display: "flex" });
      setFormCreateTaskStyle({ display: "none" });
    }
    if (formType == "editCategory") {
      setBlurStyle({ display: "flex" });
      setFormEditCategoryStyle({ display: "flex" });
    }
  };
  const closeForm = (e, formType) => {
    if (formType == "createTask") {
      setBlurStyle({ display: "none" });
      setFormCreateTaskStyle({ display: "none" });
      setTaskName("");
      setTaskDate("");
      if (queryParameter == "all") {
        setTaskCategory("");
      }
      setTaskDescription("");
    }
    if (formType == "createCategory") {
      setFormCreateCategoryStyle({ display: "none" });
      setFormCreateTaskStyle({ display: "flex" });
      setCategoryName("");
      setCategoryColor("#000000");
      setErrorMessages({
        categoryName: "",
        categoryColor: "",
      });
    }
    if (formType == "editCategory") {
      setBlurStyle({ display: "none" });
      setFormEditCategoryStyle({ display: "none" });
      setCategoryEditName("");
      setCategoryEditColor(categoryEditColorDefault);
      setErrorMessages({
        categoryName: "",
        categoryColor: "",
      });
    }
  };

  const closeBlur = () => {
    setBlurStyle({ display: "none" });
    setFormCreateTaskStyle({ display: "none" });
    setFormCreateCategoryStyle({ display: "none" });
    setFormEditCategoryStyle({ display: "none" });
    setTaskViewStyle({ display: "none" });
    setTaskViewData([]);
    setCategoryEditName("");
    setCategoryEditColor(categoryEditColorDefault);
    setTaskName("");
    setTaskDate("");
    if (queryParameter == "all") {
      setTaskCategory("");
    }
    setTaskDescription("");
    setCategoryName("");
    setCategoryColor("#000000");
    setErrorMessages({
      categoryName: "",
      categoryColor: "",
    });
  };

  const deleteCategory = () => {
    if (
      confirm(
        "are you sure you want to delete this category with all tasks related to it?"
      )
    ) {
      axios
        .delete(`dashboard/delete-category/${category._id}`, {
          baseURL: "http://localhost:5000/",
        })
        .then((res) => {
          navigate("/");
          toast.success("custom category deleted", {
            toastId: "successDeleteCategory1",
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getDoneTask = (taskId) => {
    axios
      .post(
        `dashboard/get-done-task`,
        { taskId },
        {
          baseURL: "http://localhost:5000/",
        }
      )
      .then((res) => {
        setUpdateData(!updateData);
        closeTaskView();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openTaskView = (_id, name, description, date, done, categoryId) => {
    setBlurStyle({ display: "flex" });
    setTaskViewStyle({ display: "flex" });
    setTaskViewData([{ _id, name, description, date, done, categoryId }]);
  };

  const closeTaskView = () => {
    setBlurStyle({ display: "none" });
    setTaskViewStyle({ display: "none" });
    setTaskViewData([]);
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`dashboard/delete-task/${taskId}`, {
        baseURL: "http://localhost:5000/",
      })
      .then((res) => {
        setUpdateData(!updateData);
        closeTaskView();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    let validForm = true;
    if (categoryColor == "#ffffff" || categoryEditColor == "#ffffff") {
      validForm = false;
      setErrorMessages({
        categoryName: "",
        categoryColor: "category color can't be white",
      });
    }
    if (
      (categoryEditColor == category.color &&
        categoryEditName == category.name) ||
      (categoryEditColor == category.color && categoryEditName == "")
    ) {
      validForm = false;
      closeForm(e, "editCategory");
    }
    if (formType == "createTask") {
      if (validForm) {
        axios
          .post(
            "dashboard/create-task",
            {
              name: taskName,
              description: taskDescription,
              date: taskDate,
              userId: user._id,
              categoryId: taskCategory,
            },
            {
              baseURL: "http://localhost:5000/",
            }
          )
          .then((res) => {
            setUpdateData(!updateData);
            toast.success("task created", {
              toastId: "successCreateCategory2",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            closeForm(e, "createTask");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    if (formType == "createCategory") {
      if (validForm) {
        axios
          .post(
            "dashboard/create-category",
            {
              name: categoryName,
              icon: faPencil.iconName,
              color: categoryColor,
              userId: user._id,
            },
            {
              baseURL: "http://localhost:5000/",
            }
          )
          .then((res) => {
            setUpdateData(!updateData);
            toast.success("list category created", {
              toastId: "successCreateCategory2",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            closeForm(e, "createCategory");
          })
          .catch((err) => {
            if (err.response.status !== 500) {
              setErrorMessages(err.response.data);
            }
          });
      }
    }
    if (formType == "editCategory") {
      if (validForm) {
        let editColorOnly = false;
        if (categoryEditName == category.name || categoryEditName == "") {
          editColorOnly = true;
        }
        axios
          .post(
            "dashboard/update-category",
            {
              name: categoryEditName,
              color: categoryEditColor,
              categoryId: category._id,
              userId: user._id,
              editColorOnly,
            },
            {
              baseURL: "http://localhost:5000/",
            }
          )
          .then((res) => {
            if (res.data.redirect) {
              navigate(res.data.url);
            }
            setUpdateData(!updateData);
            toast.success("list category updated", {
              toastId: "successUpdateCategory1",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            closeForm(e, "editCategory");
          })
          .catch((err) => {
            if (err.response.status !== 500) {
              setErrorMessages(err.response.data);
            }
          });
      }
    }
  };
  return (
    <>
      {loading ? (
        <>
          <main className={styles["main"]}>
            <section className={styles["main__icons-wrapper"]}>
              <Link to="/">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={styles["main__icons-wrapper__icon"]}
                />
              </Link>
              {category.custom == true ? (
                <>
                  <button className={styles["main__icons-wrapper__button"]}>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className={styles["main__icons-wrapper__button__icon"]}
                      onClick={(e) => {
                        openForm(e, "editCategory");
                      }}
                    />
                  </button>
                </>
              ) : (
                <>
                  <div></div>
                </>
              )}
            </section>
            <header className={styles["main__header"]}>
              <div className={styles["main__header__wrapper"]}>
                <div className={styles["main__header__wrapper__box"]}>
                  <h1 className={styles["main__header__wrapper__box__title"]}>
                    {category.name}
                  </h1>
                  <FontAwesomeIcon
                    icon={category.icon}
                    className={styles["main__header__wrapper__box__icon"]}
                    style={{ color: category.color }}
                  />
                </div>

                <p className={styles["main__header__wrapper__tasks-num"]}>
                  {tasks.length} {tasks.length == 1 ? <>task</> : <>tasks</>}
                </p>
              </div>

              <button
                type="button"
                className={styles["main__header__button"]}
                onClick={(e) => {
                  openForm(e, "createTask");
                }}
              >
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  className={styles["main__header__button__icon"]}
                />
                create new task
              </button>
            </header>
            {/* TODO: */}
            <section className={styles["main__tasks-wrapper"]}>
              {tasks.map(
                ({ _id, name, description, date, done, categoryId }) => {
                  return (
                    <div
                      key={_id}
                      className={styles["main__tasks-wrapper__task"]}
                    >
                      <p
                        className={styles["main__tasks-wrapper__task__name"]}
                        onClick={() => {
                          openTaskView(
                            _id,
                            name,
                            description,
                            date,
                            done,
                            categoryId
                          );
                        }}
                      >
                        {name}
                      </p>
                      <div
                        className={
                          styles["main__tasks-wrapper__task__icons-wrapper"]
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles[
                              "main__tasks-wrapper__task__icons-wrapper__button"
                            ]
                          }
                          onClick={() => {
                            getDoneTask(_id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={
                              styles[
                                "main__tasks-wrapper__task__icons-wrapper__button__icon"
                              ]
                            }
                          />
                        </button>
                        {/* <button
                          className={
                            styles[
                              "main__tasks-wrapper__task__icons-wrapper__button"
                            ]
                          }
                          onClick={() => {
                            deleteTask(_id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className={
                              styles[
                                "main__tasks-wrapper__task__icons-wrapper__button__icon"
                              ]
                            }
                          />
                        </button> */}
                      </div>
                    </div>
                  );
                }
              )}
            </section>
            <section className={styles["main__done-tasks-wrapper"]}>
              {doneTasks.map(
                ({ _id, name, description, date, done, categoryId }) => {
                  return (
                    <div
                      key={_id}
                      className={styles["main__done-tasks-wrapper__task"]}
                    >
                      <p
                        className={
                          styles["main__done-tasks-wrapper__task__name"]
                        }
                        onClick={() => {
                          openTaskView(
                            _id,
                            name,
                            description,
                            date,
                            done,
                            categoryId
                          );
                        }}
                      >
                        {name}
                      </p>
                      <div
                        className={
                          styles[
                            "main__done-tasks-wrapper__task__icons-wrapper"
                          ]
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles[
                              "main__done-tasks-wrapper__task__icons-wrapper__button"
                            ]
                          }
                          onClick={() => {
                            deleteTask(_id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className={
                              styles[
                                "main__done-tasks-wrapper__task__icons-wrapper__button__icon"
                              ]
                            }
                          />
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </section>
          </main>
          <div
            className={styles["blur"]}
            style={blurStyle}
            onClick={() => {
              closeBlur();
            }}
          ></div>
          <div className={styles["task-view"]} style={taskViewStyle}>
            <header
              className={`${styles["task-view__content-wrapper"]} ${styles["task-view__content-wrapper--header"]}`}
            >
              <h1 className={styles["task-view__content-wrapper__header"]}>
                Task details
              </h1>
              <button
                className={styles["task-view__content-wrapper__cancel-button"]}
                type="button"
                onClick={() => {
                  closeTaskView();
                }}
              >
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  className={
                    styles["task-view__content-wrapper__cancel-button__icon"]
                  }
                />
              </button>
            </header>
            {taskViewData.map(
              ({ _id, name, description, date, done, categoryId }) => {
                return (
                  <div
                    key={_id}
                    className={styles["task-view__content-wrapper"]}
                  >
                    <div className={styles["task-view__content-wrapper"]}>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-header"]
                        }
                      >
                        name
                      </p>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-content"]
                        }
                      >
                        {name}
                      </p>
                    </div>
                    <div className={styles["task-view__content-wrapper"]}>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-header"]
                        }
                      >
                        description
                      </p>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-content"]
                        }
                      >
                        {description ? <>{description}</> : <>-</>}
                      </p>
                    </div>
                    <div className={styles["task-view__content-wrapper"]}>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-header"]
                        }
                      >
                        date
                      </p>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-content"]
                        }
                      >
                        {date ? (
                          <>{format(new Date(date), "yyyy-MM-dd HH:mm")}</>
                        ) : (
                          <>-</>
                        )}
                      </p>
                    </div>
                    <div className={styles["task-view__content-wrapper"]}>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-header"]
                        }
                      >
                        list category
                      </p>
                      <p
                        className={
                          styles["task-view__content-wrapper__task-content"]
                        }
                      >
                        {categoryId.name}
                      </p>
                    </div>
                    {done == false ? (
                      <div className={styles["form__content-wrapper"]}>
                        <button
                          type="button"
                          className={styles["form__content-wrapper__button"]}
                          onClick={() => {
                            getDoneTask(_id);
                          }}
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className={styles["form__content-wrapper"]}>
                      <button
                        type="button"
                        className={`${styles["form__content-wrapper__button-delete"]}`}
                        onClick={() => {
                          deleteTask(_id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <form
            className={styles["form"]}
            onSubmit={(e) => handleSubmit(e, "createTask")}
            style={formCreateTaskStyle}
          >
            <header
              className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--header"]}`}
            >
              <h1 className={styles["form__content-wrapper__header"]}>
                New Task
              </h1>
              <button
                className={styles["form__content-wrapper__cancel-button"]}
                type="button"
                onClick={(e) => {
                  closeForm(e, "createTask");
                }}
              >
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  className={
                    styles["form__content-wrapper__cancel-button__icon"]
                  }
                />
              </button>
            </header>
            <div className={styles["form__content-wrapper"]}>
              <input
                type="text"
                required
                onChange={handleTaskNameChange}
                value={taskName}
                className={styles["form__content-wrapper__input"]}
                placeholder="name"
              />
            </div>
            <div className={styles["form__content-wrapper"]}>
              <textarea
                onChange={handleTaskDescriptionChange}
                value={taskDescription}
                className={`${styles["form__content-wrapper__input"]} ${styles["form__content-wrapper__input--textarea"]}`}
                placeholder="description"
                rows="3"
              ></textarea>
            </div>
            {queryParameter == "all" ? (
              <>
                {" "}
                <div
                  className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--select"]}`}
                >
                  <select
                    className={`${styles["form__content-wrapper__input"]} ${styles["form__content-wrapper__input--select"]}`}
                    value={taskCategory}
                    onChange={handleTaskCategoryChange}
                    required
                  >
                    <option value="" disabled>
                      list category
                    </option>
                    {categories.map(({ _id, name }) => {
                      return (
                        <option value={_id} key={_id}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    className={styles["form__content-wrapper--select__button"]}
                    onClick={(e) => {
                      openForm(e, "createCategory");
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      className={
                        styles["form__content-wrapper--select__button__icon"]
                      }
                    />
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className={styles["form__content-wrapper"]}>
              <input
                type="datetime-local"
                onChange={handleTaskDateChange}
                value={taskDate}
                className={`${styles["form__content-wrapper__input"]} ${styles["form__content-wrapper__input--datetime-local"]}`}
                placeholder="date"
                min={minCalendarDate}
              />
            </div>
            <div className={styles["form__content-wrapper"]}>
              <button
                type="submit"
                className={styles["form__content-wrapper__button"]}
              >
                Create
              </button>
            </div>
          </form>
          <form
            className={styles["form"]}
            onSubmit={(e) => handleSubmit(e, "createCategory")}
            style={formCreateCategoryStyle}
          >
            <header
              className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--header"]}`}
            >
              <h1 className={styles["form__content-wrapper__header"]}>
                Custom list category
              </h1>
              <button
                className={styles["form__content-wrapper__cancel-button"]}
                type="button"
                onClick={(e) => {
                  closeForm(e, "createCategory");
                }}
              >
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  className={
                    styles["form__content-wrapper__cancel-button__icon"]
                  }
                />
              </button>
            </header>
            <div className={styles["form__content-wrapper"]}>
              {errorMessages.categoryName ? (
                <p className={styles["form__content-wrapper__error-message"]}>
                  name - {errorMessages.categoryName}
                </p>
              ) : (
                <></>
              )}
              <input
                type="text"
                required
                onChange={handleCategoryNameChange}
                value={categoryName}
                className={styles["form__content-wrapper__input"]}
                placeholder="name"
              />
            </div>
            {errorMessages.categoryColor ? (
              <p className={styles["form__content-wrapper__error-message"]}>
                color - {errorMessages.categoryColor}
              </p>
            ) : (
              <></>
            )}
            <div
              className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--color"]}`}
            >
              <label
                htmlFor="color"
                className={styles["form__content-wrapper--color__label"]}
              >
                pick color
              </label>
              <input
                type="color"
                required
                onChange={handleCategoryColorChange}
                value={categoryColor}
                className={`${styles["form__content-wrapper__input"]} ${styles["form__content-wrapper__input--color"]}`}
                id="color"
                placeholder="color"
              />
            </div>
            <div className={styles["form__content-wrapper"]}>
              <button
                type="submit"
                className={styles["form__content-wrapper__button"]}
              >
                Create
              </button>
            </div>
          </form>
          <form
            className={styles["form"]}
            onSubmit={(e) => handleSubmit(e, "editCategory")}
            style={formEditCategoryStyle}
          >
            <header
              className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--header"]}`}
            >
              <h1 className={styles["form__content-wrapper__header"]}>
                Edit list category
              </h1>
              <button
                className={styles["form__content-wrapper__cancel-button"]}
                type="button"
                onClick={(e) => {
                  closeForm(e, "editCategory");
                }}
              >
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  className={
                    styles["form__content-wrapper__cancel-button__icon"]
                  }
                />
              </button>
            </header>
            <div className={styles["form__content-wrapper"]}>
              {errorMessages.categoryName ? (
                <p className={styles["form__content-wrapper__error-message"]}>
                  name - {errorMessages.categoryName}
                </p>
              ) : (
                <></>
              )}
              <input
                type="text"
                onChange={handleCategoryEditNameChange}
                value={categoryEditName}
                className={styles["form__content-wrapper__input"]}
                placeholder="name"
              />
            </div>
            {errorMessages.categoryColor ? (
              <p className={styles["form__content-wrapper__error-message"]}>
                color - {errorMessages.categoryColor}
              </p>
            ) : (
              <></>
            )}
            <div
              className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--color"]}`}
            >
              <label
                htmlFor="color"
                className={styles["form__content-wrapper--color__label"]}
              >
                pick color
              </label>
              <input
                type="color"
                required
                onChange={handleCategoryEditColorChange}
                value={categoryEditColor}
                className={`${styles["form__content-wrapper__input"]} ${styles["form__content-wrapper__input--color"]}`}
                id="color"
                placeholder="color"
              />
            </div>
            <div className={styles["form__content-wrapper"]}>
              <button
                type="submit"
                className={styles["form__content-wrapper__button"]}
              >
                Edit
              </button>
            </div>
            <div className={styles["form__content-wrapper"]}>
              <button
                type="button"
                className={`${styles["form__content-wrapper__button-delete"]}`}
                onClick={() => {
                  deleteCategory();
                }}
              >
                Delete this category
              </button>
            </div>
          </form>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Category;
