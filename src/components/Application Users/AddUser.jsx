import React, { useState } from "react";
import "./AddUser.css";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Validate form fields
  const validateForm = () => {
    const { name, mobileNo, password } = formData;

    if (!name.trim()) {
      setError("Please enter a valid name");
      return false;
    }

    if (!mobileNo.trim() || !/^\d{10}$/.test(mobileNo)) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      // Clear form after successful submission
      setFormData({
        name: "",
        mobileNo: "",
        password: "",
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      handleApiError(err);
      setError(err.message || "An error occurred while adding the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-user-container">
      <div className="panel user-panel">
        <div className="panel-header">Add User</div>
        <div className="panel-content">
          {error && (
            <div className="alert error-message">
              <i className="icon-error"></i> {error}
            </div>
          )}
          {success && (
            <div className="alert success-message">
              <i className="icon-success"></i> User added successfully!
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter full name"
                  maxLength="50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNo">
                  Mobile Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="mobileNo"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter password (min 6 characters)"
                  minLength="6"
                />
              </div>

              <div className="form-group button-group">
                <button
                  type="submit"
                  className="save-button"
                  disabled={isSubmitting}
                >
                  <i className="icon-save"></i>
                  {isSubmitting ? "Saving..." : "Save User"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
