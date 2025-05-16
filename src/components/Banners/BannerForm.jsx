import React, { useState } from "react";
import "./BannerForm.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const BannerForm = () => {
  const navigate = useNavigate();
  const [showInApp, setShowInApp] = useState(false);
  const [showInWeb, setShowInWeb] = useState(false);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return {};
    }
    return {
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
    throw new Error(error.message || "Request failed");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerImage) {
      setError("Please select a banner image");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("bannerImage", bannerImage);
      formData.append("showInApp", showInApp);
      formData.append("showInWeb", showInWeb);

      const headers = getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/banners`, {
        method: "POST",
        headers: {
          ...headers, // Include the authorization header
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create banner");
      }

      const data = await response.json();
      console.log("Banner created successfully:", data);
      navigate("/banners"); // Redirect to banners list after successful creation
    } catch (err) {
      handleApiError(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowInApp(false);
    setShowInWeb(false);
    setBannerPreview("");
    setBannerImage(null);
    setError(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleCancel = () => {
    navigate("/banners");
  };

  return (
    <div className="banner-create-notification-wrapper">
      <div className="banner-create-notification-header">
        <h2 style={{ fontSize: "1.5rem" }}>Create Banner</h2>
        <button
          className="banner-create-notification-list-btn"
          onClick={() => navigate("/banners")}
        >
          📋 List
        </button>
      </div>

      <div className="banner-create-notification-body">
        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="banner-create-notification-form-group">
            <label className="banner-create-notification-label">
              Banner Image *
            </label>
            <input
              type="file"
              className="banner-create-notification-input"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className="banner-create-notification-img"
                style={{
                  maxWidth: "300px",
                  maxHeight: "150px",
                  marginTop: "10px",
                }}
              />
            )}
          </div>

          <div className="banner-create-notification-toggle-row">
            <label className="banner-create-notification-label">
              Show in App *
            </label>
            <label className="banner-create-notification-switch">
              <input
                type="checkbox"
                checked={showInApp}
                onChange={() => setShowInApp(!showInApp)}
              />
              <span className="banner-create-notification-slider"></span>
            </label>
          </div>

          <div className="banner-create-notification-toggle-row">
            <label className="banner-create-notification-label">
              Show in Web *
            </label>
            <label className="banner-create-notification-switch">
              <input
                type="checkbox"
                checked={showInWeb}
                onChange={() => setShowInWeb(!showInWeb)}
              />
              <span className="banner-create-notification-slider"></span>
            </label>
          </div>

          <div className="banner-create-notification-buttons">
            <button
              type="submit"
              className="banner-create-notification-btn save"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "💾 Save"}
            </button>
            <button
              type="button"
              className="banner-create-notification-btn reset"
              onClick={handleReset}
              disabled={isLoading}
            >
              🔄 Reset
            </button>
            <button
              type="button"
              className="banner-create-notification-btn cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerForm;
