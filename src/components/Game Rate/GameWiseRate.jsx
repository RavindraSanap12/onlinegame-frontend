import React from "react";
import "./GameWiseRate.css";

const gameTypes = [
  { name: "Single Digits", rate: 10 },
  { name: "Jodi Digit", rate: 500 },
  { name: "Single Panna", rate: 160 },
  { name: "Double Panna", rate: 320 },
  { name: "Triple Panna", rate: 900 },
  { name: "Half Sangam", rate: 6000 },
  { name: "Full Sangam", rate: 60000 },
];

const markets = ["Lucky Draw", "Time bazar", "Star klyan", "Sridevi",];

const GameWiseRate = () => {
  return (
    <div className="game-rate-list">
      <div className="game-rate-list-header">Main Market</div>
      <div className="game-rate-list-content">
        {markets.map((market, idx) => (
          <div className="game-rate-list-section" key={idx}>
            <div className="game-rate-list-title">{market}</div>
            <table className="game-rate-list-table">
              <thead>
                <tr>
                  <th>Game Type</th>
                  <th>Game Rate</th>
                  <th>Min Bid</th>
                  <th>Max Bid</th>
                </tr>
              </thead>
              <tbody>
                {gameTypes.map((type, i) => (
                  <tr key={i}>
                    <td>{type.name}</td>
                    <td>{type.rate}</td>
                    <td>
                      <input type="number" value={5} readOnly />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={
                          type.name.includes("Triple") ||
                          type.name.includes("Half") ||
                          type.name.includes("Full")
                            ? 1000
                            : 1000000
                        }
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameWiseRate;
