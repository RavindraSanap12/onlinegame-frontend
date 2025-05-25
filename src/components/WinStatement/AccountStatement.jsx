import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "boxicons/css/boxicons.min.css";


const AccountStatement = () => {
  return (
    <div className="main-wrapper" id="body-pd">
      <main className="fullheight bg-light">
        <div className="main-body">
          <div className="home-wraper">
            <div className="container">
              <style>{`
                .acsitem h6 {
                  flex: 1 1 auto;
                  max-width: 50%;
                }
              `}</style>

              <div className="row gy-3 gameopen justify-content-center pb-2">
                <div className="col-sm-12 my-3 px-0 sticky-top">
                  <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibold m-0">
                      <a href="/application/history">
                        <span className="ri-arrow-left-line me-3"></span>
                      </a>
                      Account Statement
                    </h5>
                    <div className="wallet px-3 py-1 rounded-2 bg-white bg-opacity-50">
                      <i className="ri-wallet-3-line fs-6"></i>{" "}
                      <span className="ms-2 fs-6">0</span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-10">
                  <div className="card h-100 rounded-3 shadow-sm border-0 p-2">
                    <div className="acs card-bodys px-sm-5">
                      <div className="acsitem d-flex justify-content-between">
                        <h6>Reference ID:</h6>
                        <span className="ms-sm-4">#3666208</span>
                      </div>

                      <div className="acsitem d-flex justify-content-between">
                        <h6>Transaction Amount:</h6>
                        <span className="ms-sm-4 text-success">10000</span>
                      </div>

                      <div className="acsitem d-flex justify-content-between">
                        <h6>Status:</h6>
                        <span className="ms-sm-4 text-danger">Rejected</span>
                      </div>

                      <div className="acsitem d-flex justify-content-between">
                        <h6>Date:</h6>
                        <span className="ms-sm-4">11 Apr 2025 07:48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountStatement;
