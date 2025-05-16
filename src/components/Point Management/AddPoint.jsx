import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddPoint.css";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

const AddPoint = () => {
  const navigate = useNavigate();

  // State for Add Point form
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionNo, setTransactionNo] = useState("");
  const [remarks, setRemarks] = useState("");

  // State for Transaction History filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [historyUser, setHistoryUser] = useState("");
  const [onlyAdmin, setOnlyAdmin] = useState("All");

  // State for users and loading status
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for transactions
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

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

  // Fetch users and transactions on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: getAuthHeaders(),
        });
        setUsers(response.data);
      } catch (err) {
        handleApiError(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      setTransactionsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/points/credit`, {
          headers: getAuthHeaders(),
        });
        // Save all transactions for later filtering
        setAllTransactions(response.data);
        // Initially, all transactions are displayed
        setTransactions(response.data);
        // Calculate total amount from the fetched transactions
        const total = response.data.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );
        setTotalAmount(total.toFixed(2));
      } catch (err) {
        handleApiError(err);
        setTransactionsError(err.message);
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchUsers();
    fetchTransactions();
  }, [navigate]);

  // Handle filtering on the frontend using the current filter states
  const handleSearch = () => {
    // Filter the transactions stored in allTransactions
    const filteredTransactions = allTransactions.filter((transaction) => {
      let match = true;

      // Filter by fromDate (assuming transaction.date is in ISO format, e.g., "2025-04-20")
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

      // Filter by user. We assume the transaction object has a "userId" property.
      if (historyUser) {
        if (transaction.userId !== parseInt(historyUser)) {
          match = false;
        }
      }

      // Filter by admin flag if required.
      // We assume transaction.createdBy is provided (e.g. "admin" for admin transactions).
      if (onlyAdmin !== "All") {
        const adminOnly = onlyAdmin === "Yes";
        if (adminOnly) {
          if (
            !transaction.createdBy ||
            transaction.createdBy.toLowerCase() !== "admin"
          ) {
            match = false;
          }
        } else {
          if (
            transaction.createdBy &&
            transaction.createdBy.toLowerCase() === "admin"
          ) {
            match = false;
          }
        }
      }

      return match;
    });

    setTransactions(filteredTransactions);

    // Recalculate the total amount for the filtered transactions
    const total = filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    setTotalAmount(total.toFixed(2));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedUser || !amount || !transactionNo || !remarks) {
      alert("Please fill all required fields");
      return;
    }

    const pointData = {
      addUserDTO: {
        id: parseInt(selectedUser),
      },
      amount: parseFloat(amount),
      transactionNo: transactionNo,
      remarks: remarks,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/points/add`,
        pointData,
        {
          headers: getAuthHeaders(),
        }
      );
      console.log("Point added successfully:", response.data);
      alert("Point added successfully!");

      // Reset form and refresh transactions
      setSelectedUser("");
      setAmount("");
      setTransactionNo("");
      setRemarks("");

      // Re-fetch all transactions (or update allTransactions state accordingly)
      const res = await axios.get(`${API_BASE_URL}/points/credit`, {
        headers: getAuthHeaders(),
      });
      setAllTransactions(res.data);
      setTransactions(res.data);
      const total = res.data.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      setTotalAmount(total.toFixed(2));
    } catch (err) {
      handleApiError(err);
      console.error("Error adding point:", err);
      alert(`Error adding point: ${err.message}`);
    }
  };

  // Get the selected user's balance (if such info exists in your users object)
  const getSelectedUserBalance = () => {
    const user = users.find((u) => u.id.toString() === selectedUser);
    return user && user.balance ? user.balance.toFixed(2) : "0.00";
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">Error loading users: {error}</div>;
  }

  return (
    <div className="add-point-transaction-container">
      {/* Add Point Section */}
      <div className="section-header add-point-header">
        <h2>Add Point</h2>
      </div>

      <div className="add-point-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="user">
              User <span className="required">*</span>
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.mobileNo}) - Balance:{" "}
                  {user.balance?.toFixed(2) || "0.00"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              Amount <span className="required">*</span>
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-control"
              required
              min="0"
              step="0.01"
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="transactionNo">
              Transaction No <span className="required">*</span>
            </label>
            <input
              type="text"
              id="transactionNo"
              value={transactionNo}
              onChange={(e) => setTransactionNo(e.target.value)}
              className="form-control"
              required
              placeholder="Enter transaction number"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="remarks">
              Remarks <span className="required">*</span>
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="form-control"
              required
              placeholder="Enter remarks"
              rows="2"
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-save" onClick={handleSave}>
            <i className="fa fa-floppy-o"></i> Save
          </button>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="section-header history-header">
        <h2>Transaction History</h2>
        <div className="total-amount">Total: ₹{totalAmount}</div>
      </div>

      <div className="transaction-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="fromDate">From Date</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control date-input"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="toDate">To Date</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control date-input"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="historyUser">User</label>
            <select
              id="historyUser"
              value={historyUser}
              onChange={(e) => setHistoryUser(e.target.value)}
              className="form-control"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.mobileNo})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="onlyAdmin">Only Admin</label>
            <select
              id="onlyAdmin"
              value={onlyAdmin}
              onChange={(e) => setOnlyAdmin(e.target.value)}
              className="form-control"
            >
              <option value="All">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <button className="btn btn-search" onClick={handleSearch}>
            <i className="fa fa-search"></i> Search
          </button>
          <button
            className="btn btn-reset"
            onClick={() => {
              setFromDate("");
              setToDate("");
              setHistoryUser("");
              setOnlyAdmin("All");
              setTransactions(allTransactions);
              const total = allTransactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0
              );
              setTotalAmount(total.toFixed(2));
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="transaction-table-container">
        {transactionsLoading ? (
          <div className="loading">Loading transactions...</div>
        ) : transactionsError ? (
          <div className="error">
            Error loading transactions: {transactionsError}
          </div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Entry Type</th>
                <th>User</th>
                <th>Mobile No</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Transaction No</th>
                <th>Remarks</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(transaction.date).toLocaleString()}</td>
                    <td>{transaction.entryType}</td>
                    <td>{transaction.userName}</td>
                    <td>{transaction.mobileNo}</td>
                    <td>₹{transaction.amount.toFixed(2)}</td>
                    <td>₹{transaction.balance?.toFixed(2) || "0.00"}</td>
                    <td>{transaction.transactionNo}</td>
                    <td>{transaction.remarks}</td>
                    <td>{transaction.createdBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddPoint;
