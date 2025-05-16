import React from 'react';
import './PaymentModeWiseCollection.css';

const PaymentModeWiseCollection = () => {
  const payments = [
    {
      name: 'PhonePe',
      logo: '/image/phonepe.png', 
      amount: '₹ 500.00',
    },
    {
      name: 'Google Pay',
      logo: '/image/googlepay.png',
      amount: '₹ 500.00',
    },
    {
      name: 'Paytm',
      logo: '/image/paytm.png',
      amount: '₹ 500.00',
    },
    {
      name: 'Jio Pay',
      logo: '/image/jiopay.png',
      amount: '₹ 500.00',
    },
  ];

  return (
    <div className="payment-mode-wise-collection-container">
      <div className="payment-mode-wise-collection-header">
        Payment Mode Wise Collection
      </div>
      <div className="payment-mode-wise-collection-cards">
        {payments.map((payment, index) => (
          <div key={index} className="payment-mode-wise-collection-card">
            <img
              src={payment.logo}
              alt={payment.name}
              className="payment-mode-wise-collection-logo"
            />
            <div className="payment-mode-wise-collection-amount">
              {payment.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentModeWiseCollection;
