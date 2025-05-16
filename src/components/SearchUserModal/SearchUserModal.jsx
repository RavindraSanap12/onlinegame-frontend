import React from 'react';
import './SearchUserModal.css';

const SearchUserModal = ({ onClose, onSearch }) => {
  return (
    <div className="search-model-conm-overlay">
      <div className="search-model-conm-container">
        <div className="search-model-conm-header">
          <h3 className="search-model-conm-title">Search User</h3>
          <span className="search-model-conm-close" onClick={onClose}>&times;</span>
        </div>
        <div className="search-model-conm-body">
          <input
            type="text"
            className="search-model-conm-input"
            placeholder="Enter username..."
          />
        </div>
        <div className="search-model-conm-footer">
          <button className="search-model-conm-cancel" onClick={onClose}>Cancel</button>
          <button className="search-model-conm-search" onClick={onSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default SearchUserModal;
