import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Navbar({ user }) {
  const navigate = useNavigate();

  const logout = () => {
    axios
      .post(
        "user/logout",
        {},
        { baseURL: "http://localhost:5000/", withCredentials: true }
      )
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => {});
  };

  return (
    <nav className={styles["navbar"]}>
      <div className={styles["navbar__logo-wrapper"]}>
        <Link to="/" className={styles["navbar__logo-wrapper__link"]}>
          <FontAwesomeIcon
            icon={faCalendarCheck}
            className={styles["navbar__logo-wrapper__link__logo"]}
          />
        </Link>
      </div>
      <ul className={styles["navbar__menu"]}>
        <li className={styles["navbar__menu__item"]}>
          <Link to="/" className={styles["navbar__menu__item__link"]}>
            Dashboard
          </Link>
        </li>
        {user ? (
          <li
            className={`${styles["navbar__menu__item"]} ${styles["navbar__menu__item-user"]}`}
          >
            <Link
              to="/profile"
              className={`${styles["navbar__menu__item__link"]} ${styles["navbar__menu__item__link--profile"]}`}
            >
              <FontAwesomeIcon icon={faUser} />
            </Link>
            <ul className={styles["navbar__menu__item-user__dropdown-menu"]}>
              <li
                className={
                  styles["navbar__menu__item-user__dropdown-menu__item"]
                }
              >
                <Link
                  to="/profile"
                  className={
                    styles["navbar__menu__item-user__dropdown-menu__item__link"]
                  }
                >
                  Profile
                </Link>
              </li>
              <li
                className={
                  styles["navbar__menu__item-user__dropdown-menu__item"]
                }
              >
                <button
                  onClick={logout}
                  className={
                    styles[
                      "navbar__menu__item-user__dropdown-menu__item__button"
                    ]
                  }
                >
                  Log out
                </button>
              </li>
            </ul>
          </li>
        ) : (
          <li className={styles["navbar__menu__item"]}>
            <Link
              to="/login"
              className={`${styles["navbar__menu__item__link"]} ${styles["navbar__menu__item__link--button"]}`}
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
