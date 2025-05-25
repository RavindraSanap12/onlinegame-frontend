import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "remixicon/fonts/remixicon.css";
import "./coustomstyle.css";
import logonew from "../Add_Funds/logonew.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const AddFunds = () => {
  const [walletAmount, setWalletAmount] = useState(0);
  const [amount, setAmount] = useState(""); // State for the amount being added
  const [loading, setLoading] = useState(false);
  const minAmount = 500;
  const maxAmount = 100000;
  const upiId = "hiteshtrivedi@ucobank";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const predefinedAmounts = [500, 1000, 2000, 5000, 10000, 50000, 100000];
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    mobileNo: "",
  });

  const handleAmountClick = (value) => {
    setAmount(value);
  };

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }
    return true;
  };

  const getUserDataFromLocalStorage = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserData({
          id: storedUser.id || "",
          name: storedUser.name || "",
          email: storedUser.email || "",
          mobileNo: storedUser.mobileNo || "",
        });
        return storedUser;
      }
      return null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  const fetchWalletAmount = async () => {
    setIsLoading(true);
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
      setError(null);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletAmount(0);
      setError(err.message);
    } finally {
      setIsLoading(false);
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

  const generateTransactionNumber = () => {
    return `TXN${Date.now()}`;
  };

  const saveTransaction = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const transactionData = {
        addUserDTO: {
          id: userData.id,
        },
        amount: parseFloat(amount),
        transactionNo: generateTransactionNumber(),
        remarks: "Funds added via UPI",
      };

      const response = await fetch(`${API_BASE_URL}/points/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Transaction saved successfully:", result);
      return result;
    } catch (error) {
      console.error("Error saving transaction:", error);
      throw error;
    }
  };

  const handlePayClick = async () => {
    if (!amount || amount < minAmount || amount > maxAmount) {
      alert(`Please enter an amount between ${minAmount} and ${maxAmount}`);
      return;
    }

    setLoading(true);

    try {
      // First save the transaction
      await saveTransaction();

      // Then open UPI payment link
      const upiLink = `upi://pay?pa=${upiId}&pn=FNAME SNAME K&cu=INR&am=${amount}`;
      window.location.href = upiLink;
    } catch (error) {
      alert("Failed to process transaction. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper" id="body-pd">
      <main className="fullheight bg-light">
        <div className="main-body">
          <div className="home-wraper">
            <div className="container">
              <div className="row gy-3">
                <div className="col-sm-12 my-3 px-0">
                  <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold m-0">
                      <Link to="/main-page">
                        <span className="ri-arrow-left-line me-3"></span>
                      </Link>
                      Add Funds
                    </h5>
                    <div className="wallet px-3 py-1 rounded-2 bg-white bg-opacity-50">
                      <i className="ri-wallet-3-line fs-6"></i>
                      <span className="ms-2 fs-6">
                        {walletAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center col-12">
                <img
                  src={logonew}
                  alt="logo"
                  className="rounded-3 mx-auto d-table"
                />
              </div>

              <div className="col-12">
                <hr className="my-1" />
                <h6 className="text-center text-black">
                  For Add Funds Related Query Call Or Whatsapp
                </h6>
                <p className="text-center m-0">+919202887071</p>
                <p className="text-center">
                  How to add funds? <a href="#">Click Here</a>
                </p>
                <hr className="my-1" />
                <h6 className="text-center">
                  Payment Add kerne ke 5 minutes ke andar apke wallet me points
                  add hojayenge. So don't worry wait kariye.
                </h6>
                <hr className="my-1" />
              </div>

              <div className="tab-content mt-3">
                <form className="shadow p-4 rounded-4 mb-3">
                  <div className="text-center mb-3">
                    <label htmlFor="amount" className="form-label">
                      Enter Amount
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      min={minAmount}
                      max={maxAmount}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter Amount"
                      required
                    />
                    <p className="text-center text-black">
                      Enter minimum amount ₹500
                    </p>
                  </div>

                  <div className="row gy-2 mb-3">
                    {predefinedAmounts.map((amt) => (
                      <div className="col-md-3 col-4" key={amt}>
                        <button
                          type="button"
                          className="btn btn-light shadow-sm py-2 w-100 btnrs px-0"
                          onClick={() => handleAmountClick(amt)}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="col-12 py-2 px-4 bg-light text-center">
                    <button
                      type="button"
                      className="upi-pay btn btn-warning"
                      onClick={handlePayClick}
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <i className="fa fa-spinner fa-spin"></i> Loading...
                        </span>
                      ) : (
                        "Pay Now!"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddFunds;
