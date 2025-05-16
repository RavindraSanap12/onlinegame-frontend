import React, { useState } from "react";
import "./NewUserTable.css";

const NewUserTable = () => {
  const [search, setSearch] = useState("");
  const entries = 50; // fixed

  const users = []; // ⛔ No data

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="new-user-list-container">
      <h2 className="new-user-list-title">New User List</h2>
      <div className="new-user-list-controls">
        <div className="new-user-list-show">
          Show
          <select className="new-user-list-select" value={entries} disabled>
            <option value="50">50</option>
            <option value="All">All</option>
          </select>
          entries
        </div>
        <div className="new-user-list-search">
          Search:
          <input
            type="text"
            className="new-user-list-input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="new-user-list-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name <span className="sort-icon">▲</span></th>
            <th>Mobile No. <span className="sort-icon">↕</span></th>
            <th>Password <span className="sort-icon">↕</span></th>
            <th>Balance <span className="sort-icon">↕</span></th>
            <th>Status <span className="sort-icon">↕</span></th>
            <th>Active <span className="sort-icon">↕</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" className="new-user-list-no-data">
              No data available in table
            </td>
          </tr>
        </tbody>
      </table>

      <div className="new-user-list-footer">
        Showing 0 to 0 of 0 entries
        <div className="new-user-list-pagination">
          <span>Previous</span>
          <span>Next</span>
        </div>
      </div>
    </div>
  );
};

export default NewUserTable;
