import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faXmarkCircle,
  faPencil,
  faClipboardList, // use if for all category(for all tasks)
  faHeart,
  faSchool,
  faWallet,
  faBook,
  faBriefcase,
  faUserGroup,
  faHouse,
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
  faPencil
);

function Dashboard({ user }) {
  const currentDay = format(new Date(), "eeee");
  const currentDate = format(new Date(), "d MMM");
  const minCalendarDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const [loading, setLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#000000");
  const [formCreateTaskStyle, setFormCreateTaskStyle] = useState({
    display: "none",
  });
  const [formCreateCategoryStyle, setFormCreateCategoryStyle] = useState({
    display: "none",
  });
  const [blurStyle, setBlurStyle] = useState({ display: "none" });
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesWithNumOfTasks, setCategoriesWithNumOfTasks] = useState([]);
  const [errorMessages, setErrorMessages] = useState({
    categoryName: "",
    categoryColor: "",
  });
  const [updateData, setUpdateData] = useState(false);

  useEffect(() => {
    axios
      .post(
        "dashboard/data",
        {
          userId: user._id,
        },
        {
          baseURL: "http://localhost:5000/",
        }
      )
      .then((res) => {
        setTasks(res.data.tasks);
        setCategories(res.data.categories);
        setCategoriesWithNumOfTasks(res.data.categoriesWithNumOfTasks);
      })
      .then(() => {})
      .catch((err) => {
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

  const openForm = (e, formType) => {
    if (formType == "createTask") {
      setBlurStyle({ display: "flex" });
      setFormCreateTaskStyle({ display: "flex" });
    }
    if (formType == "createCategory") {
      setFormCreateCategoryStyle({ display: "flex" });
      setFormCreateTaskStyle({ display: "none" });
    }
  };
  const closeForm = (e, formType) => {
    if (formType == "createTask") {
      setBlurStyle({ display: "none" });
      setFormCreateTaskStyle({ display: "none" });
      setTaskName("");
      setTaskDate("");
      setTaskCategory("");
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
  };

  const closeBlur = () => {
    setBlurStyle({ display: "none" });
    setFormCreateTaskStyle({ display: "none" });
    setFormCreateCategoryStyle({ display: "none" });
    setTaskName("");
    setTaskDate("");
    setTaskCategory("");
    setTaskDescription("");
    setCategoryName("");
    setCategoryColor("#000000");
    setErrorMessages({
      categoryName: "",
      categoryColor: "",
    });
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    let validForm = true;
    if (categoryColor == "#ffffff") {
      validForm = false;
      setErrorMessages({
        categoryName: "",
        categoryColor: "category color can't be white",
      });
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
              toastId: "successCreateCategory1",
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
              toastId: "successCreateCategory1",
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
  };

  return (
    <>
      {loading ? (
        <>
          <main className={styles["main"]}>
            <header className={styles["main__header-wrapper"]}>
              <h1 className={styles["main__header-wrapper__header"]}>
                <span
                  className={styles["main__header-wrapper__header__normal"]}
                >
                  hello
                </span>
                <span> </span>
                {user.username}
              </h1>
              <p className={styles["main__header-wrapper__date"]}>
                <span className={styles["main__header-wrapper__date__bold"]}>
                  {currentDay}
                </span>
                , {currentDate}
              </p>
            </header>
            <section className={styles["main__categories-wrapper"]}>
              <header className={styles["main__categories-wrapper__header"]}>
                <h3
                  className={styles["main__categories-wrapper__header__title"]}
                >
                  Task lists
                </h3>
                <button
                  type="button"
                  className={styles["main__categories-wrapper__header__button"]}
                  onClick={(e) => {
                    openForm(e, "createTask");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className={
                      styles["main__categories-wrapper__header__button__icon"]
                    }
                  />
                </button>
              </header>
              {tasks.length > 0 ? (
                <div className={styles["main__categories-wrapper__category"]}>
                  <Link
                    to="/category?name=all"
                    className={
                      styles["main__categories-wrapper__category__link"]
                    }
                  >
                    <FontAwesomeIcon
                      icon={faClipboardList}
                      className={
                        styles["main__categories-wrapper__category__link__icon"]
                      }
                    />
                    <div
                      className={
                        styles["main__categories-wrapper__category__link__box"]
                      }
                    >
                      <p
                        className={
                          styles[
                            "main__categories-wrapper__category__link__box__name"
                          ]
                        }
                      >
                        all
                      </p>
                      <p
                        className={
                          styles[
                            "main__categories-wrapper__category__link__box__number"
                          ]
                        }
                      >
                        {tasks.length}{" "}
                        {tasks.length == 1 ? <>task</> : <>tasks</>}
                      </p>
                    </div>
                  </Link>
                </div>
              ) : (
                <></>
              )}

              {categoriesWithNumOfTasks.map(({ category, numOfTasks }) => {
                return (
                  <div
                    key={category._id}
                    className={styles["main__categories-wrapper__category"]}
                  >
                    <Link
                      to={`/category?name=${category.name}`}
                      className={
                        styles["main__categories-wrapper__category__link"]
                      }
                    >
                      <FontAwesomeIcon
                        icon={category.icon}
                        className={
                          styles[
                            "main__categories-wrapper__category__link__icon"
                          ]
                        }
                        style={{ color: category.color }}
                      />
                      <div
                        className={
                          styles[
                            "main__categories-wrapper__category__link__box"
                          ]
                        }
                      >
                        <p
                          className={
                            styles[
                              "main__categories-wrapper__category__link__box__name"
                            ]
                          }
                        >
                          {category.name}
                        </p>
                        <p
                          className={
                            styles[
                              "main__categories-wrapper__category__link__box__number"
                            ]
                          }
                        >
                          {numOfTasks}{" "}
                          {numOfTasks == 1 ? <>task</> : <>tasks</>}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </section>
            {/* TODO: pie chart and other charts */}
            <section></section>
          </main>
          <div
            className={styles["blur"]}
            style={blurStyle}
            onClick={() => {
              closeBlur();
            }}
          ></div>
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
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Dashboard;
