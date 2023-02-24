import React, { useState, useEffect } from "react";
import styles from "./Category.module.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faXmarkCircle,
  faPencil,
  faClipboardList, // use if for all category(for all tasks)
  faHeart,
  faSchool,
  faWallet,
  faBook,
  faBriefcase,
  faUserGroup,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(
  faHeart,
  faSchool,
  faWallet,
  faBook,
  faBriefcase,
  faUserGroup,
  faHouse,
  faPencil
);

function Category() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // TODO: post reqest to the server
    console.log(new URLSearchParams(location.search).get("name"));
  });

  return (
    <>
      <main className={styles["main"]}>
        {/* TODO: display all tasks form category etc. */}
      </main>
    </>
  );
}

export default Category;
