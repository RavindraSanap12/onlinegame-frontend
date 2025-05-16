import React, { useState, useEffect } from "react";
import "./Banners.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const Banners = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

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

  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      navigate("/login");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(error.message || "Request failed");
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/banners`, { headers });

        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }
        const data = await response.json();
        setBanners(data);
        setLoading(false);
      } catch (err) {
        handleApiError(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    setDeletingId(id);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      setBanners(banners.filter((banner) => banner.id !== id));
    } catch (err) {
      handleApiError(err);
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBanners = banners.filter((banner) => {
    return (
      banner.id.toString().includes(searchQuery.toLowerCase()) ||
      (banner.showInApp && "show in app".includes(searchQuery.toLowerCase())) ||
      (banner.showInWeb && "show in web".includes(searchQuery.toLowerCase()))
    );
  });

  const paginatedBanners = filteredBanners.slice(0, entriesPerPage);

  if (loading) {
    return (
      <div className="banners-management-container">Loading banners...</div>
    );
  }

  if (error) {
    return <div className="banners-management-container">Error: {error}</div>;
  }

  return (
    <div className="banners-management-container">
      <div className="banners-management-header">
        <h2 className="banners-management-title">Banners</h2>
        <button
          className="banners-management-add-btn"
          onClick={() => navigate("/add-banner")}
        >
          + Add New
        </button>
      </div>

      <div className="banners-management-controls">
        <div className="banners-management-entries">
          <label className="banners-management-label">Show</label>
          <select
            className="banners-management-select"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <label className="banners-management-label">entries</label>
        </div>

        <div className="banners-management-search">
          <label className="banners-management-label">Search:</label>
          <input
            type="text"
            className="banners-management-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <table className="banners-management-table">
        <thead className="banners-management-thead">
          <tr>
            <th className="banners-management-th">Image</th>
            <th className="banners-management-th">
              <span>Show in App</span>
              <span className="banners-management-sort-arrow">▲</span>
            </th>
            <th className="banners-management-th">
              <span>Show in Web</span>
              <span className="banners-management-sort-arrow">▼</span>
            </th>
            <th className="banners-management-th">
              <span>Action</span>
            </th>
          </tr>
        </thead>
        <tbody className="banners-management-tbody">
          {paginatedBanners.length > 0 ? (
            paginatedBanners.map((banner) => (
              <tr key={banner.id} className="banners-management-tr">
                <td className="banners-management-td">
                  <img
                    src={`data:image/png;base64,${banner.bannerImage}`}
                    alt={`Banner ${banner.id}`}
                    className="banners-management-img"
                  />
                </td>
                <td className="banners-management-td">
                  {banner.showInApp ? "Yes" : "No"}
                </td>
                <td className="banners-management-td">
                  {banner.showInWeb ? "Yes" : "No"}
                </td>
                <td className="banners-management-td">
                  <button
                    className="banners-management-delete-btn"
                    onClick={() => handleDelete(banner.id)}
                    disabled={deletingId === banner.id}
                  >
                    {deletingId === banner.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="banners-management-tr">
              <td colSpan="4" className="banners-management-no-data">
                No data available in table
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="banners-management-pagination">
        <button className="banners-management-pagination-btn">Previous</button>
        <button className="banners-management-pagination-btn">Next</button>
      </div>
    </div>
  );
};

export default Banners;
