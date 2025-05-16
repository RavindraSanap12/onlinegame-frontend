// App.jsx
import React, { useState } from "react";
import "./TransactionHistory.css";
import { useNavigate } from "react-router-dom";

const TransactionHistory = () => {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState("04/16/2025");
  const [toDate, setToDate] = useState("04/16/2025");
  const [entries, setEntries] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data stats
  const stats = {
    totalCredit: 0,
    totalWin: 0,
    totalDebit: 0,
    totalWithdraw: 0,
    currentBalance: 357525.0,
  };

  // No transaction data available in this example
  const transactionData = [];

  return (
    <div className="transaction-history-container">
      <div className="header">
        <h1>Test Transaction History</h1>
        <button
          className="back-btn"
          onClick={() => navigate("/users-wallet-balance")}
        >
          <span className="back-arrow">←</span> Back to List
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <p className="stat-amount">₹ {stats.totalCredit}</p>
          <p className="stat-label">Total Credit Amount</p>
        </div>
        <div className="stat-box">
          <p className="stat-amount">₹ {stats.totalWin}</p>
          <p className="stat-label">Total Win Amount</p>
        </div>
        <div className="stat-box">
          <p className="stat-amount">₹ {stats.totalDebit}</p>
          <p className="stat-label">Total Debit Amount</p>
        </div>
        <div className="stat-box">
          <p className="stat-amount">₹ {stats.totalWithdraw}</p>
          <p className="stat-label">Total Withdraw Amount</p>
        </div>
        <div className="stat-box">
          <p className="stat-amount">₹ {stats.currentBalance.toFixed(2)}</p>
          <p className="stat-label">Current Balance Amount</p>
        </div>
      </div>

      <div className="filter-container">
        <div className="date-filters">
          <div className="date-field">
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="date-field">
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button className="search-btn">Search</button>
          <div className="entries-selector">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
          <div className="search-box">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Particular</th>
              <th>Paymode</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Entry Type</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No data available in table
                </td>
              </tr>
            ) : (
              transactionData.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.particular}</td>
                  <td>{transaction.paymode}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.balance}</td>
                  <td>{transaction.entryType}</td>
                  <td>{transaction.createdBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="showing-entries">Showing 0 to 0 of 0 entries</div>
        <div className="page-controls">
          <button className="page-btn" disabled>
            Previous
          </button>
          <button className="page-btn" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
