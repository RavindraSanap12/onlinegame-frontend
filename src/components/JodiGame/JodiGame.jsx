import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons";
import "remixicon/fonts/remixicon.css";
import { useNavigate, useLocation } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { API_BASE_URL, API_BASE_URL2 } from "../api";
import "./Jodi.css";

const JodiGame = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get market data from location state
  const {
    marketId = 1,
    marketTitle = "Jodi",
    bidDate: locationBidDate = new Date().toISOString(),
  } = location.state || {};

  const [selectedPoint, setSelectedPoint] = useState(0);
  const [digits, setDigits] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i.toString().padStart(2, "0"),
      bid: 0,
      selected: false,
    }))
  );
  const [totalBids, setTotalBids] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date(locationBidDate).toISOString().split("T")[0]
  );
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState([]);

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
      setError([]);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletAmount(0);
      setError([err.message]);
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

  const handlePointSelect = (point) => {
    setSelectedPoint(point);
  };

  const handleDigitClick = (id) => {
    if (selectedPoint === 0) {
      setError(["Please select a point value first."]);
      return;
    }

    if (totalPoints + selectedPoint > walletAmount) {
      setError(["Insufficient wallet balance"]);
      return;
    }

    setDigits((prevDigits) => {
      const updatedDigits = prevDigits.map((digit) => {
        if (digit.id === id) {
          const newBid = digit.bid + selectedPoint;
          return { ...digit, bid: newBid, selected: true };
        }
        return digit;
      });

      // Calculate total bids and points from the updated digits array
      const bidsWithAmount = updatedDigits.filter((d) => d.bid > 0);
      const newTotalBids = bidsWithAmount.length;
      const newTotalPoints = bidsWithAmount.reduce((sum, d) => sum + d.bid, 0);

      setTotalBids(newTotalBids);
      setTotalPoints(newTotalPoints);

      return updatedDigits;
    });
    setError([]);
  };

  const handleReset = () => {
    setDigits(
      Array.from({ length: 100 }, (_, i) => ({
        id: i.toString().padStart(2, "0"),
        bid: 0,
        selected: false,
      }))
    );
    setTotalBids(0);
    setTotalPoints(0);
    setSelectedPoint(0);
    setError([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!(await validateToken())) return;

      const userData = getUserData();
      if (!userData?.id) {
        throw new Error("User not authenticated");
      }

      if (totalBids === 0) {
        throw new Error("No bids to submit");
      }

      const token = localStorage.getItem("token");

      // Create digitValues object in the required format
      const digitValues = {};
      digits.forEach((d) => {
        if (d.bid > 0) {
          digitValues[d.id] = d.bid;
        }
      });

      const requestBody = {
        date: selectedDate,
        addUserDTO: {
          id: userData.id,
        },
        mainMarketDTO: {
          marketId: parseInt(marketId), // Use marketId from location state
        },
        digitValues: digitValues,
      };

      const response = await fetch(`${API_BASE_URL2}/jodis`, {
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

      // Update wallet amount after successful submission
      setWalletAmount((prev) => prev - totalPoints);
      toastr.success("Bids submitted successfully!");
      setShowModal(false);
      handleReset();
    } catch (err) {
      console.error("Error submitting bids:", err);
      setError([err.message]);
      toastr.error(err.message);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
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

  if (isLoading) {
    return (
      <div className="main-wrapper" id="body-pd">
        <main className="fullheight bg-light">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="main-wrapper" id="body-pd">
      <main className="fullheight bg-light">
        <div className="main-body">
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="fxdsng sticky-top bg-white pb-4">
                <div className="row gy-3 px-0">
                  <div className="col-12 mb-2">
                    <div className="bg-warning shadow-sm px-3 py-2 d-flex justify-content-between">
                      <h5 className="m-0">
                        <a href="#">
                          <span className="ri-arrow-left-line me-2"></span>
                        </a>
                        Jodi
                      </h5>
                      <div className="wallet bg-white bg-opacity-50 px-3 py-1 rounded-2">
                        <i className="ri-wallet-3-line"></i>{" "}
                        <span className="ms-2">
                          {walletAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {error.length > 0 && (
                  <div className="alert alert-danger mx-3">
                    <ul className="mb-0">
                      {error.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="col-12" style={{ marginTop: "20px" }}>
                  <label htmlFor="bidDate" className="form-label">
                    Select Date:
                  </label>
                  <input
                    type="date"
                    id="bidDate"
                    className="form-control"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>
                <h5 className="text-center mt-3">Select Points for Betting</h5>
                <div className="row row-cols-4 gy-2 px-3">
                  {[10, 20, 50, 100, 200, 500, 1000].map((point, idx) => (
                    <div className="col" key={point}>
                      <div className="form-check">
                        <input
                          className="form-check-input d-none"
                          type="radio"
                          id={`point${idx}`}
                          name="betPoint"
                          checked={selectedPoint === point}
                          onChange={() => handlePointSelect(point)}
                        />
                        <label
                          htmlFor={`point${idx}`}
                          className={`btn btn-light w-100 ${
                            selectedPoint === point ? "btn-warning" : ""
                          }`}
                        >
                          {point}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h5 className="text-center mt-4 mb-3">Select Digits (00-99)</h5>
              <div className="row row-cols-6 g-2 px-2">
                {digits.map((d) => (
                  <div className="col" key={d.id}>
                    <div
                      className={`digit-field text-center p-1 rounded ${
                        d.selected ? "bg-warning bg-opacity-25" : ""
                      }`}
                      onClick={() => handleDigitClick(d.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <small className="d-block">{d.id}</small>
                      <input
                        type="text"
                        readOnly
                        className={`form-control text-center py-1 ${
                          d.bid > 0 ? "border-warning" : ""
                        }`}
                        value={d.bid > 0 ? d.bid : ""}
                        style={{
                          cursor: "pointer",
                          backgroundColor: d.bid > 0 ? "#fff3cd" : "white",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 fixed-bottom bg-light px-3 border-top">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleReset}
                >
                  Reset Bid
                </button>
                <div className="text-center">
                  <div>
                    Total Bids: <strong>{totalBids}</strong>
                  </div>
                  <div>
                    Total Points: <strong>{totalPoints}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => setShowModal(true)}
                  disabled={totalBids === 0}
                >
                  Submit Bid
                </button>
              </div>

              {showModal && (
                <div
                  className="modal fade show d-block"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-warning">
                        <h5 className="modal-title">
                          Jodi Bids -{" "}
                          {new Date(selectedDate).toLocaleDateString()}
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowModal(false)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="table-responsive">
                          <table className="table table-bordered table-sm">
                            <thead className="table-warning">
                              <tr>
                                <th>Digit</th>
                                <th>Points</th>
                              </tr>
                            </thead>
                            <tbody>
                              {digits
                                .filter((d) => d.bid > 0)
                                .map((d) => (
                                  <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td>{d.bid}</td>
                                  </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-warning">
                              <tr>
                                <th>Total</th>
                                <th>{totalPoints}</th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        <div className="text-danger small">
                          *Note: Bid once placed cannot be cancelled
                        </div>
                      </div>
                      <div className="modal-footer d-flex justify-content-between">
                        <div>
                          <strong>Total Bids:</strong> {totalBids}
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={() => setShowModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-warning"
                            onClick={handleSubmit}
                          >
                            Confirm Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JodiGame;
