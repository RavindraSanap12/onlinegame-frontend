import React, { useState, useEffect } from "react";
import "./ActiveUsers.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const ActiveUsers = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Get authentication headers with token
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

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/users/active`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch active users");
        }

        const data = await response.json();
        const transformedUsers = data.map((user) => ({
          ...user,
          date:
            user.registerDate && user.registerTime
              ? `${user.registerDate} ${user.registerTime}`
              : "N/A",
          customWithdraw: user.customWithdraw || false,
          customRate: user.customRate || false,
          customClose: user.customClose || false,
          status: user.status || false,
        }));

        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } catch (err) {
        handleApiError(err);
        setError(err.message);

        // Fallback to sample data if API fails (for demo purposes only)
        const sampleUsers = [
          {
            id: 1,
            name: "Test User",
            mobileNo: "7878091385",
            password: "******",
            customWithdraw: false,
            customRate: false,
            customClose: false,
            status: true,
            date: "12 Jul 2022 05:16 PM",
          },
        ];
        setUsers(sampleUsers);
        setFilteredUsers(sampleUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
      setCurrentPage(1);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.mobileNo.includes(searchQuery) ||
          (user.password && user.password.includes(searchQuery))
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, users]);

  // Toggle user setting function
  const toggleSetting = async (id, setting) => {
    try {
      const userToUpdate = users.find((user) => user.id === id);
      if (!userToUpdate) return;

      const updateDto = {
        ...userToUpdate,
        [setting]: !userToUpdate[setting],
      };

      // Optimistic UI update
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, [setting]: !user[setting] } : user
        )
      );

      const response = await fetch(
        `${API_BASE_URL}/users/update-booleans/${id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updateDto),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setSuccessMessage(`${setting} updated successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      handleApiError(err);
      setError(err.message);
      // Revert optimistic update on error
      setUsers(users);
    }
  };

  // Handle edit button click
  const handleEdit = (user) => {
    navigate("/update-user", { state: { user } });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  if (loading) {
    return (
      <div className="application-users-container">
        <div className="loading-spinner"></div>
        <p>Loading active users...</p>
      </div>
    );
  }

  return (
    <div className="application-users-container">
      <div className="users-panel">
        <div className="users-panel-header">
          <h2 style={{ fontSize: "20px" }}>Active Users List</h2>
          <button
            className="add-new-button"
            onClick={() => navigate("/add-user")}
          >
            <span>+</span> Add New User
          </button>
        </div>

        <div className="users-panel-content">
          {error && (
            <div className="alert error">
              <i className="icon-error"></i> {error}
            </div>
          )}
          {successMessage && (
            <div className="alert success">
              <i className="icon-success"></i> {successMessage}
            </div>
          )}

          <div className="table-controls">
            <div className="entries-control">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="search-control">
              <span>Search:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, mobile or password"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th className="column-action">Action</th>
                  <th className="column-name">Name</th>
                  <th className="column-mobile">Mobile No.</th>
                  <th className="column-password">Password</th>
                  <th className="column-custom">Custom Withdraw</th>
                  <th className="column-custom">Custom Rate</th>
                  <th className="column-custom">Custom Close</th>
                  <th className="column-status">Status</th>
                  <th className="column-date">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="action-cell">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(user)}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <div className="action-buttons">
                          <button
                            className="custom-rate-btn"
                            onClick={() =>
                              navigate("/custom-withdrawal-rate", {
                                state: { userId: user.id },
                              })
                            }
                          >
                            Custom Rate
                          </button>
                          <button
                            className="custom-close-btn"
                            onClick={() =>
                              navigate("/game-closing-time", {
                                state: { userId: user.id },
                              })
                            }
                          >
                            Custom Close
                          </button>
                        </div>
                      </td>
                      <td>{user.name}</td>
                      <td>{user.mobileNo}</td>
                      <td>••••••</td>
                      <td className="toggle-cell">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.customWithdraw}
                            onChange={() =>
                              toggleSetting(user.id, "customWithdraw")
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="toggle-cell">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.customRate}
                            onChange={() =>
                              toggleSetting(user.id, "customRate")
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="toggle-cell">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.customClose}
                            onChange={() =>
                              toggleSetting(user.id, "customClose")
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="toggle-cell">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.status}
                            onChange={() => toggleSetting(user.id, "status")}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>{user.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-results">
                      No active users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredUsers.length > 0 && (
            <div className="table-footer">
              <div className="pagination-info">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * entriesPerPage + 1,
                  filteredUsers.length
                )}{" "}
                to{" "}
                {Math.min(currentPage * entriesPerPage, filteredUsers.length)}{" "}
                of {filteredUsers.length} entries
              </div>
              <div className="pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={currentPage === page ? "active" : ""}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;
