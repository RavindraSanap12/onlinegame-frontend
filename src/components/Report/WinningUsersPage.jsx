import React, { useState } from 'react';
import './WinningUsersPage.css';

const WinningUsersPage = () => {
  const [marketType, setMarketType] = useState('');
  const [game, setGame] = useState('');
  const [session, setSession] = useState('All');
  const [user, setUser] = useState('');
  const [fromDate, setFromDate] = useState('2025-04-18');
  const [toDate, setToDate] = useState('2025-04-18');

  return (
    <div className="winning-users-page">
        <div className='winning-user-page-con'>


        <div className="winning-users-filter-container">
        <h2 className="winning-users-section-title">Search Filters</h2>
        <div className="winning-users-filters">
          <div className="winning-users-filter-item">
            <label>Market Type</label>
            <select value={marketType} onChange={(e) => setMarketType(e.target.value)}>
              <option>Choose</option>
            </select>
          </div>
          <div className="winning-users-filter-item">
            <label>Games</label>
            <select value={game} onChange={(e) => setGame(e.target.value)}>
              <option>All</option>
            </select>
          </div>
          <div className="winning-users-filter-item">
            <label>Session</label>
            <select value={session} onChange={(e) => setSession(e.target.value)}>
              <option>All</option>
            </select>
          </div>
          <div className="winning-users-filter-item">
            <label>User</label>
            <select value={user} onChange={(e) => setUser(e.target.value)}>
              <option>Select User</option>
            </select>
          </div>
          <div className="winning-users-filter-item">
            <label>From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="winning-users-filter-item">
            <label>To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="winning-users-filter-item">
            <button className='winning-btn'>Search</button>
          </div>
        </div>
      </div>

      <div className="winning-users-win-amount-box">
        <h2>Win Amount</h2>
        <p className="winning-users-amount">₹ 0</p>
      </div>
        </div>
     



      <div className="winning-users-results-section">
        <h2 className="winning-users-section-title">Winning Users List</h2>
       <div className='winning-entries'>
       <div className="winning-users-table-controls">
          <label>
            Show
            <select>
              <option>50</option>
            </select>
            entries
          </label>
          </div>
         <div className='winning-search-bar'>
         <input type="text" placeholder="Search" />
         </div>
       
       </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Name</th>
              <th>Mobile No.</th>
              <th>Market</th>
              <th>Panna/Ank</th>
              <th>Point</th>
              <th>Win Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="9" className="winning-users-no-data">No data available in table</td>
            </tr>
          </tbody>
        </table>
        <div className="winning-users-pagination">
          <span>Showing 0 to 0 of 0 entries</span>
          <div>
            <span>Previous</span> <span>Next</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningUsersPage;
