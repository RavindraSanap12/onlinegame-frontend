import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Sidebar.css";
import { FaGamepad } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa";
import {
  FaCloudUploadAlt,
  FaMinus,
  FaChartBar,
  FaImage,
  FaBell,
} from "react-icons/fa";
const Sidebar = ({ onLogout }) => {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [heights, setHeights] = useState({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const dropdownRefs = {
    market: useRef(null),
    withdrawal: useRef(null),
    applicationUsers: useRef(null),
    pointManagement: useRef(null),
    declareResults: useRef(null),
    gameRate: useRef(null),
    uploadOldChart: useRef(null),
    reports: useRef(null),
    banners: useRef(null),
    notice: useRef(null),
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };
  const toggleDropdown = (menu, event) => {
    if (event) createRipple(event);

    // Force recalculate height every time
    if (dropdownRefs[menu]?.current) {
      const items = dropdownRefs[menu].current.querySelectorAll("li");
      const itemHeight = items[0]?.offsetHeight || 40; // Fallback
      setHeights((prev) => ({
        ...prev,
        [menu]: items.length * itemHeight,
      }));
    }

    setActiveDropdown(activeDropdown === menu ? null : menu);

    // 🔽 Navigate to the "Running Game" page
    if (menu === "runningGame") {
      navigate("/running-game");
    } else if (menu === "notice") {
      navigate("/notification-list");
    } else if (menu === "banners") {
      navigate("/banners");
    }
  };

  return (
    <nav id="sidebar" className="sidebar">
      <div className="sidebar-sticky">
        <div className="sidebar-header">
          <i className="bi bi-speedometer2 me-2"></i>
          <span>Dashboard</span>
        </div>

        <ul className="nav flex-column">
          {/* Dashboard */}
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className="nav-link"
              activeClassName="active"
              onClick={createRipple}
            >
              <i className="bi bi-house me-2"></i>
              Dashboard
            </NavLink>
          </li>

          {/* App Setting */}
          <li className="nav-item">
            <NavLink
              to="/app-setting"
              className="nav-link"
              activeClassName="active"
              onClick={createRipple}
            >
              <i className="bi bi-gear me-2"></i>
              App Setting
            </NavLink>
          </li>

          {/* Market Dropdown */}
          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("market", e)}
            >
              <span>
                <i className="bi bi-graph-up me-2"></i>
                Market
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "market"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-container ${
                activeDropdown === "market" ? "open" : ""
              }`}
              style={{
                height:
                  activeDropdown === "market" ? `${heights.market}px` : "0px",
              }}
              ref={dropdownRefs.market}
            >
              <ul>
                <li>
                  <NavLink
                    to="/main-market"
                    className="dropdown-item"
                    activeClassName="active"
                  >
                    <i className="bi bi-shop me-2"></i>
                    Main Market
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/delhi-market"
                    className="dropdown-item"
                    activeClassName="active"
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    Delhi Market
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/starline-market"
                    className="dropdown-item"
                    activeClassName="active"
                  >
                    <i className="bi bi-stars me-2"></i>
                    Starline
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("withdrawal", e)}
            >
              <span>
                <i className="bi bi-cash-coin me-2"></i>
                Withdrawal
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "withdrawal"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-container ${
                activeDropdown === "withdrawal" ? "open" : ""
              }`}
              style={{
                height:
                  activeDropdown === "withdrawal"
                    ? `${heights.withdrawal}px`
                    : "0px",
              }}
              ref={dropdownRefs.withdrawal}
            >
              <ul>
                <li>
                  <NavLink
                    to="/withdrawal-list/pending"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-hourglass-split me-2"></i>
                    Pending
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/withdrawal-list/completed"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Completed
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/withdrawal-list/rejected"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Rejected
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
          {/* Updated Application Users Dropdown */}
          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("applicationUsers", e)}
            >
              <span>
                <i className="bi bi-people me-2"></i>
                Application Users
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "applicationUsers"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-container ${
                activeDropdown === "applicationUsers" ? "open" : ""
              }`}
              style={{
                height:
                  activeDropdown === "applicationUsers"
                    ? `${heights.applicationUsers}px`
                    : "0px",
              }}
              ref={dropdownRefs.applicationUsers}
            >
              <ul>
                <li>
                  <NavLink
                    to="/add-user"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create User
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/users-list"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    Users List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/users-wallet-balance"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-wallet me-2"></i>
                    Users Wallet Balance
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/active-users"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-person-check me-2"></i>
                    Active Users List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blocked-users"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-person-x me-2"></i>
                    Blocked Users List
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Point Management Dropdown */}
          <li className="nav-item">
            <div
              className={`nav-link d-flex justify-content-between align-items-center ${
                activeDropdown === "pointManagement" ? "active-dropdown" : ""
              }`}
              onClick={(e) => toggleDropdown("pointManagement", e)}
            >
              <span>
                <i className="bi bi-award me-2"></i>
                Point Management
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "pointManagement"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-container ${
                activeDropdown === "pointManagement" ? "open" : ""
              }`}
              style={{
                height:
                  activeDropdown === "pointManagement"
                    ? `${heights.pointManagement}px`
                    : "0px",
              }}
              ref={dropdownRefs.pointManagement}
            >
              <ul>
                <li>
                  <NavLink
                    to="/add-point"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Point
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/deduct-point"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-dash-circle me-2"></i>
                    Deduct Point
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/users-wallet-balance"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-wallet me-2"></i>
                    Users Wallet Balance
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin-point-history"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Admin Add Point History
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/auto-point-history"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-robot me-2"></i>
                    Auto Point Add History
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Updated Declare Results Dropdown */}
          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("declareResults", e)}
            >
              <span>
                <i className="bi bi-megaphone me-2"></i>
                Declare Results
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "declareResults"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-container ${
                activeDropdown === "declareResults" ? "open" : ""
              }`}
              style={{
                height:
                  activeDropdown === "declareResults"
                    ? `${heights.declareResults}px`
                    : "0px",
              }}
              ref={dropdownRefs.declareResults}
            >
              <ul>
                <li>
                  <NavLink
                    to="/main-result-upload"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-shop me-2"></i>
                    Main Market
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/delhi-result-upload"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    Delhi Market
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/starline-result-upload"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <i className="bi bi-stars me-2"></i>
                    Starline
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Updated Running Games Dropdown */}
          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("runningGame", e)}
            >
              <span className="d-flex align-items-center">
                <FaGamepad className="me-2" />
                Running Game
              </span>
            </div>
          </li>

          {/* Updated Game Rate Dropdown */}
          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("gameRate", e)} // toggles the dropdown state
            >
              <span className="d-flex align-items-center">
                <FaRupeeSign className="me-2" />
                Game Rate
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "gameRate"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-container ${
                activeDropdown === "gameRate" ? "open" : ""
              }`} // add 'open' class when active
              style={{
                maxHeight:
                  activeDropdown === "gameRate"
                    ? `${heights.gameRate}px`
                    : "0px", // maxHeight for smooth transition
                overflow: "hidden", // Hide content when collapsed
                transition: "max-height 0.3s ease-out", // add transition for smooth collapse/expand
              }}
              ref={dropdownRefs.gameRate}
            >
              <ul>
                {/* <li>
                  <NavLink
                    to="/game-wise-rate"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Game Wise Rate
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    to="/all-game-rate"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    All Game Rate
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item">
            {/* Toggle Button */}
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("uploadOldChart", e)}
            >
              <span className="d-flex align-items-center">
                <FaCloudUploadAlt className="me-2" />
                Upload Old Chart
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "uploadOldChart"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>

            {/* Dropdown Content */}
            <div
              className={`dropdown-container ${
                activeDropdown === "uploadOldChart" ? "open" : ""
              }`}
              style={{
                maxHeight:
                  activeDropdown === "uploadOldChart"
                    ? `${heights.uploadOldChart}px`
                    : "0px",
                overflow: "hidden",
                transition: "max-height 0.3s ease-out",
              }}
              ref={dropdownRefs.uploadOldChart}
            >
              <ul>
                <li>
                  <NavLink
                    to="/main-market-upload-chart"
                    className={({ isActive }) =>
                      `dropdown-item ${isActive ? "active" : ""}`
                    }
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Main Market
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/main-market-upload-chart"
                    className={({ isActive }) =>
                      `dropdown-item ${isActive ? "active" : ""}`
                    }
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Delhi Market
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/starline-marketing"
                    className={({ isActive }) =>
                      `dropdown-item ${isActive ? "active" : ""}`
                    }
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Starline Market
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <NavLink
              to="/digit-amounts"
              className="nav-link"
              activeClassName="active"
              onClick={createRipple}
            >
              <FaChartPie className="me-2" />
              Digit Amounts
            </NavLink>
          </li>

          {/* Updated Report */}
          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("reports", e)} // toggles the dropdown state
            >
              <span className="d-flex align-items-center">
                <FaChartBar className="me-2" />
                Report
              </span>
              <i
                className={`toggle-icon bi ${
                  activeDropdown === "reports"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                }`}
              ></i>
            </div>
            <div
              className={`dropdown-container ${
                activeDropdown === "reports" ? "open" : ""
              }`} // add 'open' class when active
              style={{
                maxHeight:
                  activeDropdown === "reports" ? `${heights.reports}px` : "0px", // maxHeight for smooth transition
                overflow: "hidden", // Hide content when collapsed
                transition: "max-height 0.3s ease-out", // add transition for smooth collapse/expand
              }}
              ref={dropdownRefs.reports}
            >
              <ul>
                <li>
                  <NavLink
                    to="/bid-analysis"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Bid Analysis
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/transation-history"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Transaction History
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user-biding-report"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    User Biding Report
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/winning-users-page"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Winners History
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/member-analysis"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Member Analysis
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/payment-mode-wise-collection"
                    className="dropdown-item"
                    activeClassName="active"
                    onClick={createRipple}
                  >
                    <FaMinus className="me-2" />
                    Paymode Wise Collection
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("banners", e)}
            >
              <span className="d-flex align-items-center">
                <FaImage className="me-2" />
                Banners
              </span>
            </div>
          </li>

          <li className="nav-item">
            <div
              className="nav-link d-flex justify-content-between align-items-center"
              onClick={(e) => toggleDropdown("notice", e)}
            >
              <span className="d-flex align-items-center">
                <FaBell className="me-2" />
                Notice
              </span>
            </div>
          </li>
          {showLogoutConfirm && (
            <div className="logout-confirmation-overlay">
              <div className="logout-confirmation-box">
                <div className="confirmation-header">
                  <FaSignOutAlt className="me-2" />
                  <h5>Confirm Logout</h5>
                </div>
                <div className="confirmation-body">
                  <p>Are you sure you want to logout?</p>
                </div>
                <div className="confirmation-footer">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={cancelLogout}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={confirmLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
          <li className="nav-item logout-item">
            <div
              className="nav-link d-flex align-items-center"
              onClick={handleLogoutClick}
              style={{ cursor: "pointer" }}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
