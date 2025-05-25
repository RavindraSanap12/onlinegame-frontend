import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./header/Layout";
import React, { useState, useEffect } from "react";
import LoginPageUser from "./components/Login_And_Register/Loginpage";

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
  };

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <LoginPageUser onLogin={handleLogin} />
      ) : (
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
