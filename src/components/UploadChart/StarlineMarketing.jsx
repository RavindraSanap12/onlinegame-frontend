import React from "react";
import "./StarlineMarketing.css"; // updated CSS import

const StarlineMarketing = () => {
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
    <div className="starline-marketing-container">
      <div className="starline-marketing-header">Upload Main Market Data</div>

      <div className="starline-marketing-body">
        <div className="starline-marketing-group">
          <label className="starline-marketing-label">Game *</label>
          <select className="starline-marketing-select">
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

        <div className="starline-marketing-group">
          <label className="starline-marketing-label">Session</label>
          <select className="starline-marketing-select">
            <option>Choose Session</option>
            <option>01:00 AM</option>
            <option>02:00 AM</option>
            <option>03:00 AM</option>
            <option>04:00 AM</option>
            <option>05:00 AM</option>
            <option>06:00 AM</option>
            <option>07:00 AM</option>
            <option>08:00 AM</option>
            <option>09:00 AM</option>
            <option>10:00 AM</option>
            <option>11:00 AM</option>
            <option>12:00 PM</option>
          </select>
        </div>

        <div className="starline-marketing-group">
          <label className="starline-marketing-label">Choose File *</label>
          <input type="file" className="starline-marketing-file" />
        </div>

        <button
          className="starline-marketing-upload-btn"
          onClick={handleUploadClick}
        >
          <i className="fas fa-upload"></i> Upload Data
        </button>

        <a
          href="/template.xlsx" // path inside public folder
          download
          className="starline-marketing-download-btn"
        >
          <i className="fas fa-file-excel"></i> Download Template
        </a>
      </div>
    </div>
  );
};

export default StarlineMarketing;
