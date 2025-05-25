import React, { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage when component mounts
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Default values if userData isn't available yet
  const userName = userData?.name || "Admin User";
  const avatarInitial = userName.charAt(0).toUpperCase();

  return (
    <div>
      <nav className="top-navbar">
        <div className="navbar-left">
          <button className="menu-toggle">
            <i className="menu-icon"></i>
          </button>
          <h2 className="page-title">Dashboard</h2>
        </div>
        <div className="navbar-right">
          <div className="user-profile">
            <div className="user-avatar">{avatarInitial}</div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">Admin</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;