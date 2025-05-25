import React, { useState } from "react";
import "./LoginPage.css"; // Custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPhone, FaArrowRight } from "react-icons/fa";
import logonew from "../Login_And_Register/logonew.jpeg";
import security from "../Login_And_Register/security.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api";

function LoginPageUser({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNo: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Authenticating...");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNo: formData.mobileNo,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Assuming user data is returned

      // If login is successful
      if (onLogin) {
        onLogin(data); // Pass the response data to parent component if onLogin prop exists
      }
      // navigate("/main-page"); // Navigate to dashboard

      // Check if mobile number is 7777
      if (formData.mobileNo === "7777") {
        navigate("/dashboard"); // Navigate to dashboard for admin
      } else {
        navigate("/main-page"); // Navigate to main page for other users
      }
    } catch (err) {
      setMessage(err.message || "An error occurred during login");
      // Clear any existing token on failed login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="login_body"
      style={{ backgroundColor: "#3c3c3c", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="row mb-0">
          <div className="col-12 d-flex justify-content-center">
            <div className="login_logo">
              <a href="#">
                <img src={logonew} alt="logo" className="img-fluid" />
              </a>
            </div>
          </div>
          <div className="py-2 text-center">
            <a href="#" className="ribbon">
              Enter Your Login Details
            </a>
          </div>
        </div>

        <div className="row pt-2">
          <div className="col-12">
            <div className="login_card_page">
              <div className="mt-2">
                {message && (
                  <div id="loginmsg" className="text-danger">
                    {message}
                  </div>
                )}
              </div>

              <p className="heading_fom"> Login Your Account </p>

              <form onSubmit={handleLogin}>
                <div className="d-grid gap-3">
                  <div className="input position-relative">
                    <span>
                      <FaPhone className="icon" />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      required
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      placeholder="Enter Your Mobile Number"
                    />
                  </div>

                  <div className="input position-relative">
                    <span>
                      <img
                        src={security}
                        alt="icon"
                        className="img-fluid icon"
                      />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter Your Password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="login_button mt-3"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Login"}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center anyenquiry">
                <Link to="/signup">
                  For Registration{" "}
                  <span>
                    <FaArrowRight />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPageUser;
