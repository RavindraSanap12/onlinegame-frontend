import React, { useState } from "react";
import "./CreateMainMarket.css";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

const CreateMainMarket = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const marketList = [
    ["Dl bazar", "09:00 AM", "02:50 PM"],
    ["Pune bazar", "10:00 AM", "11:00 AM"],
    ["LUCKY DRAW", "10:05 AM", "11:05 AM"],
    ["LUCKY DRAW", "10:05 AM", "11:05 AM"],
    ["Time bazar", "10:25 AM", "12:30 PM"],
    ["Star klyan", "10:29 AM", "11:29 AM"],
    ["Pune", "10:40 AM", "02:50 AM"],
    ["Rv Kalyan", "11:00 AM", "12:00 PM"],
    ["Rv Kalyan", "11:00 AM", "12:00 PM"],
    ["Rv Kalyan", "11:00 AM", "12:00 PM"],
    ["SRIDEVI", "11:20 AM", "12:20 PM"],
    ["MADHURI", "11:20 AM", "12:20 PM"],
    ["Sridevi", "11:25 AM", "12:25 PM"],
    ["Sridevi", "11:30 AM", "12:30 PM"],
    ["Madhur morning", "11:31 AM", "12:30 PM"],
  ];

  const [statusList, setStatusList] = useState(
    Array(marketList.length)
      .fill(false)
      .map((_, i) => i % 4 === 0)
  );

  const toggleStatus = (index) => {
    const updatedStatus = [...statusList];
    updatedStatus[index] = !updatedStatus[index];
    setStatusList(updatedStatus);
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="create-main-market-container">
      <div className="create-main-market-form">
        <div className="create-main-market-header">Create Main Market</div>

        <div className="create-main-market-inputs">
          <div className="create-main-market-row">
            <div className="create-main-market-field">
              <label>Market Type *</label>
              <input type="text" value="Main Market" disabled />
            </div>
            <div className="create-main-market-field">
              <label>Title *</label>
              <input type="text" />
            </div>
          </div>

          <div className="create-main-market-row">
            <div className="create-main-market-field">
              <label>OpenTime *</label>
              <input type="time" />
            </div>
            <div className="create-main-market-field">
              <label>CloseTime *</label>
              <input type="time" />
            </div>
            <div className="create-main-market-field">
              <label>Close Min *</label>
              <input type="text" />
            </div>
          </div>

          <div className="create-main-market-row">
            <div className="create-main-market-field">
              <label>Highlight *</label>
              <select>
                <option>Choose</option>
              </select>
            </div>
            <div className="create-main-market-field">
              <label>Show in App *</label>
              <select>
                <option>Choose</option>
              </select>
            </div>
            <div className="create-main-market-field">
              <label>Show in Web *</label>
              <select>
                <option>Choose</option>
              </select>
            </div>
          </div>
        </div>

        <div className="create-main-market-weekly">
          <h4>Weekly Setting</h4>
          <div className="create-main-market-days">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day} className="create-main-market-day">
                <label>{day}</label>
                <button
                  className={`toggle-btn ${
                    selectedDays.includes(day) ? "on" : "off"
                  }`}
                  onClick={() => toggleDay(day)}
                  type="button"
                >
                  {selectedDays.includes(day) ? (
                    <FaToggleOn color="green" />
                  ) : (
                    <FaToggleOff />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="create-main-market-buttons">
          <button className="create-main-market-save">
            <i className="fa fa-save"></i> Save
          </button>
          <button className="create-main-market-cancel">
            <i className="fa fa-times"></i> Cancel
          </button>
        </div>
      </div>

      <div className="create-main-market-list">
        <div className="create-main-market-list-header">Main Market List</div>
        <table className="create-main-market-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Open Time</th>
              <th>Close Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {marketList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                <td>
                  <button
                    className="toggle-btn"
                    onClick={() => toggleStatus(index)}
                    type="button"
                  >
                    {statusList[index] ? (
                      <FaToggleOn color="green" />
                    ) : (
                      <FaToggleOff color="red" />
                    )}
                  </button>
                </td>

                <td>
                  <button className="create-main-market-edit">
                    <i className="fa fa-pencil"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateMainMarket;
