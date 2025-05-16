// GameClosingTime.jsx
import React from "react";
import "./GameClosingTime.css";

const GameClosingTime = () => {
  return (
    <div className="game-closing-time-container">
      <div className="game-closing-time-header">User Wise Game Closing Time</div>

      <div className="game-closing-time-table-container">
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Open Time</th>
              <th>Close Time</th>
              <th>Close Min</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="game-closing-time-game-name">Gaziabad</td>
              <td className="game-closing-time-time-cell">09:00 AM</td>
              <td className="game-closing-time-time-cell">07:50 AM</td>
              <td>
                <input type="text" defaultValue="10" />
              </td>
            </tr>

            <tr>
              <td className="game-closing-time-game-name">Gali</td>
              <td className="game-closing-time-time-cell">09:00 AM</td>
              <td className="game-closing-time-time-cell">10:55 PM</td>
              <td>
                <input type="text" defaultValue="10" />
              </td>
            </tr>

            <tr>
              <td className="game-closing-time-game-name">TEST1</td>
              <td className="game-closing-time-time-cell">10:00 AM</td>
              <td className="game-closing-time-time-cell">08:00 PM</td>
              <td>
                <input type="text" defaultValue="5" />
              </td>
            </tr>

            <tr>
              <td className="game-closing-time-game-name">Gdelhi</td>
              <td className="game-closing-time-time-cell">12:00 PM</td>
              <td className="game-closing-time-time-cell">06:01 PM</td>
              <td>
                <input type="text" defaultValue="10" />
              </td>
            </tr>

            <tr>
              <td className="game-closing-time-game-name">Faridabad</td>
              <td className="game-closing-time-time-cell">04:40 PM</td>
              <td className="game-closing-time-time-cell">05:55 PM</td>
              <td>
                <input type="text" defaultValue="5" />
              </td>
            </tr>

            <tr>
              <td className="game-closing-time-game-name">SULTAN</td>
              <td className="game-closing-time-time-cell">05:25 PM</td>
              <td className="game-closing-time-time-cell">11:55 PM</td>
              <td>
                <input type="text" defaultValue="5" />
              </td>
            </tr>

            <tr>
              <td className="game-closing-time-game-name">Gaziabad</td>
              <td className="game-closing-time-time-cell">06:10 PM</td>
              <td className="game-closing-time-time-cell">08:25 PM</td>
              <td>
                <input type="text" defaultValue="10" />
              </td>
            </tr>

            <tr>
              <td className="game-closing-time-game-name">Nty</td>
              <td className="game-closing-time-time-cell">07:00 PM</td>
              <td className="game-closing-time-time-cell">10:30 PM</td>
              <td>
                <input type="text" defaultValue="10" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="game-closing-time-update-button-container">
        <button className="game-closing-time-update-button">
          <i className="fas fa-save"></i> Update
        </button>
      </div>
    </div>
  );
};

export default GameClosingTime;
