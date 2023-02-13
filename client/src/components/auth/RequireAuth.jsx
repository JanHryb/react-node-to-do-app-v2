import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ user }) {
  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
}

export default RequireAuth;
