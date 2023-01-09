import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <main className={styles["main"]}>
      <h1 className={styles["title"]}>Oops!</h1>
      <h2 className={styles["title-description"]}>404 - Page Not Found</h2>
      <Link to="/" className={styles["link"]}>
        Go To Homepage
      </Link>
    </main>
  );
}

export default NotFound;
