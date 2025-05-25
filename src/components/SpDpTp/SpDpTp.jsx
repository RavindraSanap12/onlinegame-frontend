import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { API_BASE_URL, API_BASE_URL2 } from "../api";

function Spdptp() {
  const [session, setSession] = useState("Open");
  const [selectedGames, setSelectedGames] = useState({
    sp: false,
    dp: false,
    tp: false,
  });
  const [digit, setDigit] = useState("");
  const [points, setPoints] = useState("");
  const [bids, setBids] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get market data from location state
  const {
    marketId = 1,
    marketTitle = "Market",
    bidDate: locationBidDate = new Date().toISOString(),
  } = location.state || {};

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

  const handleCheckboxChange = (e) => {
    setSelectedGames({
      ...selectedGames,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAddBid = () => {
    const pointsValue = parseInt(points);
    if (pointsValue < 10 || pointsValue > 1000) {
      setError(["Please enter min 10 to 1000 Points!"]);
      return;
    }

    const selectedGameTypes = Object.keys(selectedGames).filter(
      (key) => selectedGames[key]
    );

    if (!digit || selectedGameTypes.length === 0) {
      setError(["Please fill digit and select at least one game type."]);
      return;
    }

    if (pointsValue * selectedGameTypes.length > walletAmount) {
      setError(["Insufficient wallet balance"]);
      return;
    }

    selectedGameTypes.forEach((type) => {
      setBids((prev) => [
        ...prev,
        {
          id: Date.now(),
          digit,
          points: pointsValue,
          gameType: type.toUpperCase(),
          gameTypeCode: type === "sp" ? 1 : type === "dp" ? 2 : 3,
        },
      ]);
    });

    // Update wallet amount locally
    setWalletAmount((prev) => prev - pointsValue * selectedGameTypes.length);

    // Clear inputs after add
    setDigit("");
    setPoints("");
    setSelectedGames({ sp: false, dp: false, tp: false });
    setError([]);
  };

  const totalPoints = bids.reduce((acc, bid) => acc + parseInt(bid.points), 0);

  const handleDeleteBid = (id) => {
    const bidToDelete = bids.find((bid) => bid.id === id);
    if (bidToDelete) {
      setWalletAmount((prev) => prev + parseInt(bidToDelete.points));
    }
    setBids(bids.filter((bid) => bid.id !== id));
  };

  const handleSubmitBids = async () => {
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
        date: new Date(locationBidDate).toISOString().split("T")[0],
        digit: parseInt(bid.digit),
        points: bid.points,
        gameType: bid.gameTypeCode,
        addUserDTO: {
          id: userData.id,
        },
        mainMarketDTO: {
          marketId: parseInt(marketId),
        },
      }));

      const response = await fetch(`${API_BASE_URL2}/spdptp`, {
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

      // Clear bids on successful submission
      setBids([]);
      toastr.success("Bids submitted successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting bids:", err);
      setError([err.message]);
      toastr.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
      <h4 className="text-center">SP DP TP Game</h4>

      {/* Wallet Display */}
      <div className="row mb-3">
        <div className="col-12 text-end">
          <div className="d-inline-block px-3 py-1 rounded-2 bg-warning bg-opacity-25">
            <i className="ri-wallet-3-line fs-6"></i>
            <span className="ms-2 fs-6">{walletAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-6">
          <Form.Control
            type="text"
            value={new Date().toLocaleDateString()}
            readOnly
          />
        </div>
        <div className="col-6">
          <Form.Select
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="Open">OPEN</option>
            <option value="Close">CLOSE</option>
          </Form.Select>
        </div>
      </div>

      {error.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {error.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row my-3">
        {["sp", "dp", "tp"].map((type) => (
          <div className="col-4" key={type}>
            <Form.Check
              type="checkbox"
              label={type.toUpperCase()}
              name={type}
              checked={selectedGames[type]}
              onChange={handleCheckboxChange}
            />
          </div>
        ))}
      </div>

      <div className="row my-3">
        <div className="col-6">
          <Form.Control
            type="number"
            placeholder="Digit"
            value={digit}
            min="0"
            max="9"
            onChange={(e) => setDigit(e.target.value)}
          />
        </div>
        <div className="col-6">
          <Form.Control
            type="number"
            placeholder="Points"
            value={points}
            min="10"
            max="1000"
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
      </div>

      <Button
        variant="warning"
        className="w-50 mx-auto d-block"
        onClick={handleAddBid}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add"}
      </Button>

      {/* Table */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Digit</th>
            <th>Points</th>
            <th>Game Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid.id}>
              <td>{bid.digit}</td>
              <td>{bid.points}</td>
              <td>{bid.gameType}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteBid(bid.id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        variant="success"
        className="w-50 mx-auto d-block my-3"
        onClick={() => setShowModal(true)}
        disabled={bids.length === 0 || isLoading}
      >
        Submit
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>Bid Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead>
              <tr>
                <th>Digit</th>
                <th>Points</th>
                <th>Game Type</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.digit}</td>
                  <td>{bid.points}</td>
                  <td>{bid.gameType}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between mt-3">
            <h6>Total Bids: {bids.length}</h6>
            <h6>Total Points: {totalPoints}</h6>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleSubmitBids}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Spdptp;
