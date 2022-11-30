import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ user }) {
  let location = useLocation();

  if (!user) {
    if (location.state !== null) {
      if (location.state.successfulLogin) {
        return <Outlet />;
      }
    }
    return <Navigate to="/login" />; //state={{ from: location }}
  } else {
    return <Outlet />;
  }
}

export default RequireAuth;
