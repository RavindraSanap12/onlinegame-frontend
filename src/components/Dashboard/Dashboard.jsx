import React, { useState } from "react";
import "./Dashboard.css";
import { NavLink } from "react-router-dom";
import SearchUserModal from "../SearchUserModal/SearchUserModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleSearch = () => {
    console.log("Searching...");
    handleModalClose();
  };
  return (
    <div className="dashboard-container">
      <div className="top-cards">
        <div className="amount-card">
          <div className="icon-container blue">
            <div className="icon-wrapper">
              <i className="icon briefcase"></i>
            </div>
          </div>
          <div className="amount-info">
            <div className="amount">₹ 0</div>
            <div className="label">Today Played Amount</div>
          </div>
        </div>

        <div className="amount-card">
          <div className="icon-container green">
            <div className="icon-wrapper">
              <i className="icon briefcase"></i>
            </div>
          </div>
          <div className="amount-info">
            <div className="amount">₹ 0</div>
            <div className="label">Today Winning Amount</div>
          </div>
        </div>
      </div>

      {/* Grid Items */}
      <div className="grid-container">
        {/* Row 1 */}
        <NavLink
          to="/app-setting"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item orange">
            <div className="icon settings"></div>
            <div className="text">App Setting</div>
          </div>
        </NavLink>

        <NavLink to="/users-list" className="nav-link" activeClassName="active">
          <div className="grid-item blue">
            <div className="icon users"></div>
            <div className="text">Total App Users</div>
          </div>
        </NavLink>

        <NavLink
          to="/withdrawal-list/pending"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item teal">
            <div className="icon document"></div>
            <div className="text">Pending Withdrawal</div>
          </div>
        </NavLink>

        <NavLink
          to="/withdrawal-list/completed"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item red">
            <div className="icon document"></div>
            <div className="text">Complete Withdrawal</div>
          </div>
        </NavLink>

        <NavLink
          to="/withdrawal-list/rejected"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item orange">
            <div className="icon document"></div>
            <div className="text">Rejected Withdrawal</div>
          </div>
        </NavLink>

        <NavLink
          to="/transaction-history"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item green">
            <div className="icon card"></div>
            <div className="text">Transaction History</div>
          </div>
        </NavLink>

        <NavLink
          to="/winning-users-page"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item brown">
            <div className="icon hash"></div>
            <div className="text">Winners History</div>
          </div>
        </NavLink>

        <NavLink
          to="/bid-analysis"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item purple">
            <div className="icon chart"></div>
            <div className="text">Running Games</div>
          </div>
        </NavLink>

        <NavLink
          to="/new-user-tables"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item navy">
            <div className="icon user"></div>
            <div className="text">New Players</div>
          </div>
        </NavLink>

        <NavLink to="/add-point" className="nav-link" activeClassName="active">
          <div className="grid-item blue">
            <div className="icon rupee"></div>
            <div className="text">Add User Point</div>
          </div>
        </NavLink>
        {/* ✅ Modal trigger without page refresh */}
        <div className="grid-item teal nav-link" onClick={handleModalOpen}>
          <div className="icon dollar"></div>
          <div className="text">Add Withdraw</div>
        </div>

        <NavLink
          to="/main-result-upload"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item green">
            <div className="icon market-result-icon"></div>
            <div className="text">Declare Main Market Result</div>
          </div>
        </NavLink>

        {/* Row 3 */}

        <NavLink
          to="/delhi-result-upload"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item blue-gradient">
            <div className="icon market-result-icon"></div>
            <div className="text">Declare Delhi Market Result</div>
          </div>
        </NavLink>

        <NavLink
          to="/starline-result-upload"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item dark-red">
            <div className="icon market-result-icon"></div>
            <div className="text">Declare Starline Market Result</div>
          </div>
        </NavLink>

        <NavLink
          to="/blocked-users"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item orange">
            <div className="icon blocked"></div>
            <div className="text">Blocked List</div>
          </div>
        </NavLink>

        <NavLink
          to="/main-market"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item teal">
            <div className="icon settings"></div>
            <div className="text">Game Setting</div>
          </div>
        </NavLink>

        <NavLink
          to="/notification-list"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item dark-red">
            <div className="icon bell"></div>
            <div className="text">Send Notice</div>
          </div>
        </NavLink>

        <NavLink
          to="/game-wise-rate"
          className="nav-link"
          activeClassName="active"
        >
          <div className="grid-item brown">
            <div className="icon dollar"></div>
            <div className="text">Change Rates</div>
          </div>
        </NavLink>
      </div>
      {isModalOpen && (
        <SearchUserModal onClose={handleModalClose} onSearch={handleSearch} />
      )}
    </div>
  );
};

export default Dashboard;
