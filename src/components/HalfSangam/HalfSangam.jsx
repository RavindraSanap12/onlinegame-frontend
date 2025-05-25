import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { API_BASE_URL, API_BASE_URL2 } from "../api";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const HalfSangam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    game_id: 40,
    pana_name: "Half Sangam",
    page: "half-sangam",
    game_name: "Test",
    slug: "test",
    session: "open",
    bid_date: "2025-04-30 12:10:01",
  });
  const [bids, setBids] = useState([]);
  const [totalBids, setTotalBids] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [flag, setFlag] = useState(1);
  const [message, setMessage] = useState("");
  const [showOpenPanna, setShowOpenPanna] = useState(true);
  const [showClosePanna, setShowClosePanna] = useState(false);
  const [points, setPoints] = useState({
    first_point: "",
    second_point: "",
  });
  const [digits, setDigits] = useState({
    close_digit: "",
    open_digit: "",
  });
  const [panna, setPanna] = useState({
    autocomplete: "",
    autocompleteclose: "",
  });
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [marketId, setMarketId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.marketId) {
      setMarketId(location.state.marketId);
    }
  }, [location]);

  const getUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      return userData?.id ? userData : null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }
    return true;
  };

  const fetchWalletAmount = async () => {
    setIsLoading(true);
    try {
      if (!(await validateToken())) return;

      const userData = getUserData();
      if (!userData?.id) {
        console.error("User ID not found");
        setWalletAmount(0);
        navigate("/");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
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
      setMessage("");
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletAmount(0);
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!(await validateToken())) return;
      fetchWalletAmount();
    };
    checkAuth();
  }, [navigate]);

  const handleDigitChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^0-9]/g, "");

    if (parseInt(cleanedValue) >= 0 && parseInt(cleanedValue) <= 9) {
      setDigits((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else {
      setDigits((prev) => ({
        ...prev,
        [name]: "0",
      }));
    }
  };

  const handlePointChange = (e) => {
    const { name, value } = e.target;
    const min = parseInt(e.target.getAttribute("min"));
    const max = parseInt(e.target.getAttribute("max"));

    if (parseInt(value) >= min && parseInt(value) <= max) {
      setPoints((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setPoints((prev) => ({
        ...prev,
        [name]: min,
      }));
      setMessage(`Please enter between ${min} to ${max} points!`);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handlePannaChange = (e) => {
    const { name, value } = e.target;
    setPanna((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePanna = () => {
    setShowOpenPanna(!showOpenPanna);
    setShowClosePanna(!showClosePanna);
    setFlag(flag === 1 ? 2 : 1);

    setPanna({ autocomplete: "", autocompleteclose: "" });
    setPoints({ first_point: "", second_point: "" });
    setDigits({ close_digit: "", open_digit: "" });
  };

  const submitBidToServer = async (bidData) => {
    try {
      const user = getUserData();
      if (!user) {
        throw new Error("User not found");
      }

      if (!marketId) {
        throw new Error("Market ID not found");
      }

      const token = localStorage.getItem("token");
      const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const payload = {
        date: currentDate,
        type: "Regular",
        addUserDTO: {
          id: user.id,
        },
        mainMarketDTO: {
          marketId: marketId,
        },
        openPanna: bidData.digits,
        closeDigit: bidData.closedigits,
        points: bidData.points,
      };

      const response = await fetch(`${API_BASE_URL2}/half-sangam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error submitting bid:", error);
      throw error;
    }
  };

  const addBid = async (e) => {
    e.preventDefault();

    let digitsValue, closedigitsValue, pointsValue, session;

    if (flag === 1) {
      digitsValue = panna.autocomplete;
      closedigitsValue = digits.close_digit;
      pointsValue = parseInt(points.first_point);
      session = "open";
    } else {
      digitsValue = digits.open_digit;
      closedigitsValue = panna.autocompleteclose;
      pointsValue = parseInt(points.second_point);
      session = "close";
    }

    if (!digitsValue || !closedigitsValue || !pointsValue) {
      setMessage("Please fill all details!");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    if (pointsValue > walletAmount) {
      setMessage("Insufficient wallet balance!");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    setIsLoading(true);
    try {
      const newBid = {
        id: Date.now(),
        digits: digitsValue,
        closedigits: closedigitsValue,
        points: pointsValue,
        session: session,
        flag: flag,
      };

      // Submit to server first
      await submitBidToServer(newBid);

      // Only update local state if server submission succeeds
      setBids((prev) => [...prev, newBid]);
      setTotalBids((prev) => prev + 1);
      setTotalPoints((prev) => prev + pointsValue);
      setWalletAmount((prev) => prev - pointsValue);

      // Clear fields after adding
      setPanna({ autocomplete: "", autocompleteclose: "" });
      setPoints({ first_point: "", second_point: "" });
      setDigits({ close_digit: "", open_digit: "" });

      toastr.success("Bid added successfully!");
    } catch (error) {
      setMessage("Failed to add bid. Please try again.");
      console.error("Add bid error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBid = (id, bidPoints) => {
    setBids(bids.filter((bid) => bid.id !== id));
    setTotalBids((prev) => prev - 1);
    setTotalPoints((prev) => prev - bidPoints);
    setWalletAmount((prev) => prev + bidPoints);
  };

  if (isLoading && !bids.length) {
    return (
      <div
        className="container py-3 d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <i
            className="bi bi-arrow-left"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          ></i>{" "}
          Half Sangam
        </h4>
        <div className="wallet bg-warning p-2 rounded">
          <i className="bi bi-wallet2"></i>{" "}
          <span>{walletAmount.toLocaleString()}</span>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={togglePanna}
      >
        {showOpenPanna ? "Switch to Close Panna" : "Switch to Open Panna"}
      </button>

      {message && <div className="alert alert-danger">{message}</div>}

      <form onSubmit={addBid}>
        {showOpenPanna && (
          <>
            <div className="mb-2">
              <label>Open Panna</label>
              <input
                type="number"
                name="autocomplete"
                className="form-control"
                value={panna.autocomplete}
                onChange={handlePannaChange}
                disabled={isLoading}
              />
            </div>
            <div className="mb-2">
              <label>Close Digit (0-9)</label>
              <input
                type="number"
                name="close_digit"
                max="9"
                min="0"
                className="form-control"
                value={digits.close_digit}
                onChange={handleDigitChange}
                disabled={isLoading}
              />
            </div>
            <div className="mb-2">
              <label>Points (10-1000)</label>
              <input
                type="number"
                name="first_point"
                min="10"
                max="1000"
                className="form-control"
                value={points.first_point}
                onChange={handlePointChange}
                disabled={isLoading}
              />
            </div>
          </>
        )}

        {showClosePanna && (
          <>
            <div className="mb-2">
              <label>Open Digit (0-9)</label>
              <input
                type="number"
                name="open_digit"
                max="9"
                min="0"
                className="form-control"
                value={digits.open_digit}
                onChange={handleDigitChange}
                disabled={isLoading}
              />
            </div>
            <div className="mb-2">
              <label>Close Panna</label>
              <input
                type="number"
                name="autocompleteclose"
                className="form-control"
                value={panna.autocompleteclose}
                onChange={handlePannaChange}
                disabled={isLoading}
              />
            </div>
            <div className="mb-2">
              <label>Points (10-1000)</label>
              <input
                type="number"
                name="second_point"
                min="10"
                max="1000"
                className="form-control"
                value={points.second_point}
                onChange={handlePointChange}
                disabled={isLoading}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="btn btn-success mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Bid"}
        </button>
      </form>

      <hr />

      <h5>
        Bids Added: {totalBids} | Total Points: {totalPoints}
      </h5>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Open/Close</th>
            <th>Open</th>
            <th>Close</th>
            <th>Points</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid, index) => (
            <tr key={bid.id}>
              <td>{index + 1}</td>
              <td>{bid.session}</td>
              <td>{bid.digits}</td>
              <td>{bid.closedigits}</td>
              <td>{bid.points}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteBid(bid.id, bid.points)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {bids.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No Bids Added
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HalfSangam;
