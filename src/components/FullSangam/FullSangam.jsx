import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "izitoast/dist/css/iziToast.min.css";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { API_BASE_URL, API_BASE_URL2 } from "../api";

const FullSangam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [digits, setDigits] = useState("");
  const [closedigits, setClosedigits] = useState("");
  const [points, setPoints] = useState("");
  const [bidDate, setBidDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );
  const [bids, setBids] = useState([]);
  const [error, setError] = useState([]);
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get market data from location state
  const {
    marketId = "",
    marketTitle = "Market",
    bidDate: locationBidDate = new Date().toISOString(),
    gameName = "Full Sangam",
    openTime = "",
    closeTime = "",
    status = "",
  } = location.state || {};

  const autocompleteRef = useRef(null);
  const autocompleteCloseRef = useRef(null);

  const pannaOptions = [
    "000",
    "100",
    "110",
    "111",
    "112",
    "113",
    "114",
    "115",
    "116",
    "117",
    "118",
    "119",
    "120",
    "122",
    "123",
    "124",
    "125",
    "126",
    "127",
    "128",
    "129",
    "130",
    "133",
    "134",
    "135",
    "136",
    "137",
    "138",
    "139",
    "140",
    "144",
    "145",
    "146",
    "147",
    "148",
    "149",
    "150",
    "155",
    "156",
    "157",
    "158",
    "159",
    "160",
    "166",
    "167",
    "168",
    "169",
    "170",
    "177",
    "178",
    "179",
    "180",
    "188",
    "189",
    "190",
    "199",
    "200",
    "220",
    "222",
    "223",
    "224",
    "225",
    "226",
    "227",
    "228",
    "229",
    "230",
    "233",
    "234",
    "235",
    "236",
    "237",
    "238",
    "239",
    "240",
    "244",
    "245",
    "246",
    "247",
    "248",
    "249",
    "250",
    "255",
    "256",
    "257",
    "258",
    "259",
    "260",
    "266",
    "267",
    "268",
    "269",
    "270",
    "277",
    "278",
    "279",
    "280",
    "288",
    "289",
    "290",
    "299",
    "300",
    "330",
    "333",
    "334",
    "335",
    "336",
    "337",
    "338",
    "339",
    "340",
    "344",
    "345",
    "346",
    "347",
    "348",
    "349",
    "350",
    "355",
    "356",
    "357",
    "358",
    "359",
    "360",
    "366",
    "367",
    "368",
    "369",
    "370",
    "377",
    "378",
    "379",
    "380",
    "388",
    "389",
    "390",
    "399",
    "400",
    "440",
    "444",
    "445",
    "446",
    "447",
    "448",
    "449",
    "450",
    "455",
    "456",
    "457",
    "458",
    "459",
    "460",
    "466",
    "467",
    "468",
    "469",
    "470",
    "477",
    "478",
    "479",
    "480",
    "488",
    "489",
    "490",
    "499",
    "500",
    "550",
    "555",
    "556",
    "557",
    "558",
    "559",
    "560",
    "566",
    "567",
    "568",
    "569",
    "570",
    "577",
    "578",
    "579",
    "580",
    "588",
    "589",
    "590",
    "599",
    "600",
    "660",
    "666",
    "667",
    "668",
    "669",
    "670",
    "677",
    "678",
    "679",
    "680",
    "688",
    "689",
    "690",
    "699",
    "700",
    "770",
    "777",
    "778",
    "779",
    "780",
    "788",
    "789",
    "790",
    "799",
    "800",
    "880",
    "888",
    "889",
    "890",
    "899",
    "900",
    "990",
    "999",
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

  const handleAddBid = async (e) => {
    e.preventDefault();

    const pointsValue = parseInt(points);
    if (pointsValue < 10 || pointsValue > 1000) {
      setError(["Please enter min 10 to 1000 Points!"]);
      return;
    }

    if (!digits || !closedigits) {
      setError(["Please select both Open and Close Panna!"]);
      return;
    }

    if (pointsValue > walletAmount) {
      setError(["Insufficient wallet balance"]);
      return;
    }

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

      const token = localStorage.getItem("token");
      const requestBody = {
        date: new Date(locationBidDate).toISOString().split("T")[0],
        type: "Regular",
        addUserDTO: {
          id: userData.id,
        },
        mainMarketDTO: {
          marketId: parseInt(marketId),
        },
        openPanna: digits,
        closeDigit: closedigits,
        points: pointsValue,
      };

      const response = await fetch(`${API_BASE_URL2}/full-sangam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200 || response.status === 201) {
        console.log("Data Saved Successfully");
        console.log(JSON.stringify(requestBody, null, 2));
      }

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

      // Add to local bids list
      const newBid = {
        id: Date.now(),
        digits,
        closedigits,
        points: pointsValue,
      };

      setBids([...bids, newBid]);
      setWalletAmount((prev) => prev - pointsValue);
      toastr.success("Bid submitted successfully!");

      // Reset form
      setDigits("");
      setClosedigits("");
      setPoints("");
      setError([]);
    } catch (err) {
      console.error("Error submitting bid:", err);
      setError([err.message]);
      toastr.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBid = (id) => {
    setBids(bids.filter((bid) => bid.id !== id));
  };

  const handlePointsChange = (e) => {
    const value = e.target.value;
    const numValue = parseInt(value) || "";

    if (numValue !== "" && (numValue < 10 || numValue > 1000)) {
      toastr.error("Please enter min 10 to 1000 Points!");
    }

    setPoints(numValue);
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
              <form id="myform">
                <input type="hidden" name="game_id" value="40" />
                <input type="hidden" name="pana_name" value="Full Sangam" />
                <input type="hidden" name="page" value="full-sangam" />
                <input type="hidden" name="game_name" value={gameName} />
                <input type="hidden" name="slug" value="full-sangam" />
                <input type="hidden" name="session" value="close" />

                <div className="fxdsng sticky-top bg-white">
                  <div className="row gy-3 px-0">
                    <div className="col-sm-12 mb-2 mt-0 px-0">
                      <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
                        <h5 className="fw-semibild m-0">
                          <Link to="/game" state={location.state}>
                            <span className="ri-arrow-left-line me-3"></span>
                          </Link>
                          {marketTitle} - Full Sangam | Status: {status} | Open:{" "}
                          {openTime} - Close: {closeTime}
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

                  <div className="row row-cols-xl-6 row-cols-lg-5 row-cols-md-5 row-cols-sm-5 row-cols-4 gy-3 px-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                      <input
                        type="text"
                        readOnly
                        className="form-control w-auto"
                        value={bidDate}
                      />
                      <input
                        type="hidden"
                        className="form-control w-auto"
                        name="bid_date"
                        value={locationBidDate}
                      />
                    </div>
                  </div>

                  <div className="form-group row px-3">
                    {error.length > 0 && (
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {error.map((err, index) => (
                            <li key={index}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <label className="col-md-3 col-5 pt-3">Open Panna</label>
                    <div className="col-md-9 col-7 mt-3">
                      <input
                        type="text"
                        name="digits"
                        className="form-control"
                        id="autocomplete"
                        autoComplete="off"
                        ref={autocompleteRef}
                        value={digits}
                        onChange={(e) => setDigits(e.target.value)}
                        list="pannaOptions"
                      />
                      <datalist id="pannaOptions">
                        {pannaOptions.map((option, index) => (
                          <option key={index} value={option} />
                        ))}
                      </datalist>
                    </div>

                    <label className="col-md-3 col-5 pt-3">Close Panna</label>
                    <div className="col-md-9 col-7 mt-3">
                      <input
                        type="text"
                        name="closedigits"
                        id="autocompleteclose"
                        className="form-control"
                        autoComplete="off"
                        ref={autocompleteCloseRef}
                        value={closedigits}
                        onChange={(e) => setClosedigits(e.target.value)}
                        list="pannaOptionsClose"
                      />
                      <datalist id="pannaOptionsClose">
                        {pannaOptions.map((option, index) => (
                          <option key={index} value={option} />
                        ))}
                      </datalist>
                    </div>

                    <label className="col-md-3 col-5 pt-3">Points</label>
                    <div className="col-md-9 col-7 mt-3">
                      <input
                        type="number"
                        max="1000"
                        min="10"
                        name="points"
                        id="points"
                        className="form-control"
                        value={points}
                        onChange={handlePointsChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-grid gap-2 col-4 mx-auto py-3">
                    <button
                      type="button"
                      className="btn btn-warning btnadd"
                      onClick={handleAddBid}
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>

                <div className="select-digit-wrap snank mt-4 spb">
                  <div className="scrrolar d-flex flex-column gap-4 px-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sangam</th>
                          <th scope="col">Points</th>
                          <th scope="col">Game Type</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody className="tdata">
                        {bids.map((bid) => (
                          <tr key={bid.id}>
                            <td>
                              {bid.digits}-{bid.closedigits}
                            </td>
                            <td>{bid.points}</td>
                            <td>Full Sangam</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm deletebtn"
                                onClick={() => handleDeleteBid(bid.id)}
                                disabled={isLoading}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullSangam;
