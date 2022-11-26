import React from "react";
import styles from "./Footer.module.css";

function Footer() {
  const date = new Date().getFullYear();
  return (
    <footer className={styles["footer"]}>
      <p>Copyright &copy; {date} || All rights reserved</p>
    </footer>
  );
}

export default Footer;
