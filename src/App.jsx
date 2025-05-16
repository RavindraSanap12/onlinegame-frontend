import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./header/Sidebar";
import Layout from "./header/Layout";
import Navbar from "./header/Navbar";
import LoginPage from "./header/LoginPage/LoginPage";
import React, { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          setUserData(JSON.parse(user));
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (responseData) => {
    if (responseData.token && responseData.user) {
      setIsLoggedIn(true);
      setUserData(responseData.user);
      localStorage.setItem("authToken", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Optional: Add API call to invalidate token on server
  };

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar onLogout={handleLogout} />
          <div className="main-content">
            <Navbar userData={userData} onLogout={handleLogout} />
            <Routes>
              <Route path="/*" element={<Layout />} />
            </Routes>
          </div>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
