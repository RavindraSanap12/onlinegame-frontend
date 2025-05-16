import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StarlineResultUpload.css";
import axios from "axios";
import { API_BASE_URL } from "../api";

const StarlineResultUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resultDate: formatDateForInput(new Date()),
    game: "",
    session: "",
    highlight: "No",
    panna: "",
    ank: "",
    sendNotification: false,
  });

  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
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

  // Helper function to format date for input field (YYYY-MM-DD)
  function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch games and results on component mount
  useEffect(() => {
    fetchGames();
    fetchResults();
  }, []);

  // Filter results when search term or entries to show changes
  useEffect(() => {
    const filtered = results.filter(
      (result) =>
        result.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.panna.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.ank.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [searchTerm, results, entriesToShow]);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/starlines`, {
        headers: getAuthHeaders(),
      });
      setGames(response.data);
    } catch (error) {
      handleApiError(error);
      setError("Failed to fetch games list");
      console.error(error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/starline-market-results`,
        {
          headers: getAuthHeaders(),
        }
      );
      setResults(response.data);
      setFilteredResults(response.data);
    } catch (error) {
      handleApiError(error);
      setError("Failed to fetch results");
      console.error(error);
    }
  };

  // Fetch winners data
  const fetchWinners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/starline-winners`, {
        headers: getAuthHeaders(),
        params: {
          game: formData.game,
          resultDate: formData.resultDate,
          session: formData.session,
        },
      });
      setWinners(response.data);
      setIsLoading(false);
    } catch (err) {
      handleApiError(err);
      console.error("Failed to fetch winners:", err);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleViewWinners = () => {
    if (!formData.game || !formData.resultDate || !formData.session) {
      setError("Please select game, date and session first");
      return;
    }
    setShowWinnerPopup(true);
    fetchWinners();
  };

  const handleClosePopup = () => {
    setShowWinnerPopup(false);
    setIsLoading(true);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const payload = {
        ...formData,
        resultDate: formData.resultDate,
      };

      await axios.post(`${API_BASE_URL}/starline-market-results`, payload, {
        headers: getAuthHeaders(),
      });

      setSaveSuccess(true);
      fetchResults(); // Refresh the results list

      // Reset form but keep the date
      setFormData({
        ...formData,
        game: "",
        session: "",
        highlight: "No",
        panna: "",
        ank: "",
        sendNotification: false,
      });

      // Fetch winners if notification was sent
      if (formData.sendNotification) {
        fetchWinners();
      }
    } catch (error) {
      handleApiError(error);
      setError(error.response?.data?.message || "Failed to save result");
      console.error("Error saving result:", error);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Declare winners
  const declareWinners = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/declare-starline-winners`,
        {
          game: formData.game,
          resultDate: formData.resultDate,
          session: formData.session,
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

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = Math.min(startIndex + entriesToShow, filteredResults.length);
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Calculate total winning amount
  const totalWinningAmount = winners.reduce(
    (sum, winner) => sum + (winner.winningAmount || 0),
    0
  );

  return (
    <div className="starline-upload-container">
      {/* Upload Game Result Section */}
      <div className="starline-upload-panel">
        <div className="starline-upload-panel-header">
          <h2>Upload Game Result</h2>
        </div>
        <div className="starline-upload-panel-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="starline-upload-error-message">{error}</div>}
            {saveSuccess && (
              <div className="starline-upload-success-message">
                Result saved successfully!
              </div>
            )}
            <div className="starline-upload-form-row">
              <div className="starline-upload-form-group">
                <label htmlFor="resultDate">
                  Result Date{" "}
                  <span className="starline-upload-required">*</span>
                </label>
                <div className="starline-upload-date-input">
                  <input
                    type="date"
                    id="resultDate"
                    name="resultDate"
                    value={formData.resultDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="starline-upload-form-group">
                <label htmlFor="game">
                  Game <span className="starline-upload-required">*</span>
                </label>
                <select
                  id="game"
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Game</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.title}>
                      {game.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="starline-upload-form-group">
                <label htmlFor="session">
                  Session <span className="starline-upload-required">*</span>
                </label>
                <select
                  id="session"
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Session</option>
                  <option value="Morning">Morning</option>
                  <option value="Day">Day</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div className="starline-upload-form-group">
                <label htmlFor="highlight">
                  Highlight <span className="starline-upload-required">*</span>
                </label>
                <select
                  id="highlight"
                  name="highlight"
                  value={formData.highlight}
                  onChange={handleChange}
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
            <div className="starline-upload-form-row">
              <div className="starline-upload-form-group">
                <label htmlFor="panna">
                  Panna <span className="starline-upload-required">*</span>
                </label>
                <input
                  type="text"
                  id="panna"
                  name="panna"
                  value={formData.panna}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{3}"
                  title="Please enter a 3-digit number"
                />
              </div>
              <div className="starline-upload-form-group">
                <label htmlFor="ank">
                  Ank <span className="starline-upload-required">*</span>
                </label>
                <input
                  type="text"
                  id="ank"
                  name="ank"
                  value={formData.ank}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{1}"
                  title="Please enter a single digit"
                />
              </div>
              <div className="starline-upload-form-group starline-upload-checkbox-group">
                <input
                  type="checkbox"
                  id="sendNotification"
                  name="sendNotification"
                  checked={formData.sendNotification}
                  onChange={handleChange}
                />
                <label htmlFor="sendNotification">Send Notification</label>
              </div>
              <div className="starline-upload-form-group starline-upload-button-group">
              <button
                  type="button"
                  className="btn-btn-success"
                  onClick={() => setShowWinnerPopup(true)}
                >
                  <i className="fa fa-eye"></i> View Winners
                </button>
              </div>
            </div>
            <div className="starline-upload-form-row">
              <div className="starline-upload-form-group">
                <button
                  className="starline-upload-save-btn"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="starline-upload-spinner"></span> Saving...
                    </>
                  ) : (
                    "Save Result"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Declared Result List Section */}
      <div className="starline-upload-panel">
        <div className="starline-upload-panel-header">
          <h2>Declared Result List</h2>
        </div>
        <div className="starline-upload-panel-body">
          <div className="starline-upload-table-controls">
            <div className="starline-upload-entries-control">
              Show
              <select
                value={entriesToShow}
                onChange={(e) => setEntriesToShow(Number(e.target.value))}
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
              entries
            </div>
            <div className="starline-upload-search-control">
              Search:
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="starline-upload-table-responsive">
            <table className="starline-upload-result-table">
              <thead>
                <tr>
                  <th className="starline-upload-sortable">
                    # <span className="starline-upload-sort-icon">▲</span>
                  </th>
                  <th className="starline-upload-sortable">
                    Date <span className="starline-upload-sort-icon">▲</span>
                  </th>
                  <th className="starline-upload-sortable">
                    Game <span className="starline-upload-sort-icon">▲</span>
                  </th>
                  <th className="starline-upload-sortable">
                    Session <span className="starline-upload-sort-icon">▲</span>
                  </th>
                  <th className="starline-upload-sortable">
                    Highlight{" "}
                    <span className="starline-upload-sort-icon">▲</span>
                  </th>
                  <th className="starline-upload-sortable">
                    Panna <span className="starline-upload-sort-icon">▲</span>
                  </th>
                  <th className="starline-upload-sortable">
                    Ank <span className="starline-upload-sort-icon">▲</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentResults.length > 0 ? (
                  currentResults.map((result, index) => (
                    <tr key={index}>
                      <td>{startIndex + index + 1}</td>
                      <td>
                        {new Date(result.resultDate).toLocaleDateString()}
                      </td>
                      <td>{result.game}</td>
                      <td>{result.session}</td>
                      <td>{result.highlight}</td>
                      <td>{result.panna}</td>
                      <td>{result.ank}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="starline-upload-no-data">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="starline-upload-table-footer">
            <div className="starline-upload-showing-entries">
              Showing {filteredResults.length > 0 ? startIndex + 1 : 0} to{" "}
              {endIndex} of {filteredResults.length} entries
            </div>
            <div className="starline-upload-pagination">
              <button
                className="starline-upload-page-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="starline-upload-page-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Winner List Popup */}
      {showWinnerPopup && (
        <div className="winner-popup-overlay">
          <div className="winner-popup">
            <div className="winner-popup-header">
              <h3>Winner List</h3>
              <button className="winner-popup-close" onClick={handleClosePopup}>
                ×
              </button>
            </div>
            <div className="winner-popup-content">
              {isLoading ? (
                <div className="winner-popup-loading">Loading......</div>
              ) : (
                <div className="winner-popup-data">
                  <div className="winner-popup-navigation">
                    <button className="winner-popup-nav-btn">◀</button>
                    <button className="winner-popup-nav-btn">▶</button>
                  </div>
                  <div className="winner-popup-winner-list">
                    {winners.length > 0 ? (
                      <table className="winner-popup-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Mobile</th>
                            <th>Game</th>
                            <th>Session</th>
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
                              <td>{winner.session}</td>
                              <td>₹{winner.winningAmount?.toFixed(2) || "0.00"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="winner-popup-no-winners">
                        No winners found
                      </div>
                    )}
                  </div>
                  <div className="winner-popup-summary">
                    Total Winners: {winners.length} | Amount: ₹
                    {totalWinningAmount.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
            <div className="winner-popup-footer">
              <button
                className="winner-popup-btn cancel-btn"
                onClick={handleClosePopup}
              >
                Cancel
              </button>
              <button
                className="winner-popup-btn declare-btn"
                onClick={declareWinners}
                disabled={winners.length === 0}
              >
                Declare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarlineResultUpload;