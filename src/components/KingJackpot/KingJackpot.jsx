import React from 'react';
import growth from '../KingJackpot/growth.png'
import close from '../KingJackpot/close.png'
import withdrawal from '../KingJackpot/withdrawal.png'
import wallettwo from '../KingJackpot/wallettwo.png'
import wallet from '../KingJackpot/wallet.png';
import menuicon from '../KingJackpot/menu-icon.svg';
import { Link } from "react-router-dom";

const KingJackpot = () => {
  return (
    <div className="openmenu" cz-shortcut-listen="true">
      <div className="side-bar">
        <div className="close-btn">
          <img src="./King Jackpot_files/cut.svg" alt="close" />
        </div>

        <div className="sidebar-info clearfix">
          <a href="https://kalyan143.xyz/application/myprofile">
            <figure>
              <img src="./King Jackpot_files/employee.png" alt="user" />
            </figure>
            <div className="Profile-info">
              <h5>Ravindra</h5>
              <p>9763057428</p>
            </div>
          </a>
        </div>
        <div className="menu-title text-white">
          {/*Menu*/}
        </div>

        <div className="menu">
          <div className="menu_top_line pt-4">
            <div className="item active"><a href="https://kalyan143.xyz/application/starlines#"><i className="fa-solid fa-house"></i>Home</a></div>
            <div className="item"><a href="https://kalyan143.xyz/application/myprofile"><i className="fa-solid fa-user"></i>My Profile </a></div>
          </div>
          <div className="menu_top_line">
            <div className="item"><a href="https://kalyan143.xyz/application/add-fund"><img className="img-fluid icon_menu" src="./King Jackpot_files/add.svg" alt="wallet" />Add Point  </a></div>
            <div className="item"><a href="https://kalyan143.xyz/application/withdrawal"><img src="./King Jackpot_files/up.png" alt="icon" className="img-fluid icon_menu" />Withdraw Points </a></div>
            <div className="item"><a href="https://kalyan143.xyz/application/passbook"><img src="./King Jackpot_files/wallet.png" alt="icon" className="img-fluid icon_menu" />Wallet Statement </a></div>
            <div className="item"><a href="https://kalyan143.xyz/application/payment"><img src="./King Jackpot_files/wallet.png" alt="icon" className="img-fluid icon_menu" />Payment Details </a></div>
          </div>
          <div className="menu_top_line">
            <div className="item"><a href="https://kalyan143.xyz/application/history"><img src="./King Jackpot_files/win.png" alt="icon" className="img-fluid icon_menu" />Win History</a></div>
            <div className="item active"><a href="https://kalyan143.xyz/application/bid-history"><img src="./King Jackpot_files/hammer.png" alt="icon" className="img-fluid icon_menu" />Bidding History </a></div>
            <div className="item active"><a href="https://kalyan143.xyz/application/game-price"><img src="./King Jackpot_files/win.png" alt="icon" className="img-fluid icon_menu" />Game Rate </a></div>
          </div>
          <div className="pt-3">
            <div className="item"><a href="https://kalyan143.xyz/application/logout"><img src="./King Jackpot_files/logout.png" alt="icon" className="img-fluid icon_menu" />Logout </a></div>
          </div>
        </div>
      </div>
      
      <header className="headermain fixed">
        <div className="container">
          <div className="row align-items-center">
            <div className="width_30 ps-3">
              <div className="head-left">
                <div className="menu-icon"><img src={menuicon} alt="menu-icon" className="list_button" /></div>
              </div>
            </div>

            <div className="width_70">
              <div className="head-title">Kalyan Official</div>
            </div>
            <div className="width_30">
              <div className="d-flex align-items-center justify-content-end">
                <div className="wallet-box">
                  <img className="wallet-icon img-fluid me-1" src={wallet} alt="wallet" />
                  <p> <span className="d-inline-flex me-1 align-items-center"></span> 0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="marqueee">
        <div className="pt-1 bg_color">
          <marquee behavior="scroll" direction="left">
            <h2 className="wel-text">Welcome to Kalyan Official </h2>
          </marquee>
        </div> 
      </div>  
      
      <div className="container">  
        <div className="row gap-y15 ">
          <div className="col-6">
            <div className="mt-lg-4 mx-auto">
              <div className="button_main_list d-grid justify-content-start">
              <div className="button_main">
  <Link to="/addfunds" className="banner_button">
    <div className="images">
      <img src={wallettwo} alt="icon" className="img-fluid icon" />
    </div>
    Add Point
  </Link>
</div>
 
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="mt-lg-4 mx-auto">
              <div className="button_main_list d-grid justify-content-end">
                <div className="button_main">
                  <a href="https://kalyan143.xyz/application/withdrawal" className="banner_button"> 
                    <div className="images">
                      <img src={withdrawal} alt="icon" className="img-fluid icon" />
                    </div> Withdrawal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Section */}
      <div className="container">
        <div className="row gap-y11 mb-5 cards_main mt-2">
          {[
            { time: "10 AM", id: 1 },
            { time: "11 AM", id: 2 },
            { time: "12 PM", id: 3 },
            { time: "02 PM", id: 5 },
            { time: "03 PM", id: 6 },
            { time: "04 PM", id: 7 },
            { time: "05 PM", id: 8 },
            { time: "06 PM", id: 9 },
            { time: "07 PM", id: 10 },
            { time: "08 PM", id: 11 },
            { time: "09 PM", id: 12 },
            { time: "10 PM", id: 13 },
            { time: "01 PM", id: 4 }
          ].map((item) => (
            <div className="col-12" key={item.id}>
              <div className="card_set">
                <div className="d-flex justify-content-between w-100">
                  <div className="width_20">
                    <div className="card_icon">
                      <a href={`https://kalyan143.xyz/application/starline-chart/${item.id}`} className="">
                        <div className="images">
                          <img src={growth} alt="icon" className="img-fluid" />
                        </div>
                        <div className="name_card">
                          <p>Chart</p>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="widht_60">
                    <div className="card_conternt text-center">
                      <h5>{item.time}</h5>
                      <p>***-*</p>
                    </div>
                  </div>
                  <div className="width_20">
                    <div className="card_icon">
                      <div className="images play">
                        <a href="https://kalyan143.xyz/application/starlines#"><img src={close} alt="icon" className="img-fluid" /></a>
                      </div>
                      <div className="name_card">
                        <p>Stop</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card_time_open">
                  <p className="text-danger">BETTING IS Close </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed-bottom bg-footer py-2" style={{ zIndex: 999999 }}>
        <div className="container">
          <ul className="">
            <li className="col">
              <div className="text-center">
                <a href="https://kalyan143.xyz/application/history"><img src="./King Jackpot_files/book.svg" alt="icon" className="img-fluid icon_menu" /><br />
                  <p>Bid History</p></a>
              </div>
            </li>
            <li className="col">
              <div className="text-center">
                <a href="https://kalyan143.xyz/application/passbook"><img src="./King Jackpot_files/trophy.png" alt="icon" className="img-fluid icon_menu" /><br />
                  <p>Win History</p></a>
              </div>
            </li>
            <li className="col">
              <div className="text-center">
                <a href="https://kalyan143.xyz/application/starlines#"><i className="footer-icons bi bi-house home active"></i></a>
              </div>
            </li>
            <li className="col">
              <div className="text-center">
                <a href="https://kalyan143.xyz/application/add-fund"><img src="./King Jackpot_files/walletfooter.png" alt="icon" className="img-fluid icon_menu" /><br />
                  <p>Wallet</p></a>
              </div>
            </li>
            <li className="col">
              <div className="text-center">
                <a href="https://kalyan143.xyz/application/withdrawal"><i className="bi bi-cash-stack"></i><br />
                  <p>Withdrawal</p></a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KingJackpot;