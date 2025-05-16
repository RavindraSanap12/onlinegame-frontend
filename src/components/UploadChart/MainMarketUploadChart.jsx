import React from "react";
import "./MainMarketUploadChart.css";

const MainMarketUploadChart = () => {
  const handleUploadClick = () => {
    const confirmed = window.confirm("Are you sure you want to upload data?");
    if (confirmed) {
      console.log("Uploading data...");
      // Implement upload logic here
    } else {
      console.log("Upload cancelled.");
    }
  };

  return (
    <div className="main-market-data-container">
      <div className="main-market-data-header">Upload Main Market Data</div>

      <div className="main-market-data-body">
        <div className="main-market-data-group">
          <label className="main-market-data-label">Game *</label>
          <select className="main-market-data-select">
            <option>Choose Game</option>
            <option>LUCKY DRAW (10:05 AM - 11:05 AM)</option>
            <option>Time bazar (10:25 AM - 12:30 PM)</option>
            <option>star klyan (10:29 AM - 11:29 AM)</option>
            <option>Sridevi (11:25 AM - 12:25 PM)</option>
            <option>Kalyan (02:28 PM - 05:28 PM)</option>
            <option>Sunday 1 (02:40 PM - 03:18 PM)</option>
            <option>DM MARKET (02:50 PM - 03:50 PM)</option>
            <option>RAJDHANI DAY (03:00 PM - 05:00 PM)</option>
            <option>KALYAN (04:10 PM - 06:10 PM)</option>
            <option>reddy (04:40 PM - 05:40 PM)</option>
            <option>Demo (07:22 PM - 08:30 PM)</option>
            <option>Madhur Night (08:30 PM - 10:30 PM)</option>
            <option>MADHUR NIGHT (08:30 PM - 10:30 PM)</option>
          </select>
        </div>

        <div className="main-market-data-group">
          <label className="main-market-data-label">Choose File *</label>
          <input type="file" className="main-market-data-file" />
        </div>

        <button
          className="main-market-data-upload-btn"
          onClick={handleUploadClick}
        >
          <i className="fas fa-upload"></i> Upload Data
        </button>

        {/* Download Template Button */}
        <a
          href="/template.xlsx" // path inside public folder
          download
          className="main-market-data-download-btn"
        >
          <i className="fas fa-file-excel"></i> Download Template
        </a>
      </div>
    </div>
  );
};

export default MainMarketUploadChart;
