import React, { useState, useEffect } from "react";
import "./UsersWalletBalance.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const UsersWalletBalance = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAmount("");
    setSelectedUser("");
  };

  const handleSubmit = () => {
    console.log("Submitting:", { selectedUser, amount });
    handleCloseModal();
  };

  // Calculate summary values from users data
  const calculateSummary = () => {
    const summary = {
      totalCredit: 0,
      totalWin: 0,
      totalDebit: 0,
      totalWithdraw: 0,
      totalBalance: 0,
      totalPNL: 0,
    };

    users.forEach((user) => {
      // Note: Adjust these calculations based on your actual API data structure
      summary.totalCredit += user.amount > 0 ? user.amount : 0;
      summary.totalDebit += user.amount < 0 ? Math.abs(user.amount) : 0;
      summary.totalWithdraw += user.totalWithdrawalAmount || 0;
      summary.totalBalance += user.amount || 0;
    });

    return [
      {
        title: "Total Credit Amount",
        value: `₹ ${summary.totalCredit.toFixed(2)}`,
        color: "green",
      },
      {
        title: "Total Win Amount",
        value: `₹ ${summary.totalWin.toFixed(2)}`,
        color: "green",
      },
      {
        title: "Total Debit Amount",
        value: `₹ ${summary.totalDebit.toFixed(2)}`,
        color: "red",
      },
      {
        title: "Total Withdraw Amount",
        value: `₹ ${summary.totalWithdraw.toFixed(2)}`,
        color: "red",
      },
      {
        title: "Total Balance Amount",
        value: `₹ ${summary.totalBalance.toFixed(2)}`,
        color: "blue",
      },
      {
        title: "Total Profit Loss Amount",
        value: `₹ ${summary.totalPNL.toFixed(2)}`,
        color: "gray",
      },
    ];
  };

  const summaryBoxes = calculateSummary();

  if (loading) {
    return (
      <div className="wallet-balance-container">Loading users data...</div>
    );
  }

  if (error) {
    return <div className="wallet-balance-container">Error: {error}</div>;
  }

  return (
    <div className="wallet-balance-container">
      <div className="header">
        <span>Users Wallet Balance</span>
      </div>

      <div className="summary-boxes">
        {summaryBoxes.map((box, index) => (
          <div key={index} className={`summary-box ${box.color}`}>
            <div className="amount">{box.value}</div>
            <div className="title">{box.title}</div>
          </div>
        ))}
      </div>

      <div className="table-controls">
        <div className="entries-control">
          Show
          <select defaultValue="50">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
          entries
        </div>
        <div className="search-control">
          Search: <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Mobile No.</th>
              <th>Password</th>
              <th>Total Cr</th>
              <th>Total Win</th>
              <th>Total Dr</th>
              <th>Total Withdraw</th>
              <th>Balance</th>
              <th>P&L</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.mobileNo}</td>
                <td>{user.password ? "******" : ""}</td>
                <td className="money">
                  {user.amount > 0 ? `₹ ${user.amount.toFixed(2)}` : "₹ 0.00"}
                </td>
                <td className="money">₹ 0.00</td>{" "}
                {/* Placeholder for Win amount */}
                <td className="money">
                  {user.amount < 0
                    ? `₹ ${Math.abs(user.amount).toFixed(2)}`
                    : "₹ 0.00"}
                </td>
                <td className="money">
                  {user.totalWithdrawalAmount
                    ? `₹ ${user.totalWithdrawalAmount.toFixed(2)}`
                    : "₹ 0.00"}
                </td>
                <td className="money">
                  {user.amount ? `₹ ${user.amount.toFixed(2)}` : "₹ 0.00"}
                </td>
                <td className="money">₹ 0.00</td> {/* Placeholder for P&L */}
                <td className="action-buttons">
                  <button
                    className="history-button"
                    onClick={() => navigate("/transaction-history")}
                    title="View History"
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  <button
                    className="transfer-button"
                    title="Transfer Money"
                    onClick={() => {
                      setSelectedUser(user.id.toString());
                      handleOpenModal();
                    }}
                  >
                    <i className="fa fa-inr"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add/Deduct Point</h3>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="modal-select"
                >
                  <option value="">Select</option>
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Please enter amount"
                  className="modal-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-button-text" onClick={handleCloseModal}>
                Close
              </button>
              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersWalletBalance;
