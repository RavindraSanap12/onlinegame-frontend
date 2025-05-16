import React, { useState } from "react";
import "./AutoPointAndHistory.css";

const AutoPointAndHistory = () => {
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pointHistory, setPointHistory] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSearch = () => {
    // Here you would typically fetch data from an API
    // This is a placeholder for demonstration
    console.log("Searching with:", { fromDate, toDate, selectedUser });

    // Sample data for demonstration
    const sampleData = [
      {
        id: 1,
        date: "04/16/2025",
        entryType: "Credit",
        user: "John Doe",
        mobileNo: "123-456-7890",
        amount: 50.0,
        balance: 150.0,
        paymode: "Online",
        createdBy: "Admin",
      },
      // Add more sample data as needed
    ];

    setPointHistory(sampleData);

    // Calculate total
    const calculatedTotal = sampleData.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    setTotal(calculatedTotal.toFixed(2));
  };

  return (
    <div className="admin-point-history">
      <div className="header">
        <h2>Auto Point Add History</h2>
        <div className="total">Total: {total}</div>
      </div>

      <div className="filter-section">
        <div className="date-filter">
          <div className="filter-item">
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="user-filter">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="user-select"
          >
            <option value="">Select User</option>
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
            {/* Add more users as needed */}
          </select>

          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="point-history-table">
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
            {pointHistory.length > 0 ? (
              pointHistory.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.date}</td>
                  <td>{entry.entryType}</td>
                  <td>{entry.user}</td>
                  <td>{entry.mobileNo}</td>
                  <td>{entry.amount.toFixed(2)}</td>
                  <td>{entry.balance.toFixed(2)}</td>
                  <td>{entry.paymode}</td>
                  <td>{entry.createdBy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutoPointAndHistory;
