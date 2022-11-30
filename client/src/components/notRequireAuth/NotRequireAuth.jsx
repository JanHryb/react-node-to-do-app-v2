import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function NotRequireAuth({ user }) {
  if (!user) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
}

export default NotRequireAuth;
