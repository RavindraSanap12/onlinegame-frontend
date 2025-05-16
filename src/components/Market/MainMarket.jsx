import React, { useState, useEffect } from "react";
import "./MainMarket.css";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

const MainMarket = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    marketType: "Main Market",
    title: "",
    openTime: "",
    closeTime: "",
    closeMin: "",
    highlight: "Yes",
    showInApp: "No",
    showInWeb: "Yes",
    weekDays: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    },
  });

  // Market list state
  const [marketList, setMarketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Handle API errors consistently
  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(error.response?.data?.message || "Request failed");
  };

  // Fetch market list from API
  useEffect(() => {
    const fetchMarketList = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/main-markets`, {
          headers: getAuthHeaders(),
        });

        const transformedData = response.data.map((market, index) => ({
          marketId: market.marketId || index + 1,
          title: market.title,
          openTime: formatTimeForDisplay(market.openTime),
          closeTime: formatTimeForDisplay(market.closeTime),
          status: market.status || false,
          rawData: market,
        }));

        setMarketList(transformedData);
      } catch (err) {
        setError(err.message);
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketList();
  }, []);

  // Time format conversion functions
  const formatTimeForDisplay = (timeString) => {
    try {
      const [timePart] = timeString?.split(".") || [];
      const [hours, minutes] = timePart?.split(":") || [];
      let hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";

      if (hour > 12) hour -= 12;
      if (hour === 0) hour = 12;

      return `${hour.toString().padStart(2, "0")}:${minutes} ${period}`;
    } catch (error) {
      return timeString || "";
    }
  };

  const formatTimeForAPI = (timeString) => {
    try {
      const [time, period] = timeString.split(" ");
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours, 10);

      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, "0")}:${minutes}:00`;
    } catch (error) {
      return timeString;
    }
  };

  const formatTimeForInput = (timeString) => {
    try {
      const [timePart] = timeString?.split(".") || [];
      const [hours, minutes] = timePart?.split(":") || [];
      return `${hours}:${minutes}`;
    } catch (error) {
      return "";
    }
  };

  // Form handlers
  const handleTimeChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleToggleDay = (day) => {
    setFormData({
      ...formData,
      weekDays: {
        ...formData.weekDays,
        [day]: !formData.weekDays[day],
      },
    });
  };

  // Toggle market status
  const toggleMarketStatus = async (marketId) => {
    try {
      const marketToUpdate = marketList.find(
        (market) => market.marketId === marketId
      );
      const newStatus = !marketToUpdate.status;

      await axios.put(`${API_BASE_URL}/main-markets/${marketId}/status`, null, {
        params: { status: newStatus },
        headers: getAuthHeaders(),
      });

      setMarketList(
        marketList.map((market) =>
          market.marketId === marketId
            ? { ...market, status: newStatus }
            : market
        )
      );
    } catch (error) {
      handleApiError(error);
      alert("Failed to update market status. Please try again.");
    }
  };

  // Edit market handler
  const handleEdit = (market) => {
    setEditingId(market.marketId);

    const openTime = formatTimeForInput(market.rawData.openTime);
    const closeTime = formatTimeForInput(market.rawData.closeTime);

    setFormData({
      marketType: market.rawData.marketType || "Main Market",
      title: market.rawData.title,
      openTime: openTime,
      closeTime: closeTime,
      closeMin: market.rawData.closeMin || "",
      highlight: market.rawData.highlight ? "Yes" : "No",
      showInApp: market.rawData.showInApp ? "Yes" : "No",
      showInWeb: market.rawData.showInWeb ? "Yes" : "No",
      weekDays: {
        Monday: market.rawData.monday || false,
        Tuesday: market.rawData.tuesday || false,
        Wednesday: market.rawData.wednesday || false,
        Thursday: market.rawData.thursday || false,
        Friday: market.rawData.friday || false,
        Saturday: market.rawData.saturday || false,
        Sunday: market.rawData.sunday || false,
      },
    });
  };

  // Save handler (create or update)
  const handleSave = async () => {
    try {
      const requestData = {
        marketType: formData.marketType.toUpperCase(),
        title: formData.title,
        openTime: formatTimeForAPI(formData.openTime),
        closeTime: formatTimeForAPI(formData.closeTime),
        closeMin: parseInt(formData.closeMin) || 0,
        highlight: formData.highlight === "Yes",
        showInApp: formData.showInApp === "Yes",
        showInWeb: formData.showInWeb === "Yes",
        monday: formData.weekDays.Monday,
        tuesday: formData.weekDays.Tuesday,
        wednesday: formData.weekDays.Wednesday,
        thursday: formData.weekDays.Thursday,
        friday: formData.weekDays.Friday,
        saturday: formData.weekDays.Saturday,
        sunday: formData.weekDays.Sunday,
      };

      let response;
      if (editingId) {
        response = await axios.put(
          `${API_BASE_URL}/main-markets/${editingId}`,
          requestData,
          {
            headers: getAuthHeaders(),
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/main-markets`,
          requestData,
          {
            headers: getAuthHeaders(),
          }
        );
      }

      // Refresh market list
      const marketResponse = await axios.get(`${API_BASE_URL}/main-markets`, {
        headers: getAuthHeaders(),
      });

      const transformedData = marketResponse.data.map((market, index) => ({
        marketId: market.marketId || index + 1,
        title: market.title,
        openTime: formatTimeForDisplay(market.openTime),
        closeTime: formatTimeForDisplay(market.closeTime),
        status: market.status || false,
        rawData: market,
      }));

      setMarketList(transformedData);
      alert(`Market ${editingId ? "updated" : "created"} successfully!`);
      handleCancel();
    } catch (error) {
      handleApiError(error);
      alert(
        `Failed to ${editingId ? "update" : "create"} market. Please try again.`
      );
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      marketType: "Main Market",
      title: "",
      openTime: "",
      closeTime: "",
      closeMin: "",
      highlight: "Yes",
      showInApp: "No",
      showInWeb: "Yes",
      weekDays: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      },
    });
  };

  return (
    <div className="market-management">
      <div className="panel-container">
        {/* Create/Edit Market Panel */}
        <div className="panel create-panel">
          <div className="panel-header">
            {editingId ? "Edit Main Market" : "Create Main Market"}
          </div>
          <div className="panel-content">
            {/* First row */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Market Type <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.marketType}
                  readOnly
                  className="form-control disabled"
                />
              </div>
              <div className="form-group">
                <label>
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter Market Title"
                />
              </div>
            </div>

            {/* Second row */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  OpenTime <span className="required">*</span>
                </label>
                <div className="time-input">
                  <input
                    type="time"
                    value={formData.openTime}
                    className="form-control"
                    onChange={(e) =>
                      handleTimeChange("openTime", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  CloseTime <span className="required">*</span>
                </label>
                <div className="time-input">
                  <input
                    type="time"
                    value={formData.closeTime}
                    className="form-control"
                    onChange={(e) =>
                      handleTimeChange("closeTime", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  Close Min <span className="required">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.closeMin}
                  onChange={(e) =>
                    setFormData({ ...formData, closeMin: e.target.value })
                  }
                  placeholder="Enter Minutes"
                />
              </div>
            </div>

            {/* Third row */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Highlight <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.highlight}
                  onChange={(e) =>
                    setFormData({ ...formData, highlight: e.target.value })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Show in App <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.showInApp}
                  onChange={(e) =>
                    setFormData({ ...formData, showInApp: e.target.value })
                  }
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Show in Web <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.showInWeb}
                  onChange={(e) =>
                    setFormData({ ...formData, showInWeb: e.target.value })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Weekly Settings */}
            <div className="weekly-setting">
              <h3>Weekly Setting</h3>
              <div className="days-grid">
                {Object.entries(formData.weekDays).map(([day, isActive]) => (
                  <div key={day} className="day-item">
                    <label>{day}</label>
                    <div
                      className={`toggle-switch ${isActive ? "active" : ""}`}
                      onClick={() => handleToggleDay(day)}
                    >
                      <div className="toggle-slider"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button className="btn save-btn" onClick={handleSave}>
                {editingId ? "Update" : "Save"}
              </button>
              <button className="btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Market List Panel */}
        <div className="panel list-panel">
          <div className="panel-header">Main Market List</div>
          <div className="table-container">
            {loading ? (
              <div className="loading-message">Loading market data...</div>
            ) : error ? (
              <div className="error-message">Error: {error}</div>
            ) : (
              <table className="market-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Open Time</th>
                    <th>Close Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {marketList.map((market) => (
                    <tr key={market.marketId}>
                      <td className="id-column">{market.marketId}</td>
                      <td>{market.title}</td>
                      <td>{market.openTime}</td>
                      <td>{market.closeTime}</td>
                      <td>
                        <div
                          className={`toggle-switch table-toggle ${
                            market.status ? "active" : ""
                          }`}
                          onClick={() => toggleMarketStatus(market.marketId)}
                        >
                          <div className="toggle-slider"></div>
                        </div>
                      </td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(market)}
                        >
                          <span>✏️</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMarket;
