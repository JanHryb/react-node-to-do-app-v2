import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faUser } from "@fortawesome/free-solid-svg-icons";

function Navbar({ user }) {
  const [iconColor, setIconColor] = useState("#fff");

  const handleMouseEnter = () => {
    setIconColor("#7978ff");
  };

  const handleMouseLeave = () => {
    setIconColor("#fff");
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
              className={styles["navbar__menu__item__link"]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: iconColor, transition: "color 0.2s" }}
              />
            </Link>
            <ul
              className={styles["navbar__menu__item-user__dropdown-menu"]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
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
