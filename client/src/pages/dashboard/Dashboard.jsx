import React from "react";
import styles from "./Dashboard.module.css";
import { format } from "date-fns";

function Dashboard({ user }) {
  const currentDate = format(new Date(), "eeee, d MMM");

  return (
    <main className={styles["main"]}>
      <h1>hello {user.username}</h1>
      <p>{currentDate}</p>
    </main>
  );
}

export default Dashboard;
