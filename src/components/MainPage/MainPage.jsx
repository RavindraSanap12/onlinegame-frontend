import React, { useState, useEffect } from "react";
import whatsappIcon from "../../assets/whatsapp.png";
import withdrawalIcon from "../../assets/withdrawal.png";
import jackpotIcon from "../../assets/jackpot.png";
import addPointIcon from "../../assets/add.png";
import menuIcon from "../../assets/menu-icon.png";
import walletIcon from "../../assets/wallet.png";
import chartIcon from "../../assets/chart.png";
import closeIcon from "../../assets/close.png";
import cutIcon from "../../assets/cut.png";
import playIcon from "../../assets/play.png";
import userIcon from "../../assets/user.png";
import bookIcon from "../../assets/book.png";
import winIcon from "../../assets/win.png";
import homeIcon from "../../assets/home.png";
import walletfooterIcon from "../../assets/walletfooter.png";
import logoutIcon from "../../assets/logout.png";
import upIcon from "../../assets/up.png";
import trophywIcon from "../../assets/trophyw.png";
import hammerIcon from "../../assets/hammer.png";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";
import "./MainPage.css"; // Custom styles

const MainPage = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [bodyOpenMenu, setBodyOpenMenu] = useState(false);
  const [gameCards, setGameCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  const parseTimeString = (timeString) => {
    if (!timeString) return new Date();

    const [hours, minutes, seconds] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(seconds ? parseInt(seconds, 10) : 0);
    return date;
  };

  const isTimeBetween = (now, startTime, endTime) => {
    if (endTime < startTime) {
      return now >= startTime || now <= endTime;
    }
    return now >= startTime && now <= endTime;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "00:00 AM";

    const [hours, minutes] = timeString.split(":");
    const hourInt = parseInt(hours, 10);
    const period = hourInt >= 12 ? "PM" : "AM";
    const displayHour = hourInt % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;
  };

  const fetchUserBalance = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.amount || 0;
    } catch (err) {
      console.error("Error fetching balance:", err);
      return 0;
    }
  };
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return false;
    }
    return true;
  };
  useEffect(() => {
    const checkAuth = async () => {
      if (!(await validateToken())) return;
    };
    checkAuth();
  }, [navigate]);
  const getUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name && parsedUser.mobileNo) {
          setUserData(parsedUser);
        }
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  };

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get user ID from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      // Fetch balance first
      const userBalance = await fetchUserBalance(userId);
      setBalance(userBalance);

      const gamesResponse = await fetch(`${API_BASE_URL}/main-markets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (gamesResponse.status === 403) {
        throw new Error(
          "Forbidden: You don't have permission to access this resource"
        );
      }

      if (!gamesResponse.ok) {
        throw new Error(`HTTP error! status: ${gamesResponse.status}`);
      }

      const gamesData = await gamesResponse.json();

      const transformedGames = gamesData.map((game) => {
        const openTime = parseTimeString(game.openTime);
        const closeTime = parseTimeString(game.closeTime);
        const now = new Date();
        const isRunning = isTimeBetween(now, openTime, closeTime);

        return {
          id: game.marketId,
          name: game.title,
          result: "***-**-***",
          chartLink: `/panel/${game.title
            .toLowerCase()
            .replace(/\s+/g, "-")}/chart`,
          playLink: `/game/${game.marketId}`,
          openTime: formatTime(game.openTime),
          closeTime: formatTime(game.closeTime),
          status: isRunning ? "RUNNING" : "CLOSED",
          statusClass: isRunning ? "text-success" : "text-danger",
          rawOpenTime: openTime,
          rawCloseTime: closeTime,
        };
      });

      setGameCards(transformedGames);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);

      if (err.message.includes("Forbidden") || err.message.includes("401")) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    navigate("/");
  };

  useEffect(() => {
    getUserData();
    fetchGames();

    const interval = setInterval(() => {
      setGameCards((prevCards) =>
        prevCards.map((game) => {
          const now = new Date();
          const isRunning = isTimeBetween(
            now,
            game.rawOpenTime,
            game.rawCloseTime
          );
          return {
            ...game,
            status: isRunning ? "RUNNING" : "CLOSED",
            statusClass: isRunning ? "text-success" : "text-danger",
          };
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
    setBodyOpenMenu(!bodyOpenMenu);
  };

  const openWhatsApp = () => {
    const phoneNumber = "+919202887071";
    const webUrl = "https://wa.me/" + phoneNumber;

    if (
      navigator.userAgent.includes("Android") &&
      navigator.userAgent.includes("wv")
    ) {
      try {
        window.location.href = "whatsapp://send?phone=" + phoneNumber;
      } catch (e) {
        window.location.href = webUrl;
      }
    } else {
      window.location.href = webUrl;
    }
  };

  const handlePlayClick = (gameId, isRunning, gameName) => {
    if (isRunning) {
      const gameData = gameCards.find((g) => g.id === gameId);
      navigate(`/game`, {
        state: {
          gameName: gameData.name,
          marketId: gameData.id,
          openTime: gameData.openTime,
          closeTime: gameData.closeTime,
          status: gameData.status,
          marketTitle: gameData.name,
        },
      });
    } else {
      alert(`Betting is closed for ${gameName}. Please check the open times.`);
    }
  };

  return (
    <div className={`body ${bodyOpenMenu ? "openmenu" : ""}`}>
      {showLogoutConfirmation && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              maxWidth: "300px",
              textAlign: "center",
            }}
          >
            <h5>Confirm Logout</h5>
            <p>Are you sure you want to logout?</p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutConfirmation(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className={`side-bar ${sidebarActive ? "active" : ""}`}>
        <div className="close-btn" onClick={toggleSidebar}>
          <img src={cutIcon} alt="close" />
        </div>

        <div className="sidebar-info clearfix">
          <a href="/profile">
            <figure>
              <img src={userIcon} alt="user" />
            </figure>
            <div className="Profile-info">
              {userData && (
                <>
                  <h5>{userData.name}</h5>
                  <p>{userData.mobileNo}</p>
                </>
              )}
            </div>
          </a>
        </div>

        <div className="menu-title text-white"></div>

        <div className="menu">
          <div className="menu_top_line pt-4">
            <div className="item active">
              <a href="/main-page">
                <i className="fa-solid fa-house"></i>Home
              </a>
            </div>
            <div className="item">
              <a href="/myprofile">
                <i className="fa-solid fa-user"></i>My Profile
              </a>
            </div>
          </div>

          <div className="menu_top_line">
            <div className="item">
              <a href="/addfunds">
                <img
                  className="img-fluid icon_menu"
                  src={addPointIcon}
                  alt="wallet"
                />
                Add Point
              </a>
            </div>
            <div className="item">
              <a href="/withdraw">
                <img src={upIcon} alt="icon" className="img-fluid icon_menu" />
                Withdraw Points
              </a>
            </div>
            <div className="item">
              <a href="/statement">
                <img
                  src={walletIcon}
                  alt="icon"
                  className="img-fluid icon_menu"
                />
                Wallet Statement
              </a>
            </div>
            <div className="item">
              <a href="/payment">
                <img
                  src={walletIcon}
                  alt="icon"
                  className="img-fluid icon_menu"
                />
                Payment Details
              </a>
            </div>
          </div>

          <div className="menu_top_line">
            <div className="item">
              <a href="/history">
                <img
                  src={trophywIcon}
                  alt="icon"
                  className="img-fluid icon_menu"
                />
                Win History
              </a>
            </div>
            <div className="item active">
              <a href="/bid-history">
                <img
                  src={hammerIcon}
                  alt="icon"
                  className="img-fluid icon_menu"
                />
                Bidding History
              </a>
            </div>
            <div className="item active">
              <a href="/game-price">
                <img
                  src={trophywIcon}
                  alt="icon"
                  className="img-fluid icon_menu"
                />
                Game Rate
              </a>
            </div>
          </div>

          <div className="pt-3">
            <div className="item">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogoutConfirmation(true);
                }}
              >
                <img
                  src={logoutIcon}
                  alt="icon"
                  className="img-fluid icon_menu"
                />
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="headermain fixed">
        <div className="container">
          <div className="row align-items-center">
            <div className="width_30 ps-3">
              <div className="head-left">
                <div className="menu" onClick={toggleSidebar}>
                  <img src={menuIcon} alt="menu-icon" className="list_button" />
                </div>
              </div>
            </div>

            <div className="width_70">
              <div className="head-title">Mama777</div>
            </div>

            <div className="width_30">
              <div className="d-flex align-items-center justify-content-end">
                <div className="wallet-box">
                  <img
                    className="wallet-icon img-fluid me-1"
                    src={walletIcon}
                    alt="wallet"
                  />
                  <p>
                    <span className="d-inline-flex me-1 align-items-center"></span>
                    {balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee Section */}
      <div className="fixed-top bg-white" style={{ zIndex: 2 }}>
        <div className="marqueee">
          <div className="pt-1 bg_color">
            <marquee behavior="scroll" direction="left">
              <h2 className="wel-text">Welcome to Mama777</h2>
            </marquee>
          </div>
        </div>

        {/* Buttons Section - All 4 buttons in one row */}
        <div className="container pb-2" style={{ marginTop: "10px" }}>
          <div
            className="d-flex flex-row flex-wrap justify-content-between align-items-center"
            style={{ gap: "5px" }}
          >
            <div className="flex-fill text-center" style={{ minWidth: "23%" }}>
              <a
                href="#"
                className="banner_button d-flex flex-column align-items-center"
                onClick={openWhatsApp}
              >
                <img
                  src={whatsappIcon}
                  alt="icon"
                  className="img-fluid icon"
                  style={{ width: "20px", height: "20px" }}
                />
                <span>Whatsapp</span>
              </a>
            </div>

            <div className="flex-fill text-center" style={{ minWidth: "23%" }}>
              <Link
                to="/kingjackpot"
                className="banner_button d-flex flex-column align-items-center"
                style={{ padding: "7px 12px" }}
              >
                <img
                  src={jackpotIcon}
                  alt="icon"
                  className="img-fluid icon"
                  style={{ width: "20px", height: "20px" }}
                />
                <span>King Jackpot</span>
              </Link>
            </div>

            <div className="flex-fill text-center" style={{ minWidth: "23%" }}>
              <Link
                to="/addfunds"
                className="banner_button d-flex flex-column align-items-center"
              >
                <img
                  src={addPointIcon}
                  alt="icon"
                  className="img-fluid icon"
                  style={{ width: "20px", height: "20px" }}
                />
                <span>Add Point</span>
              </Link>
            </div>

            <div className="flex-fill text-center" style={{ minWidth: "23%" }}>
              <Link
                to="/withdraw"
                className="banner_button d-flex flex-column align-items-center"
              >
                <img
                  src={withdrawalIcon}
                  alt="icon"
                  className="img-fluid icon"
                  style={{ width: "20px", height: "20px" }}
                />
                <span>Withdraw</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Game Cards Section */}
      <div
        className="container"
        style={{ marginTop: "180px", marginBottom: "100px" }}
      >
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <div className="row gap-y11 mb-5 cards_main">
            {gameCards.map((game) => (
              <div className="col-12" key={`game-${game.id}`}>
                <div className="card_set">
                  <div className="d-flex justify-content-between w-100">
                    <div className="width_20">
                      <div className="card_icon">
                        <a href={game.chartLink} className="">
                          <div className="images">
                            <img
                              src={chartIcon}
                              alt="icon"
                              className="img-fluid"
                            />
                          </div>
                          <div className="name_card">
                            <p>Chart</p>
                          </div>
                        </a>
                      </div>
                    </div>

                    <div className="widht_60">
                      <div className="card_conternt text-center">
                        <h5>{game.name}</h5>
                        <p>{game.result}</p>
                      </div>
                    </div>

                    <div className="width_20">
                      <div className="card_icon">
                        <div className="images play">
                          <button
                            onClick={() =>
                              handlePlayClick(
                                game.id,
                                game.status === "RUNNING",
                                game.name
                              )
                            }
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={
                                game.status === "RUNNING" ? playIcon : closeIcon
                              }
                              alt="icon"
                              className="img-fluid"
                            />
                          </button>
                        </div>
                        <div className="name_card">
                          <p>{game.status === "RUNNING" ? "Play" : "Stop"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card_time">
                    <div className="w-50">
                      <p>Open: {game.openTime}</p>
                    </div>
                    <div className="w-50">
                      <p className="last">Close: {game.closeTime}</p>
                    </div>
                  </div>

                  <div className="card_time_open">
                    <p className={game.statusClass}>BETTING IS {game.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed-bottom bg-footer py-2" style={{ zIndex: 999999 }}>
        <div className="container">
          <ul className="d-flex justify-content-around list-unstyled mb-0">
            <li className="col">
              <div className="text-center">
                <a href="/history">
                  <img
                    src={bookIcon}
                    alt="icon"
                    className="img-fluid icon_menu"
                  />
                  <br />
                  <p>Bid History</p>
                </a>
              </div>
            </li>

            <li className="col">
              <div className="text-center">
                <a href="/passbook">
                  <img
                    src={winIcon}
                    alt="icon"
                    className="img-fluid icon_menu"
                  />
                  <br />
                  <p>Win History</p>
                </a>
              </div>
            </li>

            <li className="col">
              <div className="text-center">
                <a href="/main-page">
                  <img
                    src={homeIcon}
                    alt="icon"
                    className="img-fluid icon_menu"
                  />
                  <br />
                  <p>Home</p>
                </a>
              </div>
            </li>

            <li className="col">
              <div className="text-center">
                <a href="/addfunds">
                  <img
                    src={walletfooterIcon}
                    alt="icon"
                    className="img-fluid icon_menu"
                  />
                  <br />
                  <p>Wallet</p>
                </a>
              </div>
            </li>

            <li className="col">
              <div className="text-center">
                <a href="https://wa.me/+919202887071">
                  <i className="bi bi-whatsapp"></i>
                  <br />
                  <p>WhatsApp</p>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
