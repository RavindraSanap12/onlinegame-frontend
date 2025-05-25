import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DoublePattiGame.css";
import { API_BASE_URL, API_BASE_URL2 } from "../api";

const DoublePatti = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPoint, setSelectedPoint] = useState(0);
  const [session, setSession] = useState("Open");
  const [bids, setBids] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all required data from location state
  const {
    marketId = "",
    marketTitle = "Market",
    bidDate = new Date().toISOString(),
    gameName = "Double Patti",
    openTime = "",
    closeTime = "",
    status = "",
  } = location.state || {};

  // Calculate totals from bids object
  const totalBids = Object.keys(bids).length;
  const totalAmount = Object.values(bids).reduce(
    (sum, points) => sum + points,
    0
  );

  const digitsData = {
    0: ["550", "668", "244", "299", "226", "488", "677", "118", "334"],
    1: ["100", "119", "155", "227", "335", "344", "399", "588", "669"],
    2: ["200", "110", "228", "255", "336", "499", "660", "688", "778"],
    3: ["300", "166", "229", "337", "355", "445", "599", "779", "788"],
    4: ["400", "112", "220", "266", "338", "446", "455", "699", "770"],
    5: ["500", "113", "122", "177", "339", "366", "447", "799", "889"],
    6: ["600", "114", "277", "330", "448", "466", "556", "880", "899"],
    7: ["700", "115", "133", "188", "223", "377", "449", "557", "566"],
    8: ["800", "116", "224", "233", "288", "440", "477", "558", "990"],
    9: ["900", "117", "144", "199", "225", "388", "559", "577", "667"],
  };

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

    setBids((prevBids) => {
      const newBids = { ...prevBids };
      if (newBids[digit]) {
        newBids[digit] += selectedPoint;
      } else {
        newBids[digit] = selectedPoint;
      }
      return newBids;
    });
  };

  const handleReset = () => {
    setBids({});
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

  const groupDigitsByEnding = () => {
    const grouped = {};

    for (let i = 0; i <= 9; i++) {
      grouped[`single digit ${i}`] = {};
    }

    Object.entries(bids).forEach(([digit, points]) => {
      for (const [group, digits] of Object.entries(digitsData)) {
        if (digits.includes(digit)) {
          grouped[`single digit ${group}`][digit] = points;
          break;
        }
      }
    });

    return grouped;
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

      if (totalAmount > walletAmount) {
        throw new Error("Insufficient wallet balance");
      }

      const token = localStorage.getItem("token");
      const requestBody = {
        date: formatDateForAPI(bidDate),
        type: session.toLowerCase(),
        addUserDTO: {
          id: userData.id,
        },
        mainMarketDTO: {
          marketId: parseInt(marketId),
        },
        digitValues: groupDigitsByEnding(),
      };

      const response = await fetch(`${API_BASE_URL2}/double-patti`, {
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
      setWalletAmount((prev) => prev - totalAmount);
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
                          {marketTitle} - Double Patti | Status: {status} |
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

                  <div className="doublepatti-header-filter">
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
                    {[10, 20, 50, 100, 200, 500, 1000].map((point) => (
                      <div className="col" key={point}>
                        <div className="pbtn">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id={`flexRadioDefault${point}`}
                            hidden
                            checked={selectedPoint === point}
                            onChange={() => handlePointSelect(point)}
                          />
                          <label
                            htmlFor={`flexRadioDefault${point}`}
                            className={`btn btn-light shadow-sm px-4 py-2 w-100 points ${
                              selectedPoint === point ? "active" : ""
                            }`}
                          >
                            {point}
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
                    <div className="  row row-cols-6 g2 px-2 ">
                      {Object.entries(digitsData).map(
                        ([digit, digitValues]) => (
                          <div key={digit} className="">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                              <h6 className="text-black fw-bold pt-3">
                                Select Digit {digit}
                              </h6>
                            </div>
                            <div className="row row-cols-6 g-2 px-2">
                              {digitValues.map((value) => (
                                <div className="col" key={value}>
                                  <div className="digit-field text-center">
                                    {value}
                                    <input
                                      type="text"
                                      className={`form-control text-center px-sm-4 py-3 border-dark digits ${
                                        bids[value] ? "active" : ""
                                      }`}
                                      data-point={selectedPoint}
                                      data-id={value}
                                      readOnly
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleDigitClick(value)}
                                      value={bids[value] || ""}
                                    />
                                    <div className="" id={`bid${value}`}>
                                      {bids[value] && (
                                        <input
                                          type="hidden"
                                          name={`bid[${value}]`}
                                          value={bids[value]}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
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
                    disabled={totalBids === 0 || totalAmount > walletAmount}
                  >
                    Submit BID
                  </button>
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
                          {Object.entries(bids).map(([digit, points]) => (
                            <tr
                              key={digit}
                              className={`tbid${digit}`}
                              data-id={digit}
                            >
                              <td>{digit}</td>
                              <td>{points}</td>
                              <td>Double Patti</td>
                              <td>{session}</td>
                            </tr>
                          ))}
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
                        <h6 id="points">{totalAmount}</h6>
                        <input
                          type="hidden"
                          name="total_amount"
                          value={totalAmount}
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

export default DoublePatti;
