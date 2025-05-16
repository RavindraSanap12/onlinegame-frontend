import React, { useState } from "react";
import "./CustomWithdrawalRate.css";

const CustomWithdrawalRate = () => {
  // State for withdrawal limits
  const [minWithdrawal, setMinWithdrawal] = useState("0");
  const [maxWithdrawal, setMaxWithdrawal] = useState("0");

  // State for Lucky Draw rates
  const [luckyDrawRates, setLuckyDrawRates] = useState([
    {
      id: 1,
      gameType: "Single Digits",
      gameRate: "9.5",
      minBid: "10",
      maxBid: "10000",
    },
    {
      id: 2,
      gameType: "Jodi Digit",
      gameRate: "100",
      minBid: "10",
      maxBid: "1000",
    },
    {
      id: 3,
      gameType: "Single Panna",
      gameRate: "140",
      minBid: "10",
      maxBid: "1000",
    },
    {
      id: 4,
      gameType: "Double Panna",
      gameRate: "280",
      minBid: "10",
      maxBid: "1000",
    },
    {
      id: 5,
      gameType: "Triple Panna",
      gameRate: "800",
      minBid: "10",
      maxBid: "1000",
    },
    {
      id: 6,
      gameType: "Half Sangam",
      gameRate: "1200",
      minBid: "10",
      maxBid: "1000",
    },
    {
      id: 7,
      gameType: "Full Sangam",
      gameRate: "12000",
      minBid: "10",
      maxBid: "1000",
    },
  ]);

  // State for Time Bazar rates
  const [timeBazarRates, setTimeBazarRates] = useState([
    {
      id: 1,
      gameType: "Single Digits",
      gameRate: "9.5",
      minBid: "5",
      maxBid: "1000000",
    },
    {
      id: 2,
      gameType: "Jodi Digit",
      gameRate: "92",
      minBid: "5",
      maxBid: "1000000",
    },
    {
      id: 3,
      gameType: "Single Panna",
      gameRate: "130",
      minBid: "5",
      maxBid: "1000000",
    },
    {
      id: 4,
      gameType: "Double Panna",
      gameRate: "260",
      minBid: "5",
      maxBid: "1000000",
    },
    {
      id: 5,
      gameType: "Triple Panna",
      gameRate: "800",
      minBid: "5",
      maxBid: "1000",
    },
    {
      id: 6,
      gameType: "Half Sangam",
      gameRate: "1000",
      minBid: "5",
      maxBid: "1000",
    },
    {
      id: 7,
      gameType: "Full Sangam",
      gameRate: "10000",
      minBid: "5",
      maxBid: "1000",
    },
  ]);

  // Handle input change for Withdrawal limits
  const handleWithdrawalChange = (type, value) => {
    if (type === "min") {
      setMinWithdrawal(value);
    } else {
      setMaxWithdrawal(value);
    }
  };

  // Handle input change for Lucky Draw rates
  const handleLuckyDrawChange = (id, field, value) => {
    const updatedRates = luckyDrawRates.map((rate) => {
      if (rate.id === id) {
        return { ...rate, [field]: value };
      }
      return rate;
    });
    setLuckyDrawRates(updatedRates);
  };

  // Handle input change for Time Bazar rates
  const handleTimeBazarChange = (id, field, value) => {
    const updatedRates = timeBazarRates.map((rate) => {
      if (rate.id === id) {
        return { ...rate, [field]: value };
      }
      return rate;
    });
    setTimeBazarRates(updatedRates);
  };

  // Handle save button click
  const handleSave = () => {
    // In a real application, this would send data to backend
    console.log("Saving withdrawal rates:", { minWithdrawal, maxWithdrawal });
    console.log("Lucky Draw rates:", luckyDrawRates);
    console.log("Time Bazar rates:", timeBazarRates);
  };

  return (
    <div className="custom-withdrawal-rate-container">
      {/* Custom Withdrawal Rate Panel */}
      <div className="rate-panel withdrawal-panel">
        <div className="panel-header">
          <span>Custom Withdrawal Rate</span>
        </div>
        <div className="panel-content withdrawal-content">
          <div className="withdrawal-inputs">
            <div className="input-group">
              <label>Min Withdrawal</label>
              <input
                type="text"
                value={minWithdrawal}
                onChange={(e) => handleWithdrawalChange("min", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Max Withdrawal</label>
              <input
                type="text"
                value={maxWithdrawal}
                onChange={(e) => handleWithdrawalChange("max", e.target.value)}
              />
            </div>
            <button className="save-button" onClick={handleSave}>
              <i className="fas fa-save"></i> Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Market Rates Panel */}
      <div className="rate-panel market-rates-panel">
        <div className="panel-header">
          <span>Main Market Rates</span>
        </div>
        <div className="panel-content">
          <div className="rates-tables-container">
            {/* Lucky Draw Table */}
            <div className="market-section">
              <div className="market-header">LUCKY DRAW</div>
              <table className="rates-table">
                <thead>
                  <tr>
                    <th>Game Type</th>
                    <th>Game Rate</th>
                    <th>Min Bid</th>
                    <th>Max Bid</th>
                  </tr>
                </thead>
                <tbody>
                  {luckyDrawRates.map((rate) => (
                    <tr key={`lucky-${rate.id}`}>
                      <td>{rate.gameType}</td>
                      <td>
                        <input
                          type="text"
                          value={rate.gameRate}
                          onChange={(e) =>
                            handleLuckyDrawChange(
                              rate.id,
                              "gameRate",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={rate.minBid}
                          onChange={(e) =>
                            handleLuckyDrawChange(
                              rate.id,
                              "minBid",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={rate.maxBid}
                          onChange={(e) =>
                            handleLuckyDrawChange(
                              rate.id,
                              "maxBid",
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Time Bazar Table */}
            <div className="market-section">
              <div className="market-header">Time bazar</div>
              <table className="rates-table">
                <thead>
                  <tr>
                    <th>Game Type</th>
                    <th>Game Rate</th>
                    <th>Min Bid</th>
                    <th>Max Bid</th>
                  </tr>
                </thead>
                <tbody>
                  {timeBazarRates.map((rate) => (
                    <tr key={`bazar-${rate.id}`}>
                      <td>{rate.gameType}</td>
                      <td>
                        <input
                          type="text"
                          value={rate.gameRate}
                          onChange={(e) =>
                            handleTimeBazarChange(
                              rate.id,
                              "gameRate",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={rate.minBid}
                          onChange={(e) =>
                            handleTimeBazarChange(
                              rate.id,
                              "minBid",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={rate.maxBid}
                          onChange={(e) =>
                            handleTimeBazarChange(
                              rate.id,
                              "maxBid",
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="update-button-container">
        <button className="update-button" onClick={handleSave}>
          <i className="fas fa-save"></i> Update
        </button>
      </div>
    </div>
  );
};

export default CustomWithdrawalRate;
