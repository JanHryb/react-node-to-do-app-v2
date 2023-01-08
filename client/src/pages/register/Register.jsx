import React, { useState } from "react";
import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    if (username && email && password && passwordRepeat) {
      let validForm = true;
      let errorMessages = {
        username: "",
        email: "",
        password: "",
        passwordRepeat: "",
      };
      if (username.length < 3) {
        validForm = false;
        errorMessages.username = "this field must be at least 3 characters";
      }
      if (username.indexOf(" ") >= 0) {
        validForm = false;
        errorMessages.username = "username can't contain space";
      }
      if (email.indexOf(" ") >= 0) {
        validForm = false;
        errorMessages.email = "email can't contain space";
      }
      if (password.length < 6) {
        validForm = false;
        errorMessages.password = "this field must be at least 6 characters";
      }
      if (password !== passwordRepeat) {
        validForm = false;
        errorMessages.passwordRepeat = "passwords aren't equal";
      }
      if (validForm) {
        return true;
      } else {
        setErrorMessages(errorMessages);
        return false;
      }
    } else {
      return false;
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handlePasswordRepeatChange = (e) => {
    setPasswordRepeat(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post(
          "user/register",
          {
            username,
            email,
            password,
            passwordRepeat,
          },
          { baseURL: "http://localhost:5000/" }
        )
        .then((res) => {
          // console.log(res);
          localStorage.setItem("successMessage", "Account has been created");
          navigate("/login");
        })
        .catch((err) => {
          if (err.response.status !== 500) {
            setErrorMessages(err.response.data);
          }
        });
    }
  };

  //use react tostify for error messages

  return (
    <main className={styles["main"]}>
      <form className={styles["form"]} onSubmit={handleSubmit}>
        <header className={styles["form__content-wrapper"]}>
          <h1 className={styles["form__content-wrapper__header"]}>
            Create an account
          </h1>
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
            onChange={handleUsernameChange}
            value={username}
            className={styles["form__content-wrapper__input"]}
            placeholder="Username"
            required
          />
        </div>
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
            onChange={handleEmailChange}
            value={email}
            className={styles["form__content-wrapper__input"]}
            placeholder="Email"
            required
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.password ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              password - {errorMessages.password}
            </p>
          ) : (
            <></>
          )}
          <input
            type="password"
            onChange={handlePasswordChange}
            value={password}
            required
            placeholder="Password"
            className={styles["form__content-wrapper__input"]}
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.passwordRepeat ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              repeat password - {errorMessages.passwordRepeat}
            </p>
          ) : (
            <></>
          )}
          <input
            type="password"
            onChange={handlePasswordRepeatChange}
            value={passwordRepeat}
            required
            placeholder="Repeat password"
            className={styles["form__content-wrapper__input"]}
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          <button
            type="submit"
            className={styles["form__content-wrapper__button"]}
          >
            Register
          </button>
        </div>
        <div className={styles["form__content-wrapper"]}>
          <p className={styles["form__content-wrapper__link-wrapper"]}>
            <Link
              to="/login"
              className={styles["form__content-wrapper__link-wrapper__link"]}
            >
              Already have an account?
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default Register;
