import React from "react";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  return (
    <div className="transaction-history-container">
      <div className="transaction-history-header">
        <h2>Transaction History</h2>
        <span className="transaction-history-total">Total: 0.00</span>
      </div>

      <div className="transaction-history-filters">
        <div className="transaction-history-filter-group">
          <label>From Date</label>
          <input type="date" defaultValue="2025-04-17" />
        </div>

        <div className="transaction-history-filter-group">
          <label>To Date</label>
          <input type="date" defaultValue="2025-04-17" />
        </div>

        <div className="transaction-history-filter-group">
          <label>User</label>
          <select>
            <option>Select User</option>
          </select>
        </div>

        <button className="transaction-history-search-btn">Search</button>
      </div>

      <table className="transaction-history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Entry Type</th>
            <th>User</th>
            <th>Mobile No</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Paymode</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {/* Data rows can be added here */}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
