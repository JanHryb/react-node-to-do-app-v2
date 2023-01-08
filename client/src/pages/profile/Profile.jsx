import React from "react";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

function Profile({ user }) {
  return (
    <main className={styles["main"]}>
      <section className={styles["profile-wrapper"]}>
        <div className={styles["profile-wrapper__item"]}>
          <FontAwesomeIcon icon={faUserCircle} />
          <h1>profile</h1>
        </div>
      </section>
    </main>
  );
}

export default Profile;
