import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NotificationForm.css";
import { API_BASE_URL } from "../api";

const NotificationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    showInApp: false,
    showInWeb: false,
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      navigate("/login");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(error.message || "Request failed");
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchNotification = async () => {
        try {
          const headers = getAuthHeaders();
          const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
            headers,
          });

          if (!response.ok) {
            throw new Error("Failed to fetch notification");
          }

          const data = await response.json();
          setFormData({
            title: data.title,
            description: data.description,
            showInApp: data.showInApp,
            showInWeb: data.showInWeb,
          });
          setLoading(false);
        } catch (err) {
          handleApiError(err);
          setError(err.message);
          setLoading(false);
        }
      };

      fetchNotification();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      showInApp: false,
      showInWeb: false,
    });
  };

  const handleCancel = () => {
    navigate("/notification-list");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setError("Title and Description are required");
      return;
    }

    try {
      const headers = getAuthHeaders();
      const url = isEditMode
        ? `${API_BASE_URL}/notifications/${id}`
        : `${API_BASE_URL}/notifications`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          isEditMode
            ? "Failed to update notification"
            : "Failed to create notification"
        );
      }

      navigate("/notification-list");
    } catch (err) {
      handleApiError(err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="notification-form-wrapper">
        Loading notification data...
      </div>
    );
  }

  if (error) {
    return <div className="notification-form-wrapper">Error: {error}</div>;
  }

  return (
    <div className="notification-form-wrapper">
      <div className="notification-form-header">
        <h2 className="notification-form-heading">
          {isEditMode ? "Edit Notification" : "Create Notification"}
        </h2>
        <button
          className="notification-form-list-btn"
          onClick={() => navigate("/notification-list")}
        >
          📋 List
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="notification-form-group">
          <label className="notification-form-label">Title *</label>
          <input
            type="text"
            name="title"
            className="notification-form-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="notification-form-group notification-form-toggle-row">
          <label className="notification-form-label">Show in App *</label>
          <label className="notification-form-switch">
            <input
              type="checkbox"
              name="showInApp"
              className="notification-form-checkbox"
              checked={formData.showInApp}
              onChange={handleChange}
            />
            <span className="notification-form-slider"></span>
          </label>
        </div>

        <div className="notification-form-group notification-form-toggle-row">
          <label className="notification-form-label">Show in Web *</label>
          <label className="notification-form-switch">
            <input
              type="checkbox"
              name="showInWeb"
              className="notification-form-checkbox"
              checked={formData.showInWeb}
              onChange={handleChange}
            />
            <span className="notification-form-slider"></span>
          </label>
        </div>

        <div className="notification-form-group">
          <label className="notification-form-label">Description *</label>
          <textarea
            name="description"
            className="notification-form-textarea"
            rows="6"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {error && <div className="notification-form-error">{error}</div>}

        <div className="notification-form-btn-group">
          <button type="submit" className="notification-form-save-btn">
            💾 {isEditMode ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="notification-form-reset-btn"
            onClick={handleReset}
          >
            🔄 Reset
          </button>
          <button
            type="button"
            className="notification-form-cancel-btn"
            onClick={handleCancel}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;
