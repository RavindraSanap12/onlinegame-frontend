import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainResultUpload.css";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

const MainResultUpload = () => {
  const navigate = useNavigate();
  const [resultDate, setResultDate] = useState("");
  const [game, setGame] = useState("");
  const [session, setSession] = useState("");
  const [highlight, setHighlight] = useState("");
  const [openPanna, setOpenPanna] = useState("");
  const [openAnk, setOpenAnk] = useState("");
  const [closePanna, setClosePanna] = useState("");
  const [closeAnk, setCloseAnk] = useState("");
  const [jodi, setJodi] = useState("");
  const [sendNotification, setSendNotification] = useState(false);

  const [games, setGames] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [winners, setWinners] = useState([]);

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

  useEffect(() => {
    fetchGames();
    fetchResults();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/main-markets`, {
        headers: getAuthHeaders(),
      });
      setGames(response.data);
    } catch (error) {
      handleApiError(error);
      console.error("Failed to fetch games:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/main-market-results`, {
        headers: getAuthHeaders(),
      });
      setResults(response.data);
    } catch (error) {
      handleApiError(error);
      console.error("Failed to fetch results:", error);
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/winners`, {
        headers: getAuthHeaders(),
        params: {
          game,
          session,
          resultDate,
        },
      });
      setWinners(response.data);
    } catch (error) {
      handleApiError(error);
      console.error("Failed to fetch winners:", error);
    }
  };

  const handleSave = async () => {
    if (!resultDate || !game || !session) {
      setSaveError("Date, Game and Session are required fields");
      return;
    }

    const resultData = {
      resultDate,
      game,
      session,
      highlight,
      openPanna,
      openAnk,
      closePanna,
      closeAnk,
      jodi,
      sendNotification,
    };

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await axios.post(`${API_BASE_URL}/main-market-results`, resultData, {
        headers: getAuthHeaders(),
      });
      setSaveSuccess(true);
      resetForm();
      fetchResults();
      if (sendNotification) {
        fetchWinners();
      }
    } catch (error) {
      handleApiError(error);
      setSaveError(
        error.response?.data?.message ||
          "Failed to save result. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const declareWinners = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/declare-winners`,
        {
          game,
          session,
          resultDate,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      setShowWinnerPopup(false);
      fetchWinners();
    } catch (error) {
      handleApiError(error);
      console.error("Failed to declare winners:", error);
    }
  };

  const resetForm = () => {
    setResultDate("");
    setGame("");
    setSession("");
    setHighlight("");
    setOpenPanna("");
    setOpenAnk("");
    setClosePanna("");
    setCloseAnk("");
    setJodi("");
    setSendNotification(false);
  };

  const filteredResults = results.filter((result) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (result.game && result.game.toLowerCase().includes(lowerSearch)) ||
      (result.resultDate &&
        result.resultDate.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="game-result-container">
      {/* Upload Form */}
      <div className="panel">
        <div className="panel-header">
          <h2>Upload Game Result</h2>
        </div>
        <div className="panel-body">
          {saveError && <div className="error-message">{saveError}</div>}
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
                {games.map((g, index) => (
                  <option key={index} value={g.title}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="session">Session *</label>
              <select
                id="session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                required
              >
                <option value="">Choose Session</option>
                <option value="Morning">Morning</option>
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="highlight">Highlight</label>
              <input
                type="text"
                id="highlight"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="Highlight message"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="openPanna">Open Panna</label>
              <input
                type="text"
                id="openPanna"
                value={openPanna}
                onChange={(e) => setOpenPanna(e.target.value)}
                placeholder="Open Panna"
              />
            </div>
            <div className="form-group">
              <label htmlFor="openAnk">Open Ank</label>
              <input
                type="text"
                id="openAnk"
                value={openAnk}
                onChange={(e) => setOpenAnk(e.target.value)}
                placeholder="Open Ank"
              />
            </div>
            <div className="form-group">
              <label htmlFor="closePanna">Close Panna</label>
              <input
                type="text"
                id="closePanna"
                value={closePanna}
                onChange={(e) => setClosePanna(e.target.value)}
                placeholder="Close Panna"
              />
            </div>
            <div className="form-group">
              <label htmlFor="closeAnk">Close Ank</label>
              <input
                type="text"
                id="closeAnk"
                value={closeAnk}
                onChange={(e) => setCloseAnk(e.target.value)}
                placeholder="Close Ank"
              />
            </div>
            <div className="form-group">
              <label htmlFor="jodi">Jodi</label>
              <input
                type="text"
                id="jodi"
                value={jodi}
                onChange={(e) => setJodi(e.target.value)}
                placeholder="Jodi"
              />
            </div>
            <div className="form-group notification-container">
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
                className="btn btn-success"
                onClick={() => setShowWinnerPopup(true)}
                type="button"
              >
                <i className="fa fa-eye"></i> View Winners
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-save"
              onClick={handleSave}
              disabled={isSaving}
              type="button"
            >
              {isSaving ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fa fa-save"></i> Save Result
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Declared Result List */}
      <div className="panel">
        <div className="panel-header">
          <h2>Declared Result List</h2>
        </div>
        <div className="panel-body">
          <div className="table-controls">
            <div>
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
            <div>
              Search:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by game or date"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Game</th>
                  <th>Session</th>
                  <th>Open Panna</th>
                  <th>Open Ank</th>
                  <th>Close Panna</th>
                  <th>Close Ank</th>
                  <th>Jodi</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults
                    .slice(0, entriesPerPage)
                    .map((result, index) => (
                      <tr key={result.id}>
                        <td>{index + 1}</td>
                        <td>{result.resultDate || "-"}</td>
                        <td>{result.game || "-"}</td>
                        <td>{result.session || "-"}</td>
                        <td>{result.openPanna || "-"}</td>
                        <td>{result.openAnk || "-"}</td>
                        <td>{result.closePanna || "-"}</td>
                        <td>{result.closeAnk || "-"}</td>
                        <td>{result.jodi || "-"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No results available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-info">
            Showing {Math.min(filteredResults.length, entriesPerPage)} of{" "}
            {filteredResults.length} entries
          </div>
        </div>
      </div>
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

export default MainResultUpload;
