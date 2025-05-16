import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPointHistory.css";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

const AdminPointHistory = () => {
  const navigate = useNavigate();

  // State for filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // State for data
  const [pointHistory, setPointHistory] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return {};
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Handle API errors consistently
  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      navigate("/login");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(error.response?.data?.message || "Request failed");
  };

  // Format date to YYYY-MM-DD for API (if needed)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Fetch users and all transactions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users with authentication
        const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
          headers: getAuthHeaders(),
        });
        setUsers(usersResponse.data);

        // Fetch all credit transactions with authentication
        const transactionsResponse = await axios.get(
          `${API_BASE_URL}/points/credit`,
          { headers: getAuthHeaders() }
        );
        setAllTransactions(transactionsResponse.data);
        setPointHistory(transactionsResponse.data);

        // Calculate initial total
        const calculatedTotal = transactionsResponse.data.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        setTotal(calculatedTotal.toFixed(2));
      } catch (err) {
        handleApiError(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSearch = () => {
    // Filter the transactions stored in allTransactions
    const filteredTransactions = allTransactions.filter((transaction) => {
      let match = true;

      // Filter by fromDate
      if (fromDate) {
        const txnDate = new Date(transaction.date);
        const from = new Date(formatDateForAPI(fromDate));
        if (txnDate < from) match = false;
      }

      // Filter by toDate
      if (toDate) {
        const txnDate = new Date(transaction.date);
        const to = new Date(formatDateForAPI(toDate));
        if (txnDate > to) match = false;
      }

      // Filter by user
      if (selectedUser) {
        if (transaction.userId !== parseInt(selectedUser)) {
          match = false;
        }
      }

      return match;
    });

    setPointHistory(filteredTransactions);

    // Calculate total for filtered transactions
    const calculatedTotal = filteredTransactions.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    setTotal(calculatedTotal.toFixed(2));
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSelectedUser("");
    setPointHistory(allTransactions);
    const calculatedTotal = allTransactions.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    setTotal(calculatedTotal.toFixed(2));
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  if (error) {
    return <div className="error">Error loading data: {error}</div>;
  }

  return (
    <div className="admin-point-history">
      <div className="header">
        <h2>Admin Add Point History</h2>
        <div className="total">Total: ₹{total}</div>
      </div>

      <div className="filter-section">
        <div className="date-filter">
          <div className="filter-item">
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="filter-item">
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="user-filter">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="user-select"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.mobileNo})
              </option>
            ))}
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
              <th>Transaction No</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            {pointHistory.length > 0 ? (
              pointHistory.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(entry.date).toLocaleString()}</td>
                  <td>{entry.entryType}</td>
                  <td>{entry.userName}</td>
                  <td>{entry.mobileNo}</td>
                  <td>₹{entry.amount.toFixed(2)}</td>
                  <td>₹{entry.balance?.toFixed(2) || "0.00"}</td>
                  <td>{entry.paymode}</td>
                  <td>{entry.transactionNo}</td>
                  <td>{entry.createdBy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data">
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

export default AdminPointHistory;
