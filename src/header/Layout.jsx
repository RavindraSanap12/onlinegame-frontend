import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard/Dashboard";
import AppSetting from "../components/App Setting/AppSetting";
import MainMarket from "../components/Market/MainMarket";
import DelhiMarket from "../components/Market/DelhiMarket";
import Starline from "../components/Market/Starline";
import WithdrawalListPending from "../components/Withdrawal/WithdrawalListPending";
import WithdrawalListCompleted from "../components/Withdrawal/WithdrawalListCompleted";
import WithdrawalListRejected from "../components/Withdrawal/WithdrawalListRejected";
import AddUser from "../components/Application Users/AddUser";
import ApplicationUsersList from "../components/Application Users/ApplicationUsersList";
import UpdateUser from "../components/Application Users/UpdateUser";
import CustomWithdrawalRate from "../components/Application Users/CustomWithdrawalRate";
import GameClosingTime from "../components/Application Users/GameClosingTime";
import UsersWalletBalance from "../components/Application Users/UsersWalletBalance";
import TransactionHistory from "../components/Application Users/TransactionHistory";
import ActiveUsers from "../components/Application Users/ActiveUsers";
import BlockedUsers from "../components/Application Users/BlockedUsers";
import AddPoint from "../components/Point Management/AddPoint";
import DeductPoint from "../components/Point Management/DeductPoint";
import AdminPointHistory from "../components/Point Management/AdminPointHistory";
import AutoPointAndHistory from "../components/Point Management/AutoPointAndHistory";
import MainResultUpload from "../components/Declare Results/MainResultUpload";
import DelhiResultUpload from "../components/Declare Results/DelhiResultUpload";
import StarlineResultUpload from "../components/Declare Results/StarlineResultUpload";
import GameWiseRate from "../components/Game Rate/GameWiseRate";
import MainMarketUploadChart from "../components/UploadChart/MainMarketUploadChart";
import BidAnalysis from "../components/Report/BidAnalysis";
import RunningGamesList from "../components/Running/RunningGameList";
import GameMarketSettings from "../components/Game Rate/GameMarketSettings";
import StarlineMarketing from "../components/UploadChart/StarlineMarketing";
import NotificationList from "../components/Notification/NotificationList";
import Banners from "../components/Banners/Banners";
import PaymentModeWiseCollection from "../components/PaymentModeWiseCollection/PaymentModeWiseCollection";
import MemberAnalysis from "../components/Report/MemberAnalysis";
import WinningUsersPage from "../components/Report/WinningUsersPage";
import UserBidingReport from "../components/Report/UserBidingReport";
import NewUserTable from "../components/NewUserTable/NewUserTable";
// import AddPointTransaction from "../components/AddPointTransaction/AddPointTransaction";
import SearchUserModal from "../components/SearchUserModal/SearchUserModal";
// import ResultPage from "../components/ResultPage/ResultPage";
// import DelhiMarketResult from "../components/DelhiMarketResult/DelhiMarketResult";
// import DeclareStralineMarket from "../components/DeclareStralineMarket/DeclareStralineMarket";
// import CreateMainMarket from "../components/CreateMainMarket.jsx/CreateMainMarket";
import NotificationForm from "../components/Notification/NotificationForm";
import BannerForm from "../components/Banners/BannerForm";
import UpdateNotice from "../components/Notification/UpdateNotice";
import DigitAmountsPage from "../components/DigitAmountsPage";
import SignupPage from "../components/Login_And_Register/signpage";
import MainPage from "../components/MainPage/MainPage";
import AddFunds from "../components/Add_Funds/Addfund";
import HistoryPage from "../components/Big_History/bighistory";
import DMMotor from "../components/DMmotor/Dmmotor";
// import LoginPage from "./LoginPage/LoginPage";
import LoginPageUser from "../components/Login_And_Register/Loginpage";
import GamePage from "../components/Play/Play";
import WithdrawalForm from "../components/Withdraw/WithdrawalForm";
import AccountStatement from "../components/WinStatement/AccountStatement";
import Profile from "../components/UserProfile/Profile";
import SPMotorForm from "../components/SPMotor/SPMotorForm";
import Wallet from "../components/Wallet/Wallet";
import TripplePatti from "../components/TripplePatti/TripplePatti";
import SinglePatti from "../components/SinglePatti/SinglePatti";
import SingleAnk from "../components/SingleAnk/SingleAnk";
import JodiGame from "../components/JodiGame/JodiGame";
import KingJackpot from "../components/KingJackpot/KingJackpot";
import HalfSangam from "../components/HalfSangam/HalfSangam";
import FullSangam from "../components/FullSangam/FullSangam";
import DoublePatti from "../components/doublePatti/DoublePatti";
import Spdptp from "../components/SpDpTp/SpDpTp";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();

  // Define paths where sidebar and navbar should appear
  const shouldShowSidebar = () => {
    const adminPaths = [
      "/dashboard",
      "/add-user",
      "/transation-history",
      "/app-setting",
      "/main-market",
      "/delhi-market",
      "/starline-market",
      "/withdrawal-list",
      "/users-list",
      "/update-user",
      "/custom-withdrawal-rate",
      "/game-closing-time",
      "/users-wallet-balance",
      "/transaction-history",
      "/active-users",
      "/blocked-users",
      "/add-point",
      "/deduct-point",
      "/admin-point-history",
      "/auto-point-history",
      "/main-result-upload",
      "/delhi-result-upload",
      "/starline-result-upload",
      "/game-wise-rate",
      "/main-market-upload-chart",
      "/bid-analysis",
      "/running-game",
      "/all-game-rate",
      "/starline-marketing",
      "/notification-list",
      "/banners",
      "/payment-mode-wise-collection",
      "/member-analysis",
      "/winning-users-page",
      "/user-biding-report",
      "/new-user-tables",
      "/add-notification",
      "/digit-amounts",
      "/add-banner",
      "/update-notice",
    ];

    return adminPaths.some((path) => location.pathname.startsWith(path));
  };

  return (
    <div>
      {shouldShowSidebar() && <Sidebar />}
      {shouldShowSidebar() && <Navbar />}

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/app-setting" element={<AppSetting />} />
        <Route path="/main-market" element={<MainMarket />} />
        <Route path="/delhi-market" element={<DelhiMarket />} />
        <Route path="/starline-market" element={<Starline />} />
        <Route
          path="/withdrawal-list/pending"
          element={<WithdrawalListPending />}
        />
        <Route
          path="/withdrawal-list/completed"
          element={<WithdrawalListCompleted />}
        />
        <Route
          path="/withdrawal-list/rejected"
          element={<WithdrawalListRejected />}
        />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/users-list" element={<ApplicationUsersList />} />
        <Route path="/update-user" element={<UpdateUser />} />
        <Route
          path="/custom-withdrawal-rate"
          element={<CustomWithdrawalRate />}
        />
        <Route path="/game-closing-time" element={<GameClosingTime />} />
        <Route path="/users-wallet-balance" element={<UsersWalletBalance />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/active-users" element={<ActiveUsers />} />
        <Route path="/blocked-users" element={<BlockedUsers />} />
        <Route path="/add-point" element={<AddPoint />} />
        <Route path="/deduct-point" element={<DeductPoint />} />
        <Route path="/admin-point-history" element={<AdminPointHistory />} />
        <Route path="/auto-point-history" element={<AutoPointAndHistory />} />
        <Route path="/main-result-upload" element={<MainResultUpload />} />
        <Route path="/delhi-result-upload" element={<DelhiResultUpload />} />
        <Route
          path="/starline-result-upload"
          element={<StarlineResultUpload />}
        />
        <Route path="/game-wise-rate" element={<GameWiseRate />} />
        <Route
          path="/main-market-upload-chart"
          element={<MainMarketUploadChart />}
        />
        <Route path="/bid-analysis" element={<BidAnalysis />} />
        <Route path="/running-game" element={<RunningGamesList />} />
        <Route path="/all-game-rate" element={<GameMarketSettings />} />
        <Route path="/starline-marketing" element={<StarlineMarketing />} />
        <Route path="/transation-history" element={<TransactionHistory />} />
        <Route path="/notification-list" element={<NotificationList />} />
        <Route path="banners" element={<Banners />} />
        <Route
          path="/payment-mode-wise-collection"
          element={<PaymentModeWiseCollection />}
        />
        <Route path="/member-analysis" element={<MemberAnalysis />} />
        <Route path="/winning-users-page" element={<WinningUsersPage />} />
        <Route path="/user-biding-report" element={<UserBidingReport />} />
        <Route path="/new-user-tables" element={<NewUserTable />} />
        {/* <Route
          path="/add-point-transaction"
          element={<AddPointTransaction />}
        /> */}
        <Route path="/search-user-modal" element={<SearchUserModal />} />
        {/* <Route path="/declared-result-list" element={<ResultPage />} /> */}
        {/* <Route path="/delhi-market-result" element={<DelhiMarketResult />} /> */}
        {/* <Route
          path="/delhi-starline-market-result"
          element={<DeclareStralineMarket />}
        /> */}
        {/* <Route path="/game-setting" element={<CreateMainMarket />} /> */}
        <Route path="/add-notification" element={<NotificationForm />} />
        <Route path="/digit-amounts" element={<DigitAmountsPage />} />
        <Route path="/add-banner" element={<BannerForm />} />
        <Route path="/update-notice" element={<UpdateNotice />} />
        {/* <Route path="/" element={<Dashboard />} /> */}

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/addfunds" element={<AddFunds />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/game/dmmotor" element={<DMMotor />} />
        <Route path="/" element={<LoginPageUser />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/withdraw" element={<WithdrawalForm />} />
        <Route path="/statement" element={<AccountStatement />} />
        <Route path="/myprofile" element={<Profile />} />
        <Route path="/game/spmotor" element={<SPMotorForm />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/game/triplepatti" element={<TripplePatti />} />
        <Route path="/game/singlepatti" element={<SinglePatti />} />
        <Route path="/game/singleank" element={<SingleAnk />} />
        <Route path="/game/jodi" element={<JodiGame />} />
        <Route path="/kingjackpot" element={<KingJackpot />} />
        <Route path="/game/halfsangam" element={<HalfSangam />} />
        <Route path="/game/fullsangam" element={<FullSangam />} />
        <Route path="/game/DoublePatti" element={<DoublePatti />} />
        <Route path="/game/spdptp" element={<Spdptp />} />
      </Routes>
    </div>
  );
}

export default Layout;
