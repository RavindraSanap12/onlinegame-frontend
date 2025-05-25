import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'remixicon/fonts/remixicon.css';

const HistoryPage = () => {
  return (
    <main className="fullheight bg-light">
      <div className="main-body">
        <div className="home-wraper">
          <div className="container">
            <div className="row gy-3">
              <div className="col-sm-12 my-3 px-0">
                <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
                  <h5 className="fw-semibild m-0">
                    <a href="/home">
                      <span className="ri-arrow-left-line me-3"></span>
                    </a>
                    History
                  </h5>
                  <div className="wallet px-3 py-1 rounded-2 bg-white bg-opacity-50">
                    <i className="ri-wallet-3-line fs-6"></i>
                    <span className="ms-2 fs-6">0</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="history-cards row gy-4">
              {[
                {
                  title: 'Bid History',
                  icon: 'ri-chat-history-line',
                  link: '/bid-history',
                },
                {
                  title: 'Starline Bid History',
                  icon: 'ri-calendar-2-line',
                  link: '/starline-bid-history',
                },
                {
                  title: 'Starline Result Bid History',
                  icon: 'ri-menu-search-line',
                  link: '/starline-result-bid-histroy',
                },
                {
                  title: 'Fund History',
                  icon: 'ri-money-dollar-circle-line',
                  link: '/passbook',
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="card shadow rounded-2 py-3 border-0 col-sm-12"
                >
                  <div className="hisname d-flex justify-content-between align-items-center">
                    <h5>
                      <i className={`${item.icon} fs-5 text-warning`}></i> {item.title}
                    </h5>
                    <div className="hisarrow">
                      <i className="ri-arrow-right-s-line fs-5"></i>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HistoryPage;
