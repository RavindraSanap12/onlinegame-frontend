import React, { useState } from 'react';

const Wallet = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountClick = (value) => {
    setAmount(value);
  };

  const handlePayNow = () => {
    const min = 500;
    const max = 100000;
    const amountNum = parseInt(amount);

    if (!amount) {
      alert('Please select amount');
      return;
    }

    if (amountNum < min || amountNum > max) {
      alert(`Please enter an amount between ${min} and ${max}`);
      return;
    }

    setIsLoading(true);
    const upi = "hiteshtrivedi@ucobank";
    const upiLink = `upi://pay?pa=${upi}&pn=FNAME SNAME K&cu=INR&am=${amount}`;
    
    // Simulate opening UPI link (in a real app, you might use a different approach)
    const a = document.createElement('a');
    a.href = upiLink;
    a.click();
    
    // Reset loading state after a delay
    setTimeout(() => setIsLoading(false), 3000);
  };

  const copyUpiId = () => {
    const upiInput = document.getElementById('upi_id');
    if (upiInput) {
      navigator.clipboard.writeText(upiInput.value)
        .catch(err => {
          alert('Failed to copy UPI ID.');
        });
    }
  };

  return (
    <div className="main-wrapper" id="body-pd">
      <main className="fullheight bg-light">
        <div className="main-body">
          <div className="home-wraper">
            <div className="container">
              <div className="row gy-3">
                <div className="col-sm-12 my-3 px-0">
                  <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold m-0">
                      <a href="/application/home">
                        <span className="ri-arrow-left-line me-3"></span>
                      </a>
                      Add Funds
                    </h5>
                    <div className="wallet px-3 py-1 rounded-2 bg-white bg-opacity-50">
                      <i className="ri-wallet-3-line fs-6"></i>
                      <span className="ms-2 fs-6">0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row row-cols-xl-6 row-cols-lg-5 row-cols-md-5 row-cols-sm-5 row-cols-4 gy-2">
                <div className="logo-wrap text-center col-xl-12 col-lg-12 col-md-12 col-12">
                  <img src="logonew.jpeg" alt="logo" className="rounded-3 mx-auto d-table" />
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                  <hr className="my-1" />
                  <h6 className="text-center text-black">For Add Funds Related Query Call Or Whatsapp</h6>
                  <p className="text-center m-0">+919202887071</p>
                  <p className="text-center">How to add funds? <a href="#">Click Here</a></p>
                  <hr className="my-1" />
                  <h6 className="text-center">Payment Add kerne ke 5 minutes ke andar apke wallet me points add hojayenge. So don't worry wait kariye.</h6>
                  <hr className="my-1" />
                </div>
              </div>

              <div className="tab-content" id="paymentTabsContent">
                <div className="tab-pane fade show active" id="upi" role="tabpanel" aria-labelledby="upi-tab">
                  <form action="https://kalyan143.xyz/application/pay" method="POST" className="shadow p-4 rounded-4 mb-3">
                    <input type="hidden" name="_token" value="vlG26mcCvV7ciGL3xHWcKoI2PvnQwnAUEnYm1XFb" />
                    <div className="row">
                      <div className="text-center mb-3">
                        <label htmlFor="amount" className="form-label">Enter Amount</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          min="500" 
                          max="100000" 
                          name="amount" 
                          id="amount" 
                          placeholder="Enter Amount" 
                          required 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <p className="text-center text-black">Enter minimum amount ₹500</p>
                      </div>

                      <div className="col">
                        <div className="pbtn">
                          <button type="button" onClick={() => handleAmountClick(500)} className="btn btn-light shadow-sm py-2 w-100 btnrs px-0">₹500</button>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pbtn">
                          <button type="button" onClick={() => handleAmountClick(1000)} className="btn btn-light shadow-sm py-2 w-100 btnrs px-0">₹1,000</button>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pbtn">
                          <button type="button" onClick={() => handleAmountClick(2000)} className="btn btn-light shadow-sm py-2 w-100 btnrs px-0">₹2,000</button>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pbtn">
                          <button type="button" onClick={() => handleAmountClick(5000)} className="btn btn-light shadow-sm py-2 w-100 btnrs px-0">₹5,000</button>
                        </div>
                      </div>
                      <div className="col-md-3 col-4">
                        <div className="pbtn">
                          <button type="button" onClick={() => handleAmountClick(10000)} className="btn btn-light shadow-sm py-2 w-100 btnrs px-0">₹10,000</button>
                        </div>
                      </div>
                      <div className="col-md-3 col-4">
                        <div className="pbtn">
                          <button type="button" onClick={() => handleAmountClick(50000)} className="btn btn-light shadow-sm py-2 w-100 btnrs px-0">₹50,000</button>
                        </div>
                      </div>
                      <div className="col-md-3 col-4">
                        <div className="pbtn">
                          <button type="button" onClick={() => handleAmountClick(100000)} className="btn btn-light shadow-sm py-2 w-100 btnrs px-0">₹1,00,000</button>
                        </div>
                      </div>
                      <div className="bibtn col-xl-12 col-lg-12 col-md-12 col-12 py-2 px-4 bg-light text-center">
                        <button 
                          type="button" 
                          onClick={handlePayNow} 
                          className="upi-pay btn btn-warning" 
                          id="payButton"
                          disabled={isLoading}
                          style={{ display: isLoading ? 'none' : 'inline-block' }}
                        >
                          Pay Now!
                        </button>
                        <button 
                          className="buttonload btn btn-dark btn-sm-lg" 
                          disabled 
                          style={{ 
                            backgroundColor: '#cdc7ba', 
                            borderColor: '#000', 
                            display: isLoading ? 'inline-block' : 'none' 
                          }} 
                          id="diId"
                        >
                          <i className="fa fa-spinner fa-spin"></i> Loading
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wallet;
