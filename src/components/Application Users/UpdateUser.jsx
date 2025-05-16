import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddUser.css";
import { API_BASE_URL } from "../api";

const UpdateUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: userData } = location.state || {};

  // State for form fields
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Initialize form with user data
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setMobileNo(userData.mobileNo || "");
      setPassword(userData.password || "");
    } else {
      // Redirect if no user data is provided
      navigate("/users-list");
    }
  }, [userData, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!name || !mobileNo || !password) {
      setError("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    // Mobile number validation
    if (!/^\d{10}$/.test(mobileNo)) {
      setError("Please enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }

    // Password validation (example: at least 6 characters)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          mobileNo,
          password,
          // Include other fields if needed
          customWithdraw: userData.customWithdraw || false,
          customRate: userData.customRate || false,
          customClose: userData.customClose || false,
          status: userData.status || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      setSuccess("User updated successfully!");
      setIsLoading(false);

      // Navigate back after a delay
      setTimeout(() => {
        navigate("/users-list");
      }, 1500);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);

      // Handle unauthorized (401) errors
      if (err.message.includes("Unauthorized") || err.message.includes("401")) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }
  };

  return (
    <div className="add-user-container">
      <div className="panel user-panel">
        <div className="panel-header">Update User</div>
        <div className="panel-content">
          {error && (
            <div className="error-message">
              <i className="icon-error"></i> {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              <i className="icon-success"></i> {success}
            </div>
          )}

          <form className="user-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNo">
                  Mobile Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="mobileNo"
                  value={mobileNo}
                  onChange={(e) =>
                    setMobileNo(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="form-control"
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter password (min 6 characters)"
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group button-group">
                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="icon-spinner"></i> Updating...
                    </>
                  ) : (
                    <>
                      <i className="icon-save"></i> Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
