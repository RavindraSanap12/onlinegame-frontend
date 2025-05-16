import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DelhiResultUpload.css";
import axios from "axios";
import { API_BASE_URL } from "../api";

const DelhiResultUpload = () => {
  const navigate = useNavigate();
  const [resultDate, setResultDate] = useState("");
  const [game, setGame] = useState("");
  const [highlight, setHighlight] = useState("");
  const [jodi, setJodi] = useState("");
  const [sendNotification, setSendNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [games, setGames] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [winners, setWinners] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return {};
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Handle API errors consistently
  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      navigate("/login");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(error.response?.data?.message || "Request failed");
  };

  // Fetch games list on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/delhi-markets`, {
          headers: getAuthHeaders(),
        });
        setGames(response.data);
      } catch (err) {
        handleApiError(err);
        setError("Failed to fetch games list");
        console.error(err);
      }
    };

    fetchGames();
  }, []);

  // Fetch results data
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/delhi-market-results`,
          {
            headers: getAuthHeaders(),
          }
        );
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        handleApiError(err);
        setError("Failed to fetch results");
        console.error(err);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Fetch winners data
  const fetchWinners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/winners`, {
        headers: getAuthHeaders(),
        params: {
          game,
          resultDate,
        },
      });
      setWinners(response.data);
    } catch (err) {
      handleApiError(err);
      console.error("Failed to fetch winners:", err);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resultDate || !game || !jodi) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);

      const formattedDate = new Date(resultDate).toISOString().split("T")[0];

      const resultData = {
        resultDate: formattedDate,
        game,
        highlight,
        jodi,
        sendNotification,
      };

      await axios.post(`${API_BASE_URL}/delhi-market-results`, resultData, {
        headers: getAuthHeaders(),
      });

      // Refresh results after successful submission
      const updatedResults = await axios.get(
        `${API_BASE_URL}/delhi-market-results`,
        {
          headers: getAuthHeaders(),
        }
      );
      setResults(updatedResults.data);
      setSaveSuccess(true);

      // Reset form
      setResultDate("");
      setGame("");
      setHighlight("");
      setJodi("");
      setSendNotification(false);

      // Fetch winners if notification was sent
      if (sendNotification) {
        fetchWinners();
      }
    } catch (err) {
      handleApiError(err);
      setError(err.response?.data?.message || "Failed to save result");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Declare winners
  const declareWinners = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/declare-winners`,
        {
          game,
          resultDate,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      setShowWinnerPopup(false);
      fetchWinners();
    } catch (err) {
      handleApiError(err);
      console.error("Failed to declare winners:", err);
    }
  };

  return (
    <div className="game-result-container">
      {/* Upload Game Result Panel */}
      <div className="panel">
        <div className="panel-header">
          <h2>Upload Game Result</h2>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {saveSuccess && (
              <div className="success-message">Result saved successfully!</div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="resultDate">Result Date *</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    id="resultDate"
                    value={resultDate}
                    onChange={(e) => setResultDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="game">Game *</label>
                <select
                  id="game"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  required
                >
                  <option value="">Choose Game</option>
                  {games.map((gameItem) => (
                    <option key={gameItem.id} value={gameItem.title}>
                      {gameItem.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="highlight">Highlight</label>
                <input
                  id="highlight"
                  type="text"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group jodi-group">
                <label htmlFor="jodi">Jodi *</label>
                <input
                  type="text"
                  id="jodi"
                  value={jodi}
                  onChange={(e) => setJodi(e.target.value)}
                  required
                  maxLength="2"
                  pattern="[0-9]{2}"
                  title="Please enter a 2-digit number"
                />
              </div>
              <div className="form-group notification-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={sendNotification}
                    onChange={() => setSendNotification(!sendNotification)}
                  />
                  <span className="checkmark"></span>
                  Send Notification
                </label>
                <button
                  type="button"
                  className="btn-btn-success"
                  onClick={() => setShowWinnerPopup(true)}
                >
                  <i className="fa fa-eye"></i> View Winners
                </button>
              </div>
            </div>
            <div className="form-footer">
              <button
                type="submit"
                className="btn btn-save"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="fa fa-save"></i> Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Declared Result List Panel */}
      <div className="panel">
        <div className="panel-header">
          <h2>Declared Result List</h2>
        </div>
        <div className="panel-body">
          <div className="table-controls">
            <div className="entries-control">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              entries
            </div>
            <div className="search-control">
              Search:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
              />
            </div>
          </div>
          <div className="table-container">
            {loading ? (
              <div className="loading-message">Loading data...</div>
            ) : (
              <table className="results-table">
                <thead>
                  <tr>
                    <th className="sortable">
                      # <span className="sort-icon">▲</span>
                    </th>
                    <th className="sortable">Date</th>
                    <th className="sortable">Game</th>
                    <th className="sortable">Result</th>
                    <th className="sortable">Highlight</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length > 0 ? (
                    results
                      .filter((result) =>
                        Object.values(result).some(
                          (val) =>
                            val &&
                            val
                              .toString()
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                      )
                      .slice(0, entriesPerPage)
                      .map((result, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{formatDisplayDate(result.resultDate)}</td>
                          <td>{result.game}</td>
                          <td>{result.jodi}</td>
                          <td>{result.highlight || "-"}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div className="pagination-info">
            <div className="showing-entries">
              Showing 1 to {Math.min(results.length, entriesPerPage)} of{" "}
              {results.length} entries
            </div>
            <div className="pagination-controls">
              <button className="btn-pagination" disabled>
                Previous
              </button>
              <button className="btn-pagination" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Winner List Popup */}
      {showWinnerPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <h3>Winner List</h3>
              <button
                className="close-btn"
                onClick={() => setShowWinnerPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="popup-body">
              <div className="winner-list-container">
                <div className="winner-list">
                  {winners.length > 0 ? (
                    <table className="winner-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Mobile</th>
                          <th>Game</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {winners.map((winner, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{winner.userName}</td>
                            <td>{winner.mobileNo}</td>
                            <td>{winner.gameName}</td>
                            <td>
                              ₹{winner.winningAmount?.toFixed(2) || "0.00"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-winners">No winners found</p>
                  )}
                </div>
              </div>
              <div className="winner-summary">
                <p className="total-winner">
                  Total Winners: {winners.length} | Amount: ₹
                  {winners
                    .reduce((sum, w) => sum + (w.winningAmount || 0), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
            <div className="popup-footer">
              <button
                className="btn btn-cancel"
                onClick={() => setShowWinnerPopup(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-declare"
                onClick={declareWinners}
                disabled={winners.length === 0}
              >
                Declare Winners
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DelhiResultUpload;
