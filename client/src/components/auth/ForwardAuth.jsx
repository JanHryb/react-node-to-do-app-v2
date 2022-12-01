import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function ForwardAuth({ user }) {
  if (!user) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
}

export default ForwardAuth;
