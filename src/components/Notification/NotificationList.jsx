import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./NotificationList.css";
import { API_BASE_URL } from "../api";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const navigate = useNavigate();

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
    const fetchNotifications = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/notifications`, {
          headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        handleApiError(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      handleApiError(err);
      setError(err.message);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    return (
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      notification.id.toString().includes(searchQuery.toLowerCase())
    );
  });

  const paginatedNotifications = filteredNotifications.slice(0, entriesPerPage);

  if (loading) {
    return (
      <div className="notification-list-container">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return <div className="notification-list-container">Error: {error}</div>;
  }

  return (
    <div className="notification-list-container">
      <div className="notification-list-box">
        <div className="notification-list-header">
          <h2 className="notification-list-title">Notification</h2>
          <Link to="/add-notification" className="notification-list-add-btn">
            + Add New
          </Link>
        </div>

        <div className="notification-list-body">
          <div className="notification-list-controls">
            <div className="notification-list-entries">
              Show{" "}
              <select
                className="notification-list-select"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>{" "}
              entries
            </div>
            <div className="notification-list-search">
              Search:{" "}
              <input
                type="text"
                placeholder="Search"
                className="notification-list-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <table className="notification-list-table">
            <thead className="notification-list-thead">
              <tr>
                <th className="notification-list-th">Title</th>
                <th className="notification-list-th">Description</th>
                <th className="notification-list-th">Show In App</th>
                <th className="notification-list-th">Show In Web</th>
                <th className="notification-list-th">Action</th>
              </tr>
            </thead>
            <tbody className="notification-list-tbody">
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((n) => (
                  <tr key={n.id} className="notification-list-row">
                    <td className="notification-list-title-cell">{n.title}</td>
                    <td className="notification-list-description-cell">
                      {n.description}
                    </td>
                    <td className="notification-list-show-cell">
                      {n.showInApp ? "Yes" : "No"}
                    </td>
                    <td className="notification-list-show-cell">
                      {n.showInWeb ? "Yes" : "No"}
                    </td>
                    <td className="notification-list-action-cell">
                      {/* <Link
                        to={`/add-notification/${n.id}`}
                        className="notification-list-btn-edit"
                      >
                        <FaEdit /> Edit
                      </Link> */}
                      <button
                        className="notification-list-btn-remove"
                        onClick={() => handleDelete(n.id)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="notification-list-no-entry">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="notification-list-footer">
            <p className="notification-list-entries-count">
              {paginatedNotifications.length > 0
                ? `1-${paginatedNotifications.length} of ${filteredNotifications.length} entries`
                : "0 entries"}
            </p>
            <div className="notification-list-pagination">
              <button className="notification-list-pagination-btn">
                Previous
              </button>
              <button className="notification-list-pagination-btn active">
                1
              </button>
              <button className="notification-list-pagination-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
