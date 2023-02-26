import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import RequireAuth from "./components/auth/RequireAuth";
import ForwardAuth from "./components/auth/ForwardAuth";
import Dashboard from "./pages/dashboard/Dashboard";
import Category from "./pages/category/Category";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound from "./pages/notFound/NotFound";
import Profle from "./pages/profile/Profile";
import axios from "axios";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
// import { ClipLoader } from "react-spinners";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  let location = useLocation();

  useEffect(() => {
    axios
      .get("user", { baseURL: "http://localhost:5000/", withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
      })
      .finally(() => {
        setLoading(true);
      });
  }, [location]);

  return (
    <>
      {loading ? (
        <>
          <div className="container">
            <ToastContainer />
            <Navbar user={user} />
            <Routes>
              <Route element={<RequireAuth user={user} />}>
                <Route path="/" element={<Dashboard user={user} />}></Route>
                <Route
                  path="/dashboard"
                  element={<Navigate to="/" replace />}
                ></Route>
                <Route
                  path="/category"
                  element={<Category user={user} />}
                ></Route>
                <Route path="/profile" element={<Profle user={user} />}></Route>
              </Route>
              <Route element={<ForwardAuth user={user} />}>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
              </Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </div>
          <Footer />
        </>
      ) : (
        <>{/* <ClipLoader color="#36d7b7" /> */}</>
      )}
    </>
  );
}

export default App;
