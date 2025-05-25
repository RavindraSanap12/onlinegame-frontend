import React, { useState, useEffect } from "react";
import "./DMMotor.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL, API_BASE_URL2 } from "../api";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const DMMotor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get market data from location state
  const {
    marketId = 1,
    marketTitle = "DM Motor",
    bidDate: locationBidDate = new Date().toISOString(),
  } = location.state || {};

  const [digits, setDigits] = useState("");
  const [points, setPoints] = useState("");
  const [session, setSession] = useState("Open");
  const [bids, setBids] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("");
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletAmount(0);
      setError(err.message);
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

  const handleAdd = (e) => {
    e.preventDefault();

    const pointsValue = parseInt(points);
    if (pointsValue < 10 || pointsValue > 1000) {
      setError("Please enter min 10 to 1000 Points!");
      return;
    }

    if (!digits) {
      setError("Please enter a digit.");
      return;
    }

    if (pointsValue > walletAmount) {
      setError("Insufficient wallet balance");
      return;
    }

    const newBid = { digits, points: pointsValue, session };
    setBids([...bids, newBid]);
    setWalletAmount((prev) => prev - pointsValue);
    setDigits("");
    setPoints("");
    setError("");
  };

  const handleReset = () => {
    const totalPoints = bids.reduce(
      (sum, bid) => sum + parseInt(bid.points),
      0
    );
    setWalletAmount((prev) => prev + totalPoints);
    setBids([]);
    setDigits("");
    setPoints("");
    setSession("Open");
    setError("");
  };

  const formatDateForAPI = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toISOString().split("T")[0];
    } catch (err) {
      console.error("Date formatting error:", err);
      return new Date().toISOString().split("T")[0];
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-GB");
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!(await validateToken())) return;

      const userData = getUserData();
      if (!userData?.id) {
        throw new Error("User not authenticated");
      }

      if (bids.length === 0) {
        throw new Error("No bids to submit");
      }

      const token = localStorage.getItem("token");
      const requestBody = bids.map((bid) => ({
        id: 0,
        date: formatDateForAPI(locationBidDate),
        digit: bid.digits.toString(),
        points: bid.points,
        gameType: bid.session.toLowerCase(),
        addUserDTO: {
          id: userData.id,
        },
        mainMarketDTO: {
          marketId: parseInt(marketId), // Using marketId from location state
        },
      }));

      const response = await fetch(`${API_BASE_URL2}/dpmotor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit bids");
      }

      toastr.success("Bids submitted successfully!");
      setShowModal(false);
      handleReset();
    } catch (err) {
      console.error("Error submitting bids:", err);
      setError(err.message);
      toastr.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPoints = bids.reduce((sum, bid) => sum + parseInt(bid.points), 0);

  if (isLoading && bids.length === 0) {
    return (
      <div
        className="container mt-4 d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h5 className="bg-warning p-2 d-flex justify-content-between align-items-center">
        <span>
          <a href="/application/game/test">
            <i className="ri-arrow-left-line me-3"></i>
          </a>
          {marketTitle} - DP Motor
        </span>
        <span className="bg-white px-3 py-1 rounded">
          💰 {walletAmount.toLocaleString()}
        </span>
      </h5>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAdd}>
        <div className="row my-3">
          <div className="col-md-6">
            <input
              type="text"
              readOnly
              value={formatDate(locationBidDate)}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              disabled={isLoading}
            >
              <option value="Open">OPEN</option>
              <option value="Close">CLOSE</option>
            </select>
          </div>
        </div>

        <div className="row my-2">
          <div className="col-6">
            <label>Digit</label>
            <input
              type="number"
              className="form-control text-center border-dark"
              value={digits}
              onChange={(e) => setDigits(e.target.value)}
              placeholder="Enter Digit"
              disabled={isLoading}
            />
          </div>
          <div className="col-6">
            <label>Points</label>
            <input
              type="number"
              min="10"
              max="1000"
              className="form-control text-center border-dark"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Enter Points"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="text-center my-3">
          <button
            className="btn btn-warning"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {bids.length > 0 && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Digit</th>
                <th>Points</th>
                <th>Game Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr key={index}>
                  <td>{bid.digits}</td>
                  <td>{bid.points}</td>
                  <td>{bid.session}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setWalletAmount((prev) => prev + parseInt(bid.points));
                        setBids(bids.filter((_, i) => i !== index));
                      }}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center fixed-bottom bg-light py-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={isLoading}
              className="me-2"
            >
              Reset
            </Button>
            <Button
              variant="warning"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              Submit
            </Button>
          </div>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header className="bg-warning">
          <Modal.Title>
            {marketTitle} - {formatDate(locationBidDate)}
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Digits</th>
                <th>Points</th>
                <th>Game Type</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, idx) => (
                <tr key={idx}>
                  <td>{bid.digits}</td>
                  <td>{bid.points}</td>
                  <td>{bid.session}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-danger text-center">
                  *Note: Bid once played will not be cancelled*
                </td>
              </tr>
            </tfoot>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              <h6>Total Bids: {bids.length}</h6>
              <h6>Total Bid Amount: {totalPoints}</h6>
            </div>
            <div>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                onClick={handleSubmit}
                className="ms-2"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DMMotor;
