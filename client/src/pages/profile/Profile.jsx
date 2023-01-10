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
          <h3 className={styles["profile-wrapper__item__title-details"]}>
            Account details
          </h3>
        </div>
        <div className={styles["profile-wrapper__item"]}>
          <p className={styles["profile-wrapper__item__title"]}>Username</p>
          <p className={styles["profile-wrapper__item__description"]}>
            {user.username}
          </p>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className={styles["profile-wrapper__item__icon-edit"]}
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
          />
        </div>
        <div className={styles["profile-wrapper__item"]}>
          <p className={styles["profile-wrapper__item__title"]}>
            Email verification status
          </p>
          {user.verified ? (
            <p className={styles["profile-wrapper__item__description"]}>
              verified
            </p>
          ) : (
            <p className={styles["profile-wrapper__item__description"]}>
              not verified
            </p>
          )}
        </div>
        <div className={styles["profile-wrapper__item"]}>
          <p className={styles["profile-wrapper__item__title"]}>Password</p>
          <p className={styles["profile-wrapper__item__description"]}>
            ••••••••••••
          </p>
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
