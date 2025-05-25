import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { API_BASE_URL, API_BASE_URL2 } from "../api";

const SPMotorForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get market data from location state
  const {
    marketId = 1,
    marketTitle = "SP Motor",
    bidDate: locationBidDate = new Date().toISOString(),
  } = location.state || {};

  const [session, setSession] = useState("Open");
  const [digit, setDigit] = useState("");
  const [points, setPoints] = useState("");
  const [bids, setBids] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  const handleAddBid = (e) => {
    e.preventDefault();

    const pointsValue = parseInt(points);
    if (pointsValue < 10 || pointsValue > 1000) {
      setError(["Please enter min 10 to 1000 Points!"]);
      return;
    }

    if (!digit) {
      setError(["Please enter a digit."]);
      return;
    }

    if (pointsValue > walletAmount) {
      setError(["Insufficient wallet balance"]);
      return;
    }

    const newBid = {
      id: Date.now(),
      digit,
      points: pointsValue,
      session,
    };

    setBids([...bids, newBid]);
    // Update wallet amount locally
    setWalletAmount((prev) => prev - pointsValue);
    setDigit("");
    setPoints("");
    setError([]);
  };

  const handleReset = () => {
    // Return points to wallet when resetting
    const totalPoints = bids.reduce(
      (sum, bid) => sum + parseInt(bid.points),
      0
    );
    setWalletAmount((prev) => prev + totalPoints);
    setBids([]);
    setDigit("");
    setPoints("");
    setSession("Open");
    setError([]);
  };

  const totalBids = bids.length;
  const totalPoints = bids.reduce((sum, bid) => sum + parseInt(bid.points), 0);

  const handleDeleteBid = (id) => {
    const bidToDelete = bids.find((bid) => bid.id === id);
    if (bidToDelete) {
      setWalletAmount((prev) => prev + parseInt(bidToDelete.points));
    }
    setBids(bids.filter((bid) => bid.id !== id));
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
        date: formatDateForAPI(locationBidDate), // Use bidDate from location state
        digit: parseInt(bid.digit),
        points: bid.points,
        gameType: bid.session.toLowerCase(), // Convert to lowercase as per API requirement
        addUserDTO: {
          id: userData.id,
        },
        mainMarketDTO: {
          marketId: parseInt(marketId), // Use marketId from location state
        },
      }));

      const response = await fetch(`${API_BASE_URL2}/spmotor`, {
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
      setError([err.message]);
      toastr.error(err.message);
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
    <div className="container py-4">
      <h4 className="mb-4">SP Motor - {marketTitle}</h4>

      {/* Wallet Display */}
      <div className="row mb-3">
        <div className="col-12 text-end">
          <div className="d-inline-block px-3 py-1 rounded-2 bg-warning bg-opacity-25">
            <i className="ri-wallet-3-line fs-6"></i>
            <span className="ms-2 fs-6">{walletAmount.toLocaleString()}</span>
          </div>
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
        <div className="col-6">
          <Form.Control
            type="text"
            value={formatDate(locationBidDate)}
            readOnly
          />
        </div>
        <div className="col-6">
          <Form.Select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            disabled={isLoading}
          >
            <option value="Open">OPEN</option>
            <option value="Close">CLOSE</option>
          </Form.Select>
        </div>
      </div>

      <Form onSubmit={handleAddBid} className="mb-4">
        <div className="row">
          <div className="col-6">
            <Form.Group>
              <Form.Label>Digit</Form.Label>
              <Form.Control
                type="number"
                value={digit}
                onChange={(e) => setDigit(e.target.value)}
                placeholder="Enter Digit"
                disabled={isLoading}
              />
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter Points"
                min="10"
                max="1000"
                disabled={isLoading}
              />
            </Form.Group>
          </div>
        </div>

        <Button
          type="submit"
          variant="warning"
          className="mt-3"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </Form>

      <Table bordered>
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
              <td>{bid.session}</td>
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
          {bids.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No bids added
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex gap-2">
        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={isLoading || bids.length === 0}
        >
          Reset
        </Button>
        <Button
          variant="warning"
          onClick={() => setShowModal(true)}
          disabled={isLoading || bids.length === 0}
        >
          Submit
        </Button>
      </div>

      {/* Submit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>
            {marketTitle} - {formatDate(locationBidDate)}
          </Modal.Title>
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
                  <td>{bid.session}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between mt-3">
            <h6>Total Bids: {totalBids}</h6>
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
          <Button variant="warning" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Confirm Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SPMotorForm;
