import React from "react";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function Profile({ user }) {
  //TODO:
  return (
    <main className={styles["main"]}>
      <section className={styles["profile-wrapper"]}>
        <div className={styles["profile-wrapper__item"]}>
          <FontAwesomeIcon
            icon={faUserCircle}
            className={styles["profile-wrapper__item__icon-profile"]}
          />
          <h1 className={styles["profile-wrapper__item__title-username"]}>
            {user.username}
          </h1>
        </div>
        <div className={styles["profile-wrapper__item"]}>
          <h2 className={styles["profile-wrapper__item__title-details"]}>
            Account details
          </h2>
        </div>
        <div className={styles["profile-wrapper__item"]}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className={styles["profile-wrapper__item__icon-edit"]}
          />
        </div>
      </section>
    </main>
  );
}

export default Profile;
