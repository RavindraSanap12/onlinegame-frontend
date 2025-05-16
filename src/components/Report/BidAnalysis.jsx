import React from "react";
import "./BidAnalysis.css";

const BidAnalysis = () => {
  return (
    <div className="bid-analysis-container">
      <div className="bid-analysis-header">
        <span className="bid-analysis-title">Bid Analysis</span>
        <span className="bid-analysis-total">Total : <span className="bid-analysis-total-count">0</span></span>
      </div>

      <div className="bid-analysis-filters">
        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Date *</label>
          <input type="date" className="bid-analysis-input" defaultValue="2025-04-17" />
        </div>

        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Market Type</label>
          <select className="bid-analysis-select">
            <option>Main Market</option>
            <option>Starline</option>
          </select>
        </div>

        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Game *</label>
          <select className="bid-analysis-select">
            <option>Choose Game</option>
          </select>
        </div>

        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Session</label>
          <select className="bid-analysis-select">
            <option>Choose Session</option>
          </select>
        </div>

        <div className="bid-analysis-group bid-analysis-search-btn-wrapper">
          <button className="bid-analysis-search-btn">Search</button>
        </div>
      </div>
    </div>
  );
};

export default BidAnalysis;
