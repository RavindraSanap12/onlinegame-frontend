import React, { useState } from "react";
import "./LoginPage.css"; // You can reuse the same CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPhone, FaArrowRight, FaUser } from "react-icons/fa";
import logonew from "../Login_And_Register/logonew.jpeg";
import security from "../Login_And_Register/security.png";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !mobileNumber || !password) {
      setMessage("All fields are required");
      return;
    }

    setMessage("Registering...");

    try {
      const response = await fetch(`${API_BASE_URL}/users/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          mobileNo: mobileNumber,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        navigate("/");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred during registration");
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
              Create Your Account
            </a>
          </div>
        </div>

        <div className="row pt-2">
          <div className="col-12">
            <div className="login_card_page">
              <div className="mt-2">
                {message && (
                  <div
                    id="signupmsg"
                    className={
                      message.includes("successful")
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {message}
                  </div>
                )}
              </div>

              <p className="heading_fom"> Signup Your Account </p>

              <form onSubmit={handleSignup}>
                <div className="d-grid gap-3">
                  <div className="input position-relative">
                    <span>
                      <FaUser className="icon" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input position-relative">
                    <span>
                      <FaPhone className="icon" />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Your Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
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
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="login_button mt-3">
                    Signup
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center anyenquiry">
                <a href="/">
                  Already have an account? Login{" "}
                  <span>
                    <FaArrowRight />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
