import React, { useState, useEffect } from "react";
import "./WithdrawalListCompleted.css";
import { API_BASE_URL2 } from "../api";

const WithdrawalListCompleted = () => {
  // State for search dates
  const [fromDate, setFromDate] = useState("2025-04-16");
  const [toDate, setToDate] = useState("2025-04-16");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawalList, setWithdrawalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const collectionAmount = "₹ 0/-";

  // Fetch completed withdrawals
  useEffect(() => {
    const fetchCompletedWithdrawals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL2}/withdrawals/completed`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWithdrawalList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedWithdrawals();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    console.log("Searching between", fromDate, "and", toDate);
    // Here you would typically fetch filtered data based on the date range
  };

  // Format date from "YYYY-MM-DD" to "DD/MM/YYYY"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="withdrawal-list-container">
      {/* Top section with search and collection amount */}
      <div className="top-section">
        {/* Search By Date Panel */}
        <div className="panel search-panel">
          <div className="panel-header">Search By Date</div>
          <div className="panel-content">
            <div className="date-search-container">
              <div className="date-field">
                <label>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <div className="date-field">
                <label>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Collection Amount Panel */}
        <div className="panel collection-panel">
          <div className="panel-header">Collection Amount</div>
          <div className="panel-content">
            <div className="amount-display">{collectionAmount}</div>
          </div>
        </div>
      </div>

      {/* Complete Withdrawal List Panel */}
      <div className="panel withdrawal-panel">
        <div className="panel-header">Complete Withdrawal Request</div>
        <div className="panel-content">
          {/* Table Controls */}
          <div className="table-controls">
            <div className="entries-control">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="search-control">
              <span>Search:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
              />
            </div>
          </div>

          {/* Withdrawal Table */}
          <div className="table-container">
            {loading ? (
              <div className="loading-message">Loading data...</div>
            ) : error ? (
              <div className="error-message">Error: {error}</div>
            ) : (
              <table className="withdrawal-table">
                <thead>
                  <tr>
                    <th className="column-hash">#</th>
                    <th className="column-date">Date</th>
                    <th className="column-name">Name</th>
                    <th className="column-mobile">Mobile No.</th>
                    <th className="column-amount">Amount</th>
                    <th className="column-balance">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalList.length > 0 ? (
                    withdrawalList.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.addUserDTO?.name || "N/A"}</td>
                        <td>{item.addUserDTO?.mobileNo || "N/A"}</td>
                        <td>₹ {item.amount.toFixed(2)}/-</td>
                        <td>
                          ₹ {item.addUserDTO?.amount?.toFixed(2) || "0.00"}/-
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="no-data-row">
                      <td colSpan="6">No completed withdrawals available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          <div className="table-footer">
            <div className="showing-entries">
              Showing {withdrawalList.length > 0 ? 1 : 0} to{" "}
              {withdrawalList.length} of {withdrawalList.length} entries
            </div>
            <div className="pagination">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalListCompleted;
