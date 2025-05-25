import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Add_Funds/coustomstyle.css";
import logonew from "../Withdraw/logonew.jpeg";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_BASE_URL2 } from "../api";

const WithdrawalForm = () => {
  const [amount, setAmount] = useState("");
  const [payType, setPayType] = useState("");
  const [walletAmount, setWalletAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ id: "" });
  const navigate = useNavigate();

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get payment method display name
  const getPaymentMethodName = (method) => {
    switch (method) {
      case "phone_pay_number":
        return "PhonePe";
      case "paytm_number":
        return "Paytm";
      case "google_pay_number":
        return "Google Pay";
      case "ac_number":
        return "Bank Transfer";
      default:
        return "Bank Transfer";
    }
  };

  // Get user data from localStorage
  const getUserDataFromLocalStorage = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserData({
          id: storedUser.id || "",
        });
        return storedUser;
      }
      return null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  // Validate token
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }
    return true;
  };

  // Fetch wallet amount
  const fetchWalletAmount = async () => {
    try {
      if (!(await validateToken())) return;

      const user = getUserDataFromLocalStorage();
      if (!user?.id) {
        console.error("User ID not found");
        setWalletAmount(0);
        navigate("/");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWalletAmount(data.amount || 0);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletAmount(0);
    }
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!(await validateToken())) return;
      getUserDataFromLocalStorage();
      fetchWalletAmount();
    };
    checkAuthAndFetchData();
  }, [navigate]);

  const handleAmountClick = (value) => {
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amount < 1000) {
      alert("Enter minimum amount ₹1000");
      return;
    }

    if (!payType) {
      alert("Please select payment method");
      return;
    }

    if (amount > walletAmount) {
      alert("Withdrawal amount cannot be greater than wallet balance");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const withdrawalData = {
        date: getCurrentDate(),
        addUserDTO: {
          id: userData.id,
        },
        paymentMethod: getPaymentMethodName(payType),
        amount: parseFloat(amount),
      };

      const response = await fetch(`${API_BASE_URL2}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(withdrawalData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Withdrawal request submitted successfully:", result);
      alert("Withdrawal request submitted successfully!");

      // Reset form after successful submission
      setAmount("");
      setPayType("");
      fetchWalletAmount(); // Refresh wallet balance
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      alert("Failed to submit withdrawal request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fullheight bg-light">
      <div className="container">
        <div className="row gy-3">
          <div className="col-sm-12 my-3 px-0">
            <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
              <h5 className="m-0">
                <a href="/main-page">
                  <span className="me-3">←</span>
                </a>
                Withdrawal
              </h5>
              <div className="wallet px-3 py-1 rounded-2 bg-white bg-opacity-50">
                <i className="bi bi-wallet2"></i>
                <span className="ms-2">{walletAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="shadow p-4 rounded-4 mb-3">
          <div className="text-center mb-3">
            <img
              src={logonew}
              alt="logo"
              className="rounded-3 mx-auto d-table"
            />
          </div>

          <hr />
          <h6 className="text-center text-danger">
            For Withdrawal Related Query Call Or Whatsapp
          </h6>
          <p className="text-center m-0">+919202887071</p>
          <hr />
          <h6 className="text-center">
            Withdrawal requests processed between 12:00 to 16:00 daily
          </h6>
          <p className="text-center text-danger">
            Note: Withdrawal Time is 12:00 to 16:00
          </p>
          <hr />

          <div className="mb-3">
            <select
              className="form-control"
              value={payType}
              onChange={(e) => setPayType(e.target.value)}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="phone_pay_number">PhonePe</option>
              <option value="paytm_number">Paytm</option>
              <option value="google_pay_number">Google Pay</option>
              <option value="ac_number">Bank Transfer</option>
            </select>
          </div>

          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              min="1000"
              max="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
            <small className="text-muted">
              Minimum withdrawal amount: ₹1000
            </small>
          </div>

          <div className="row gy-2 mb-3">
            {[1000, 2000, 5000, 10000, 50000, 100000].map((amt) => (
              <div className="col-4 col-md-2" key={amt}>
                <button
                  type="button"
                  onClick={() => handleAmountClick(amt)}
                  className="btn btn-light shadow-sm py-2 w-100"
                >
                  ₹{amt.toLocaleString()}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-warning"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default WithdrawalForm;
