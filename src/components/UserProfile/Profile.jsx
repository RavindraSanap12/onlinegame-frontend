import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css";
import "remixicon/fonts/remixicon.css";
import { API_BASE_URL } from "../api";

const Profile = () => {
  const [walletAmount, setWalletAmount] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobileNo: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }
    return true;
  };

  const getUserDataFromLocalStorage = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserData({
          name: storedUser.name || "",
          email: storedUser.email || "",
          mobileNo: storedUser.mobileNo || "",
        });
        return storedUser;
      }
      return null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  const fetchWalletAmount = async () => {
    setIsLoading(true);
    try {
      if (!(await validateToken())) return;

      const user = getUserDataFromLocalStorage();
      if (!user?.id) {
        console.error("User ID not found");
        setWalletAmount(0);
        navigate("/");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWalletAmount(data.amount || 0);
      setError(null);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletAmount(0);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!(await validateToken())) return;
      getUserDataFromLocalStorage();
      fetchWalletAmount();
    };
    checkAuthAndFetchData();
  }, [navigate]);

  return (
    <div className="main-wrapper" id="body-pd">
      <main className="fullheight bg-light">
        <div className="main-body">
          <div className="home-wraper">
            <div className="container">
              <div className="row gy-3 gameopen justify-content-center pb-2">
                {/* Header Section */}
                <div className="col-sm-12 my-3 px-0 sticky-top">
                  <div className="bg-warning shadow-sm px-3 py-2 d-flex align-items-center justify-content-between">
                    <h5 className="fw-semibild m-0">
                      <Link
                        to="/home"
                        className="text-decoration-none text-dark"
                      >
                        <span className="ri-arrow-left-line me-3"></span>
                      </Link>
                      Profile
                    </h5>
                    <div className="wallet px-3 py-1 rounded-2 bg-white bg-opacity-50">
                      <i className="ri-wallet-3-line fs-6"></i>
                      <span className="ms-2 fs-6">
                        {walletAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Form Section */}
                <div className="col-sm-9">
                  <div className="dashdata ps-sm-5">
                    <form className="row">
                      <div className="mb-4 col-sm-6">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="name"
                          value={userData.name}
                          readOnly
                        />
                      </div>
                      <div className="mb-4 col-sm-6">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="email"
                          value={userData.email}
                          readOnly
                        />
                      </div>
                      <div className="mb-4 col-sm-6">
                        <label htmlFor="mobile" className="form-label">
                          Mobile
                        </label>
                        <div className="row">
                          <div className="input-group-select col-sm-12">
                            <input
                              type="tel"
                              className="form-control"
                              name="mobileNo"
                              required
                              readOnly
                              placeholder="mobile number"
                              value={userData.mobileNo}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 col-sm-12 d-md-flex justify-content-md-end">
                        <button
                          type="submit"
                          className="btn btn-warning btn-lg w-100"
                        >
                          Update
                        </button>
                      </div>
                    </form>
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

export default Profile;
