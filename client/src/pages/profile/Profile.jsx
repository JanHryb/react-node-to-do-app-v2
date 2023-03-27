import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faPenToSquare,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Profile({ user }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [blurStyle, setBlurStyle] = useState({ display: "none" });
  const [formUsernameStyle, setFormUsernameStyle] = useState({
    display: "none",
  });
  const [formEmailStyle, setFormEmailStyle] = useState({ display: "none" });
  const [formPasswordStyle, setFormPasswordStyle] = useState({
    display: "none",
  });
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const openForm = (e, formType) => {
    setBlurStyle({ display: "flex" });
    if (formType == "username") {
      setFormUsernameStyle({ display: "flex" });
    }
    if (formType == "password") {
      setFormPasswordStyle({ display: "flex" });
    }
    if (formType == "email") {
      setFormEmailStyle({ display: "flex" });
    }
  };
  const closeForm = (e, formType) => {
    setBlurStyle({ display: "none" });
    if (formType == "username") {
      setFormUsernameStyle({ display: "none" });
      setUsername("");
      setErrorMessages({
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      });
    }
    if (formType == "password") {
      setFormPasswordStyle({ display: "none" });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordRepeat("");
      setErrorMessages({
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      });
    }
    if (formType == "email") {
      setFormEmailStyle({ display: "none" });
      setEmail("");
      setErrorMessages({
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      });
    }
  };

  const closeBlur = () => {
    setBlurStyle({ display: "none" });
    setFormUsernameStyle({ display: "none" });
    setUsername("");
    setFormPasswordStyle({ display: "none" });
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordRepeat("");
    setFormEmailStyle({ display: "none" });
    setEmail("");
    setErrorMessages({
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
    });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleNewPasswordRepeatChange = (e) => {
    setNewPasswordRepeat(e.target.value);
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    let validForm = true;
    let errorMessages = {
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
    };
    if (formType == "username") {
      if (username.length < 3) {
        validForm = false;
        errorMessages.username = "this field must be at least 3 characters";
      }
      if (username.indexOf(" ") >= 0) {
        validForm = false;
        errorMessages.username = "username can't contain space";
      }
      if (user.username === username) {
        validForm = false;
        closeForm(e, "username");
      }
      if (validForm) {
        axios
          .post("user/edit-username", {
            username,
            userId: user._id,
          })
          .then((res) => {
            navigate(location.pathname);
            toast.success("username updated", {
              toastId: "successEditMessage1",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setErrorMessages({
              username: "",
              email: "",
              currentPassword: "",
              newPassword: "",
              newPasswordRepeat: "",
            });
            closeForm(e, "username");
          })
          .catch((err) => {
            if (err.response.status !== 500) {
              setErrorMessages(err.response.data);
            }
          });
      } else {
        setErrorMessages(errorMessages);
      }
    }
    if (formType == "password") {
      if (currentPassword.length < 6) {
        validForm = false;
        errorMessages.currentPassword =
          "this field must be at least 6 characters";
      }
      if (newPassword === currentPassword) {
        validForm = false;
        errorMessages.newPasswordRepeat =
          "new password is the same as current one";
      }
      if (newPassword.length < 6) {
        validForm = false;
        errorMessages.newPassword = "this field must be at least 6 characters";
      }
      if (newPassword !== newPasswordRepeat) {
        validForm = false;
        errorMessages.newPasswordRepeat = "passwords aren't equal";
      }
      if (validForm) {
        axios
          .post("user/edit-password", {
            currentPassword,
            newPassword,
            newPasswordRepeat,
            userId: user._id,
          })
          .then((res) => {
            navigate(location.pathname);
            toast.success("password updated", {
              toastId: "successEditMessage2",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setErrorMessages({
              username: "",
              email: "",
              currentPassword: "",
              newPassword: "",
              newPasswordRepeat: "",
            });
            closeForm(e, "password");
          })
          .catch((err) => {
            if (err.response.status !== 500) {
              setErrorMessages(err.response.data);
            }
          });
      } else {
        setErrorMessages(errorMessages);
      }
    }
    if (formType == "email") {
      if (email.indexOf(" ") >= 0) {
        validForm = false;
        errorMessages.email = "email can't contain space";
      }
      if (user.email === email) {
        validForm = false;
        closeForm(e, "email");
      }
      if (validForm) {
        axios
          .post("user/edit-email", {
            email,
            userId: user._id,
          })
          .then((res) => {
            navigate(location.pathname);
            toast.success("email updated", {
              toastId: "successEditMessage3",
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setErrorMessages({
              username: "",
              email: "",
              currentPassword: "",
              newPassword: "",
              newPasswordRepeat: "",
            });
            closeForm(e, "email");
          })
          .catch((err) => {
            if (err.response.status !== 500) {
              setErrorMessages(err.response.data);
            }
          });
      } else {
        setErrorMessages(errorMessages);
      }
    }
  };

  return (
    <>
      <main className={styles["main"]}>
        <section className={styles["profile-wrapper"]}>
          <div
            className={`${styles["profile-wrapper__item"]} ${styles["profile-wrapper__item--profile"]}`}
          >
            <FontAwesomeIcon
              icon={faUserCircle}
              className={styles["profile-wrapper__item__icon-profile"]}
            />
            <h1 className={styles["profile-wrapper__item__title-username"]}>
              {user.username}
            </h1>
          </div>
          <div
            className={`${styles["profile-wrapper__item"]} ${styles["profile-wrapper__item--title-details"]}`}
          >
            <h2 className={styles["profile-wrapper__item__title-details"]}>
              Account details
            </h2>
          </div>
          <div className={styles["profile-wrapper__item"]}>
            <p className={styles["profile-wrapper__item__title"]}>Username</p>
            <p className={styles["profile-wrapper__item__description"]}>
              {user.username}
            </p>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className={styles["profile-wrapper__item__icon-edit"]}
              onClick={(e) => {
                openForm(e, "username");
              }}
            />
          </div>

          <div className={styles["profile-wrapper__item"]}>
            <p className={styles["profile-wrapper__item__title"]}>Password</p>
            <p className={styles["profile-wrapper__item__description"]}>
              ••••••••••••
            </p>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className={styles["profile-wrapper__item__icon-edit"]}
              onClick={(e) => {
                openForm(e, "password");
              }}
            />
          </div>
          <div className={styles["profile-wrapper__item"]}>
            <p className={styles["profile-wrapper__item__title"]}>Email</p>
            <p className={styles["profile-wrapper__item__description"]}>
              {user.email}
            </p>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className={styles["profile-wrapper__item__icon-edit"]}
              onClick={(e) => {
                openForm(e, "email");
              }}
            />
          </div>
          <div className={styles["profile-wrapper__item"]}>
            <p className={styles["profile-wrapper__item__title"]}>
              Email verification status
            </p>
            {user.verified ? (
              <p
                className={
                  styles["profile-wrapper__item__description--verified"]
                }
              >
                verified
              </p>
            ) : (
              <p
                className={
                  styles["profile-wrapper__item__description--not-verified"]
                }
              >
                not verified
              </p>
            )}
          </div>
        </section>
      </main>
      <div
        className={styles["blur"]}
        style={blurStyle}
        onClick={closeBlur}
      ></div>
      <form
        className={styles["form"]}
        onSubmit={(e) => handleSubmit(e, "username")}
        style={formUsernameStyle}
      >
        <header
          className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--header"]}`}
        >
          <h1 className={styles["form__content-wrapper__header"]}>
            Edit username
          </h1>
          <button
            className={styles["form__content-wrapper__cancel-button"]}
            type="button"
            onClick={(e) => {
              closeForm(e, "username");
            }}
          >
            <FontAwesomeIcon
              icon={faXmarkCircle}
              className={styles["form__content-wrapper__cancel-button__icon"]}
            />
          </button>
        </header>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.username ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              username - {errorMessages.username}
            </p>
          ) : (
            <></>
          )}
          <input
            type="text"
            required
            onChange={handleUsernameChange}
            value={username}
            className={styles["form__content-wrapper__input"]}
            placeholder="New username"
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          <button
            type="submit"
            className={styles["form__content-wrapper__button"]}
          >
            Save
          </button>
        </div>
      </form>
      <form
        className={styles["form"]}
        onSubmit={(e) => handleSubmit(e, "password")}
        style={formPasswordStyle}
      >
        <header
          className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--header"]}`}
        >
          <h1 className={styles["form__content-wrapper__header"]}>
            Edit password
          </h1>
          <button
            className={styles["form__content-wrapper__cancel-button"]}
            type="button"
            onClick={(e) => {
              closeForm(e, "password");
            }}
          >
            <FontAwesomeIcon
              icon={faXmarkCircle}
              className={styles["form__content-wrapper__cancel-button__icon"]}
            />
          </button>
        </header>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.currentPassword ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              current password - {errorMessages.currentPassword}
            </p>
          ) : (
            <></>
          )}
          <input
            type="password"
            required
            onChange={handleCurrentPasswordChange}
            value={currentPassword}
            className={styles["form__content-wrapper__input"]}
            placeholder="Current password"
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.newPassword ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              new password - {errorMessages.newPassword}
            </p>
          ) : (
            <></>
          )}
          <input
            type="password"
            required
            onChange={handleNewPasswordChange}
            value={newPassword}
            className={styles["form__content-wrapper__input"]}
            placeholder="New password"
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.newPasswordRepeat ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              repeat new password - {errorMessages.newPasswordRepeat}
            </p>
          ) : (
            <></>
          )}
          <input
            type="password"
            required
            onChange={handleNewPasswordRepeatChange}
            value={newPasswordRepeat}
            className={styles["form__content-wrapper__input"]}
            placeholder="Repeat new password"
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          <button
            type="submit"
            className={styles["form__content-wrapper__button"]}
          >
            Save
          </button>
        </div>
      </form>
      <form
        className={styles["form"]}
        onSubmit={(e) => handleSubmit(e, "email")}
        style={formEmailStyle}
      >
        <header
          className={`${styles["form__content-wrapper"]} ${styles["form__content-wrapper--header"]}`}
        >
          <h1 className={styles["form__content-wrapper__header"]}>
            Edit email
          </h1>
          <button
            className={styles["form__content-wrapper__cancel-button"]}
            type="button"
            onClick={(e) => {
              closeForm(e, "email");
            }}
          >
            <FontAwesomeIcon
              icon={faXmarkCircle}
              className={styles["form__content-wrapper__cancel-button__icon"]}
            />
          </button>
        </header>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.email ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              email - {errorMessages.email}
            </p>
          ) : (
            <></>
          )}
          <input
            type="email"
            required
            onChange={handleEmailChange}
            value={email}
            className={styles["form__content-wrapper__input"]}
            placeholder="New email"
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          <button
            type="submit"
            className={styles["form__content-wrapper__button"]}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}

export default Profile;
