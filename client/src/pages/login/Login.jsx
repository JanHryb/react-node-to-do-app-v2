import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import { Input, Checkbox, Button } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
    server: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    if (email && password) {
      let validForm = true;
      let errorMessages = {
        email: "",
        password: "",
        server: "",
      };
      if (email.indexOf(" ") >= 0) {
        validForm = false;
        errorMessages.email = "email can't contain space";
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRememberChange = (e) => {
    if (e.target.checked) {
      setRemember(true);
    } else {
      setRemember(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post(
          "user/login",
          { email, password, remember },
          { baseURL: "http://localhost:5000/", withCredentials: true }
        )
        .then((res) => {
          //TODO:
          // console.log(res);
          // localStorage.setItem("authenticated", true);
          navigate("/profile");
        })
        .catch((err) => {
          if (err.response.status !== 500) {
            console.log(err.response.data);
            setErrorMessages(err.response.data);
          }
        });
    }
  };

  useEffect(() => {
    const successRegisterMessage = localStorage.getItem(
      "successRegisterMessage"
    );
    if (successRegisterMessage) {
      toast.success(successRegisterMessage, {
        toastId: "successRegisterMessage1",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      localStorage.removeItem("successRegisterMessage");
    }
  }, []);

  return (
    <main className={styles["main"]}>
      <form className={styles["form"]} onSubmit={handleSubmit}>
        <header className={styles["form__content-wrapper"]}>
          <h1 className={styles["form__content-wrapper__header"]}>
            Welcome back
          </h1>
        </header>
        <div className={styles["form__content-wrapper"]}>
          {errorMessages.server ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              email - {errorMessages.server}
            </p>
          ) : (
            <></>
          )}
          {errorMessages.email ? (
            <p className={styles["form__content-wrapper__error-message"]}>
              email - {errorMessages.email}
            </p>
          ) : (
            <></>
          )}
          <Input
            type="email"
            placeholder="Email"
            variant="flushed"
            className={styles["form__content-wrapper__input"]}
            required
            onChange={handleEmailChange}
            value={email}
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
          <Input
            type="password"
            placeholder="Password"
            variant="flushed"
            className={styles["form__content-wrapper__input"]}
            required
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <div className={styles["form__content-wrapper"]}>
          <Checkbox onClick={handleRememberChange}>Remember me</Checkbox>
        </div>

        <div className={styles["form__content-wrapper"]}>
          <Button
            colorScheme="blue"
            className={styles["form__content-wrapper__button"]}
            type="submit"
          >
            Login
          </Button>
        </div>
        <div className={styles["form__content-wrapper"]}>
          <p className={styles["form__content-wrapper__link-wrapper"]}>
            Need an account?
            <Link
              to="/register"
              className={styles["form__content-wrapper__link-wrapper__link"]}
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default Login;
