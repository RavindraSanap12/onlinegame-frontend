import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_BASE_URL, API_BASE_URL2 } from "../api";
import './triplepatti.css'
const TripplePatti = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPoint, setSelectedPoint] = useState(0);
  const [selectedDigits, setSelectedDigits] = useState({});
  const [session, setSession] = useState("Open");
  const [showModal, setShowModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all required data from location state
  const {
    marketId = "",
    marketTitle = "Market",
    bidDate = new Date().toISOString(),
    gameName = "Triple Patti",
    openTime = "",
    closeTime = "",
    status = "",
  } = location.state || {};

  // Calculate totals from selectedDigits
  const totalBids = Object.keys(selectedDigits).length;
  const totalPoints = Object.values(selectedDigits).reduce(
    (sum, points) => sum + points,
    0
  );

  const digits = [
    "000",
    "111",
    "222",
    "333",
    "444",
    "555",
    "666",
    "777",
    "888",
    "999",
  ];

  const pointOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 500, label: "500" },
    { value: 1000, label: "1000" },
  ];

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
    const checkAuth = async () => {
      if (!(await validateToken())) return;
      fetchWalletAmount();
    };
    checkAuth();
  }, [navigate]);

  const handlePointSelect = (point) => {
    setSelectedPoint(point);
  };

  const handleDigitClick = (digit) => {
    if (selectedPoint === 0) {
      alert("First select point");
      return;
    }

    setSelectedDigits((prev) => {
      const currentValue = prev[digit] || 0;
      const newValue = currentValue + selectedPoint;

      return {
        ...prev,
        [digit]: newValue,
      };
    });
  };

  const handleReset = () => {
    setSelectedDigits({});
  };

  const handleSessionChange = (e) => {
    setSession(e.target.value);
    handleReset();
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

  const formatDigitValues = () => {
    const formatted = {
      zero3: 0,
      one3: 0,
      two3: 0,
      three3: 0,
      four3: 0,
      five3: 0,
      six3: 0,
      seven3: 0,
      eight3: 0,
      nine3: 0,
    };

    Object.entries(selectedDigits).forEach(([digit, points]) => {
      const digitKey = digit.charAt(0); // Get first character of the digit
      switch (digitKey) {
        case "0":
          formatted.zero3 = points;
          break;
        case "1":
          formatted.one3 = points;
          break;
        case "2":
          formatted.two3 = points;
          break;
        case "3":
          formatted.three3 = points;
          break;
        case "4":
          formatted.four3 = points;
          break;
        case "5":
          formatted.five3 = points;
          break;
        case "6":
          formatted.six3 = points;
          break;
        case "7":
          formatted.seven3 = points;
          break;
        case "8":
          formatted.eight3 = points;
          break;
        case "9":
          formatted.nine3 = points;
          break;
        default:
          break;
      }
    });

    return formatted;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!(await validateToken())) return;

      const userData = getUserData();
      if (!userData?.id) {
        throw new Error("User not authenticated");
      }

      if (!marketId) {
        throw new Error("Market ID is required");
      }

      if (totalPoints > walletAmount) {
        throw new Error("Insufficient wallet balance");
      }

      const token = localStorage.getItem("token");
      const requestBody = {
        date: formatDateForAPI(bidDate),
        type: session === "Open" ? "Regular" : "Close",
        addUserDTO: {
          id: userData.id,
        },
        mainMarketDTO: {
          marketId: parseInt(marketId),
        },
        // delhiMarketDTO: {
        //   marketId: parseInt(marketId),
        // },
        // starlineMarketDTO: {
        //   id: parseInt(marketId),
        // },
        ...formatDigitValues(),
      };

      const response = await fetch(`${API_BASE_URL2}/tripple-patti`, {
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
        throw new Error(errorData.message || "Failed to submit bid");
      }

      const responseData = await response.json();
      setWalletAmount((prev) => prev - totalPoints);
      alert("Bid submitted successfully!");
      console.log(JSON.stringify(requestBody, null, 2));
      setShowModal(false);
      handleReset();
    } catch (err) {
      console.error("Error submitting bid:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
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
          <div className="home-wraper">
            <div className="container">
              <form onSubmit={handleSubmit} id="myform">
                <div className="fxdsng sticky-top bg-white pb-4">
                  <div className="row gy-3 px-0">
                    <div className="col-sm-12 mb-2 mt-0 px-0">
                      <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
                        <h5 className="fw-semibild m-0">
                          <Link to="/game" state={location.state}>
                            <span className="ri-arrow-left-line me-3"></span>
                          </Link>
                           Triple Patti | Status: {status} |
                          Open: {openTime} - Close: {closeTime}
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

                  <div className="triplepatti-header-filter">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                      <input
                        type="text"
                        readOnly
                        className="form-control w-auto"
                        value={formatDate(bidDate)}
                      />
                      <input
                        type="hidden"
                        className="form-control w-auto"
                        name="bid_date"
                        value={bidDate}
                      />
                    </div>
                   <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                      <div className="select-field ms-sm-auto d-sm-table">
                        <select
                          name="session"
                          id="type"
                          className="form-select w-auto"
                          value={session}
                          onChange={handleSessionChange}
                        >
                          <option value="Open">OPEN</option>
                          <option value="Close">CLOSE</option>
                        </select>
                      </div>
                    </div>
 </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                      <h5 className="text-center text-black">
                        Select Points for Betting
                      </h5>
                    </div>
                    <div className="row row-cols-4 gy-2 px-3">
                    {pointOptions.map((option, index) => (
                      <div className="col" key={index}>
                        <div className="pbtn">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id={`flexRadioDefault${index + 2}`}
                            hidden
                            checked={selectedPoint === option.value}
                            onChange={() => handlePointSelect(option.value)}
                          />
                          <label
                            htmlFor={`flexRadioDefault${index + 2}`}
                            className={`btn btn-light shadow-sm px-4 py-2 w-100 points ${
                              selectedPoint === option.value ? "active" : ""
                            }`}
                          >
                            {option.label}
                          </label>
                        </div>
                      </div>
                    ))}
                 </div>
                </div>

                <div className="select-digit-wrap mt-4">
                  <div className="sdigit">
                    <h5 className="text-center text-black mb-0">
                      Select Digits
                    </h5>
                  </div>
                  <div className="scrrolar d-flex flex-column gap-4">
                    
                      <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <h6 className="text-black fw-bold pt-3">
                          Select All Digits
                        </h6>
                      </div>
                       <div className="scrrolar d-flex flex-column gap-4">
                    <div className="  row row-cols-6 g2 px-2 ">
                      
                      {digits.map((digit, index) => (
                        <div className="col" key={index}>
                          <div className="digit-field text-center">
                            {digit}
                            <input
                              type="text"
                              className={`form-control text-center px-sm-4 py-3 border-dark digits ${
                                selectedDigits[digit] ? "selected" : ""
                              }`}
                              data-point={selectedPoint}
                              data-id={digit}
                              readOnly
                              style={{ cursor: "pointer" }}
                              value={selectedDigits[digit] || ""}
                              onClick={() => handleDigitClick(digit)}
                            />
                            <div className="" id={`bid${digit}`}>
                              {selectedDigits[digit] && (
                                <input
                                  type="hidden"
                                  name={`bid[${digit}]`}
                                  value={selectedDigits[digit]}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                      </div>
                 
                  </div>

                  <div className="bibtn d-flex justify-content-between align-items-center py-2 fixed-bottom px-4 bg-light">
                    <button
                      type="button"
                      className="btn btn-dark btnreset"
                      onClick={handleReset}
                    >
                      Reset BID
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => setShowModal(true)}
                      disabled={totalBids === 0 || totalPoints > walletAmount}
                    >
                      Submit BID
                    </button>
                  </div>
                </div>

                <Modal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  centered
                >
                  <Modal.Header closeButton className="bg-warning text-dark">
                    <Modal.Title>
                      {marketTitle} - {formatDate(bidDate)}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="table-responsive">
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Digits</th>
                            <th>Points</th>
                            <th>Game Type</th>
                            <th>Session</th>
                          </tr>
                        </thead>
                        <tbody className="tdata">
                          {Object.entries(selectedDigits).map(
                            ([digit, points]) => (
                              <tr
                                key={digit}
                                className={`tbid${digit}`}
                                data-id={digit}
                              >
                                <td>{digit}</td>
                                <td>{points}</td>
                                <td>Triple Patti</td>
                                <td>{session}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="4">
                              <p>
                                *Note Bid Once Played Will Not Be Cancelled*
                              </p>
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div className="row tbldta gy-2">
                      <div className="col-6">
                        <h6>Total Bids</h6>
                      </div>
                      <div className="col-6 text-end">
                        <h6 id="bids">{totalBids}</h6>
                      </div>
                      <div className="col-6">
                        <h6>Total Bid Amount</h6>
                      </div>
                      <div className="col-6 text-end">
                        <h6 id="points">{totalPoints}</h6>
                        <input
                          type="hidden"
                          name="total_amount"
                          value={totalPoints}
                          id="point1"
                        />
                      </div>
                      <div className="col-6">
                        <Button
                          variant="primary"
                          onClick={() => setShowModal(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                      <div className="col-6 text-end">
                        <Button
                          variant="warning"
                          type="submit"
                          onClick={handleSubmit}
                          disabled={isLoading}
                        >
                          {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </Modal.Footer>
                </Modal>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripplePatti;




