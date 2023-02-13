import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Dashboard({ user }) {
  const currentDate = format(new Date(), "eeee, d MMM");
  const minCalendarDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const [loading, setLoading] = useState(true); // set this to false!
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [blurStyle, setBlurStyle] = useState({ display: "none" });
  const [formCreateTaskStyle, SetFormCreateTaskStyle] = useState({
    display: "none",
  });
  const [errorMessages, setErrorMessages] = useState({
    taskName: "",
  });

  useEffect(() => {}, []); // GET request to the server to get all tasks

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const handleTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };
  const handleTaskDateChange = (e) => {
    setTaskDate(e.target.value);
  };

  const openForm = (e, formType) => {
    setBlurStyle({ display: "flex" });
    if (formType == "createTask") {
      SetFormCreateTaskStyle({ display: "flex" });
    }
  };
  const closeForm = (e, formType) => {
    setBlurStyle({ display: "none" });
    if (formType == "createTask") {
      SetFormCreateTaskStyle({ display: "none" });
      // TODO: reset all inputs and errors
      setTaskName("");
      setTaskDate("");
      setTaskDescription("");
      setErrorMessages({
        taskName: "",
      });
    }
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    let validForm = true;
    let errorMessages = {
      taskName: "",
    };
    if (formType == "createTask") {
      // TODO: validate data
      if (validForm) {
        // TODO: axios post request
        console.log(taskName);
      }
    }
  };

  return (
    <>
      {loading ? (
        <>
          <main className={styles["main"]}>
            <section>
              <h1>hello {user.username}</h1>
              <p>{currentDate}</p>
            </section>
            <section>
              <button
                type="button"
                className={styles["button"]}
                onClick={(e) => {
                  openForm(e, "createTask");
                }}
              >
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  className={styles["button__icon"]}
                />
              </button>
            </section>
          </main>
          <div className={styles["blur"]} style={blurStyle}></div>
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
              {errorMessages.taskName ? (
                <p className={styles["form__content-wrapper__error-message"]}>
                  name - {errorMessages.taskName}
                </p>
              ) : (
                <></>
              )}
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
                rows="4"
              ></textarea>
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
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Dashboard;
