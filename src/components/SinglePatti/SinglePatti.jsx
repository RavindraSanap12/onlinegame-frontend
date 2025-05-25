import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, API_BASE_URL2 } from "../api";
import "./singlepatti.css";
const SinglePatti = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { marketId: urlMarketId } = useParams();

  const marketId = urlMarketId || location.state?.marketId;

  if (!marketId) {
    navigate("/games", { replace: true });
    return null;
  }

  const {
    gameName = "Game",
    marketTitle = "Market",
    bidDate = new Date().toISOString(),
  } = location.state || {};

  const [selectedPoint, setSelectedPoint] = useState(0);
  const [selectedDigits, setSelectedDigits] = useState({});
  const [session, setSession] = useState("Open");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Group digits by their ending number (0-9)
  const digitGroups = {
    0: [
      "127",
      "136",
      "145",
      "190",
      "235",
      "280",
      "370",
      "479",
      "460",
      "569",
      "389",
      "578",
    ],
    1: [
      "128",
      "137",
      "146",
      "236",
      "245",
      "290",
      "380",
      "470",
      "489",
      "560",
      "678",
      "579",
    ],
    2: [
      "129",
      "138",
      "147",
      "156",
      "237",
      "246",
      "345",
      "390",
      "480",
      "570",
      "679",
      "589",
    ],
    3: [
      "120",
      "139",
      "148",
      "157",
      "238",
      "247",
      "256",
      "346",
      "490",
      "580",
      "670",
      "689",
    ],
    4: [
      "130",
      "149",
      "158",
      "167",
      "239",
      "248",
      "257",
      "347",
      "356",
      "590",
      "680",
      "789",
    ],
    5: [
      "140",
      "159",
      "168",
      "230",
      "249",
      "258",
      "267",
      "348",
      "357",
      "456",
      "690",
      "780",
    ],
    6: [
      "123",
      "150",
      "169",
      "178",
      "240",
      "259",
      "268",
      "349",
      "358",
      "467",
      "790",
      "367",
    ],
    7: [
      "124",
      "160",
      "179",
      "250",
      "269",
      "278",
      "340",
      "359",
      "368",
      "458",
      "890",
      "467",
    ],
    8: [
      "125",
      "134",
      "170",
      "189",
      "260",
      "279",
      "350",
      "369",
      "378",
      "459",
      "567",
      "468",
    ],
    9: [
      "126",
      "135",
      "180",
      "234",
      "270",
      "289",
      "360",
      "379",
      "450",
      "469",
      "568",
      "478",
    ],
  };

  // Calculate totals based on selectedDigits
  const totalBids = Object.keys(selectedDigits).length;
  const totalPoints = Object.values(selectedDigits).reduce(
    (sum, points) => sum + points,
    0
  );

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
      navigate("/login");
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
        navigate("/login");
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
        navigate("/login");
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
      alert("Please select a point value first");
      return;
    }

    setSelectedDigits((prev) => ({
      ...prev,
      [digit]: (prev[digit] || 0) + selectedPoint,
    }));
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

  const groupDigitsByEnding = () => {
    const grouped = {};

    // Initialize all digit groups
    for (let i = 0; i <= 9; i++) {
      grouped[`single digit ${i}`] = {};
    }

    // Populate with selected digits
    Object.entries(selectedDigits).forEach(([digit, points]) => {
      // Find which group this digit belongs to
      for (const [group, digits] of Object.entries(digitGroups)) {
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
    setIsSubmitting(true);
    setError(null);

    try {
      if (!(await validateToken())) return;

      const userData = getUserData();
      if (!userData?.id) {
        throw new Error("User not authenticated");
      }

      if (totalPoints > walletAmount) {
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

      const response = await fetch(`${API_BASE_URL2}/single-patti`, {
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
        navigate("/login");
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

      handleReset();
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting bid:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
                          <Link to={`/game/${marketId}`} state={location.state}>
                            <span className="ri-arrow-left-line me-3"></span>
                          </Link>
                          Single Patti
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

                  <input type="hidden" name="game_id" value={marketId} />
                  <input type="hidden" name="pana_name" value="Single Pana" />
                  <input type="hidden" name="page" value="single-patti" />
                  <input type="hidden" name="game_name" value={gameName} />
                  <input type="hidden" name="slug" value="single-patti" />

                  <div className="singlepatti-header-filter">
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
                      <div
                        className="row row-cols-4 gy-2 px-3"
                        key={`point-${option.value}`}
                      >
                        <div className="row">
                          <input
                            className="form-check-input d-none"
                            type="radio"
                            name="flexRadioDefault"
                            id={`flexRadioDefault${index + 2}`}
                            hidden
                            checked={selectedPoint === option.value}
                            onChange={() => handlePointSelect(option.value)}
                          />
                          <label
                            htmlFor={`flexRadioDefault${index + 2}`}
                            className={`btn btn-light bg-dark bg-opacity-10 shadow-sm px-4 py-2 w-100 points ${
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
                  <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    <h5 className="text-center text-black mb-0">
                      Select Digits
                    </h5>
                  </div>
                  <div className="scrrolar d-flex flex-column gap-4">
                    {Object.entries(digitGroups).map(([digitGroup, digits]) => (
                      <div key={digitGroup}>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                          <h6 className="text-black fw-bold pt-3">
                            Select Digit {digitGroup}
                          </h6>
                        </div>

                        <div className=" d-flex flex-column gap-4">
                          <div className="  row row-cols-6 g2 px-2 ">
                            {digits.map((digit) => (
                              <div className="col mt-0" key={`digit-${digit}`}>
                                <div className="digit-field text-center">
                                  {digit}
                                  <input
                                    type="text"
                                    className={`form-control text-center p-0 border-dark digits ${
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
                    ))}
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

                {showModal && (
                  <div
                    className="modal show"
                    style={{
                      display: "block",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="modal-content">
                        <div className="modal-header bg-warning text-dark">
                          <h1 className="modal-title fs-5">
                            {marketTitle} - {formatDate(bidDate)}
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            disabled={isSubmitting}
                          ></button>
                        </div>
                        <div className="modal-body">
                          {error && (
                            <div className="alert alert-danger">{error}</div>
                          )}
                          <div className="table-responsive">
                            <table className="table table-bordered">
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
                                      key={`modal-digit-${digit}`}
                                      className={`tbid${digit}`}
                                      data-id={digit}
                                    >
                                      <td>{digit}</td>
                                      <td>{points}</td>
                                      <td>Single Patti</td>
                                      <td>{session}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan="4">
                                    <p>
                                      *Note Bid Once Played Will Not Be
                                      Cancelled*
                                    </p>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                        <div className="modal-footer">
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
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setShowModal(false)}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="col-6 text-end">
                              <button
                                type="submit"
                                className="btn btn-warning"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Submitting..." : "Submit"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SinglePatti;
