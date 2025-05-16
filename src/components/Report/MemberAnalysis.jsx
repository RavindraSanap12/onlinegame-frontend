import React from 'react';
import './MemberAnalysis.css';

const MemberAnalysis = () => {
  const users = [
    'Shakti (8561844707)',
    'Vishu (7240256586)',
    'Vishwas (9001417600)',
    'Test (7976091385)',
    'Ajay (8209040043)',
    'Ram (8239603308)',
    'Bhavesh Bansal (6377410182)',
    'Sanju (9908585325)',
    'Kunal Tailang (8290265712)',
    'Mobin (7035777333)',
    'Jagdish Purohit (9575668686)',
    'Hello (9983000044)',
    'Harshad (9892365067)',
    'Jwjwj (9206330006)',
    'Rdx (9414338140)',
    'Ajay (7734088132)',
    'Shubham jirafe (7721883046)',
    'Innocent (8847700473)',
    'sonu Meena (8905309002)',
    'RONNY THAKUR (9414132791)',
    'Test (8818051365)',
    'Raju (8010746135)',
    'Babu (8107271148)',
    'abcd (9893407749)',
    'Sachin (9321632180)',
    'Rg (8910882694)',
    'Palak (9137799490)',
    'Deepesh (9116305780)',
    'Test user (9876543210)',
    'King (8619780068)',
    'kiran (9663361221)',
    'Bharat Bharat (6264377848)',
    'Sadaf (8452825935)',
    'Alex (9265408617)',
    'Dinesh laybar (7020158234)',
    'Arvind Dahikar (9766921690)',
    'Rudra (7457096800)',
    'Rocky (9736781312)',
    'Vijay (7027300921)',
    'MULTAN. KHAN (9518820081)',
    'Balaji R (9182944971)',
    'Mr Vicky (9022255458)',
    'Dipak Bhandare (9763103722)',
  ];

  const data = users.map((user, i) => ({
    id: i + 1,
    user,
    credit: '1000.00',
    debit: '0',
    totalBids: '0',
    bidAmount: '0',
    totalWins: '0',
    winAmount: '0',
    withdraw: '0',
    balance: '1000.00',
    profitLoss: '0.00',
  }));

  return (
    <div className="member-analysis-container">
      <div className="member-analysis-header">
        <h2>Member Analysis</h2>
        <div className="member-analysis-search">
          <label>Search: </label>
          <input type="text" />
        </div>
      </div>
      <div className="member-analysis-table-wrapper">
        <table className="member-analysis-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Total Credit</th>
              <th>Total Debit</th>
              <th>Total Bids</th>
              <th>Bid Amount</th>
              <th>Total Wins</th>
              <th>Win Amount</th>
              <th>Withdraw</th>
              <th>Balance</th>
              <th>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.user}</td>
                <td>{item.credit}</td>
                <td>{item.debit}</td>
                <td>{item.totalBids}</td>
                <td>{item.bidAmount}</td>
                <td>{item.totalWins}</td>
                <td>{item.winAmount}</td>
                <td>{item.withdraw}</td>
                <td>{item.balance}</td>
                <td className={
                  parseFloat(item.profitLoss) > 0 ? 'profit' :
                  parseFloat(item.profitLoss) < 0 ? 'loss' : ''
                }>
                  {item.profitLoss}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="member-analysis-footer">
        <span>1–{data.length} of {data.length} entries</span>
        <div className="pagination">
          <button>Previous</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default MemberAnalysis;
