import React, { useState, useEffect } from "react";
import "./RunningGamesList.css";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

const RunningGamesList = () => {
  const [mainGames, setMainGames] = useState([]);
  const [delhiGames, setDelhiGames] = useState([]);
  const [starlineGames, setStarlineGames] = useState([]);
  const [loading, setLoading] = useState({
    main: true,
    delhi: true,
    starline: true,
  });
  const [error, setError] = useState({
    main: null,
    delhi: null,
    starline: null,
  });
  const navigate = useNavigate();

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Handle API responses consistently
  const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(data.message || "Request failed");
    }
    return data;
  };

  // Fetch main games
  const fetchMainGames = () => {
    setLoading((prev) => ({ ...prev, main: true }));
    setError((prev) => ({ ...prev, main: null }));

    fetch(`${API_BASE_URL}/main-markets/active`, {
      headers: getAuthHeaders(),
    })
      .then(handleResponse)
      .then((data) => {
        setMainGames(data);
        setLoading((prev) => ({ ...prev, main: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, main: err.message }));
        setLoading((prev) => ({ ...prev, main: false }));
      });
  };

  // Fetch delhi games
  const fetchDelhiGames = () => {
    setLoading((prev) => ({ ...prev, delhi: true }));
    setError((prev) => ({ ...prev, delhi: null }));

    fetch(`${API_BASE_URL}/delhi-markets/active`, {
      headers: getAuthHeaders(),
    })
      .then(handleResponse)
      .then((data) => {
        setDelhiGames(data);
        setLoading((prev) => ({ ...prev, delhi: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, delhi: err.message }));
        setLoading((prev) => ({ ...prev, delhi: false }));
      });
  };

  // Fetch starline games
  const fetchStarlineGames = () => {
    setLoading((prev) => ({ ...prev, starline: true }));
    setError((prev) => ({ ...prev, starline: null }));

    fetch(`${API_BASE_URL}/starlines/active`, {
      headers: getAuthHeaders(),
    })
      .then(handleResponse)
      .then((data) => {
        setStarlineGames(data);
        setLoading((prev) => ({ ...prev, starline: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, starline: err.message }));
        setLoading((prev) => ({ ...prev, starline: false }));
      });
  };

  const handleToggle = async (gameId, currentStatus, gameType) => {
    let apiUrl = "";
    const newStatus = !currentStatus;

    switch (gameType) {
      case "main":
        apiUrl = `${API_BASE_URL}/main-markets/${gameId}/status?status=${newStatus}`;
        break;
      case "delhi":
        apiUrl = `${API_BASE_URL}/delhi-markets/${gameId}/status?status=${newStatus}`;
        break;
      case "starline":
        apiUrl = `${API_BASE_URL}/starlines/${gameId}/status?status=${newStatus}`;
        break;
      default:
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to update game status");
      }

      // Refresh the data after successful update
      switch (gameType) {
        case "main":
          fetchMainGames();
          break;
        case "delhi":
          fetchDelhiGames();
          break;
        case "starline":
          fetchStarlineGames();
          break;
      }
    } catch (error) {
      console.error("Error updating game status:", error);
      alert(`Error updating status: ${error.message}`);
    }
  };

  // Initialize component
  useEffect(() => {
    fetchMainGames();
    fetchDelhiGames();
    fetchStarlineGames();
  }, []);

  // Render table rows
  const renderTableRows = (games, gameType) => {
    if (loading[gameType]) {
      return (
        <tr>
          <td colSpan="3" className="loading-text">
            Loading...
          </td>
        </tr>
      );
    }

    if (error[gameType]) {
      return (
        <tr>
          <td colSpan="3" className="error-text">
            {error[gameType]}
          </td>
        </tr>
      );
    }

    if (games.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="no-active-games">
            No active games available
          </td>
        </tr>
      );
    }

    return games.map((game) => {
      const gameId = gameType === "starline" ? game.id : game.marketId;

      return (
        <tr key={gameId}>
          <td>{game.title || game.name || game.gameName || "N/A"}</td>
          <td>{game.status ? "Active" : "Inactive"}</td>
          <td>
            <div
              className={`toggle-switch table-toggle ${
                game.status ? "active" : ""
              }`}
              onClick={() => handleToggle(gameId, game.status, gameType)}
            >
              <div className="toggle-slider"></div>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="running-game-list">
      <div className="running-game-list-header">Running Games List</div>

      <div className="running-game-list-content">
        <div className="running-game-list-section">
          <h3 className="running-game-list-title">Main Games</h3>
          <table className="running-game-list-table">
            <thead>
              <tr>
                <th>Game Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(mainGames, "main")}</tbody>
          </table>
        </div>

        <div className="running-game-list-right">
          <div className="running-game-list-section">
            <h3 className="running-game-list-title">Delhi Games</h3>
            <table className="running-game-list-table">
              <thead>
                <tr>
                  <th>Game Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{renderTableRows(delhiGames, "delhi")}</tbody>
            </table>
          </div>

          <div className="running-game-list-section">
            <h3 className="running-game-list-title">Starline Games</h3>
            <table className="running-game-list-table">
              <thead>
                <tr>
                  <th>Game Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{renderTableRows(starlineGames, "starline")}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunningGamesList;
