import React from "react";
import styles from "./Profile.module.css";

function Profile({ user }) {
  return (
    <div>
      <h1>hello {user.username}</h1>
    </div>
  );
}

export default Profile;
