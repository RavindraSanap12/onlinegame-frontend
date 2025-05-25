import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import g1 from "../Play/g1.png";
import g2 from "../Play/g2.png";
import g3 from "../Play/g3.png";
import g4 from "../Play/g4.png";
import g5 from "../Play/g5.png";
import g6 from "../Play/g6.png";
import g7 from "../Play/g7.png";
import g8 from "../Play/g8.png";
import g12 from "../Play/g12.png";
import "./Play.css";

const games = [
  { title: "Single Ank", image: g1, link: "singleank" },
  { title: "Jodi", image: g2, link: "jodi" },
  { title: "Single Patti", image: g3, link: "singlepatti" },
  { title: "Double Patti", image: g4, link: "DoublePatti" },
  { title: "Triple Patti", image: g5, link: "triplepatti" },
  { title: "Half Sangam", image: g6, link: "halfsangam" },
  { title: "Full Sangam", image: g7, link: "fullsangam" },
  { title: "SP DP TP", image: g8, link: "spdptp" },
  { title: "SP Motor", image: g12, link: "spmotor" },
  { title: "DP Motor", image: g1, link: "dmmotor" },
];

const GamePage = () => {
  const location = useLocation();
  const {
    gameName = "Game",
    marketId = "",
    openTime = "N/A",
    closeTime = "N/A",
    status = "CLOSED",
    marketTitle = "Market",
    bidDate = new Date().toISOString(),
  } = location.state || {};

  return (
    <div className="main-wrapper" id="body-pd">
      <main className="fullheight bg-light">
        <div className="main-body">
          <div className="home-wraper">
            <div className="container">
              <div className="row gy-3 gameopen">
                <div className="col-sm-12 my-3 px-0">
                  <div className="bg-warning shadow-sm p-3">
                    <h5 className="fw-semibold m-0">
                      <Link to="/main-page">
                        <span className="ri-arrow-left-line me-3"></span>
                      </Link>
                      {marketTitle} | Status: {status} | Open: {openTime} -
                      Close: {closeTime}
                    </h5>
                  </div>
                </div>

                {games.map((game, idx) => (
                  <div className="col-4 col-md-4" key={idx}>
                    <div className="card h-100 text-center rounded-3 shadow-sm border-warning">
                      <Link
                        to={`/game/${game.link}`}
                        state={{
                          ...location.state,
                          gameType: game.title,
                          gameMode: game.link,
                          gameName: gameName,
                          marketId: marketId,
                          marketTitle: marketTitle,
                          openTime: openTime,
                          closeTime: closeTime,
                          status: status,
                          bidDate: bidDate,
                        }}
                      >
                        <div className="card-img d-flex flex-column justify-content-between align-items-center p-2">
                          <img
                            src={game.image}
                            alt="play"
                            className="img-fluid"
                          />
                          <h5 className="fw-bold mt-2 fs-sm-5 fs-6">
                            {game.title}
                          </h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;
