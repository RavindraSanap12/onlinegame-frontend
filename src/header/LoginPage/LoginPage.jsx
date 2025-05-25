// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./LoginPage.css";
// import { API_BASE_URL } from "../../components/api";

// const LoginPage = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     mobileNo: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isSignup, setIsSignup] = useState(false);
//   const [signupData, setSignupData] = useState({
//     name: "",
//     mobileNo: "",
//     password: "",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSignupChange = (e) => {
//     const { name, value } = e.target;
//     setSignupData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mobileNo: formData.mobileNo,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       // If login is successful
//       onLogin(data); // Pass the response data to parent component
//       navigate("/dashboard"); // Navigate to dashboard
//     } catch (err) {
//       setError(err.message || "An error occurred during login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/save`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(signupData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Signup failed");
//       }

//       // If signup is successful, switch back to login
//       setIsSignup(false);
//       setError("Signup successful! Please login.");
//     } catch (err) {
//       setError(err.message || "An error occurred during signup");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="game-login-page-container">
//       <div className="game-login-page-box">
//         <h2 className="game-login-page-title">
//           {isSignup ? "Sign Up" : "Login"}
//         </h2>
//         {error && <div className="game-login-page-error">{error}</div>}

//         {isSignup ? (
//           <form className="game-login-page-form" onSubmit={handleSignup}>
//             <div className="game-login-page-input-wrapper">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 className="game-login-page-input"
//                 value={signupData.name}
//                 onChange={handleSignupChange}
//                 required
//               />
//               <span className="game-login-page-icon">👤</span>
//             </div>
//             <div className="game-login-page-input-wrapper">
//               <input
//                 type="text"
//                 name="mobileNo"
//                 placeholder="Mobile Number"
//                 className="game-login-page-input"
//                 value={signupData.mobileNo}
//                 onChange={handleSignupChange}
//                 required
//               />
//               <span className="game-login-page-icon">📱</span>
//             </div>
//             <div className="game-login-page-input-wrapper">
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 className="game-login-page-input"
//                 value={signupData.password}
//                 onChange={handleSignupChange}
//                 required
//               />
//               <span className="game-login-page-icon">🔒</span>
//             </div>
//             <button
//               type="submit"
//               className="game-login-page-button"
//               disabled={loading}
//             >
//               {loading ? "Creating Account..." : "Sign Up"}
//             </button>
//             <div
//               className="game-login-page-toggle"
//               onClick={() => setIsSignup(false)}
//             >
//               Already have an account? Login
//             </div>
//           </form>
//         ) : (
//           <form className="game-login-page-form" onSubmit={handleSubmit}>
//             <div className="game-login-page-input-wrapper">
//               <input
//                 type="text"
//                 name="mobileNo"
//                 placeholder="Mobile Number"
//                 className="game-login-page-input"
//                 value={formData.mobileNo}
//                 onChange={handleChange}
//                 required
//               />
//               <span className="game-login-page-icon">📱</span>
//             </div>
//             <div className="game-login-page-input-wrapper">
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 className="game-login-page-input"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <span className="game-login-page-icon">🔒</span>
//             </div>
//             <button
//               type="submit"
//               className="game-login-page-button"
//               disabled={loading}
//             >
//               {loading ? "Signing In..." : "Sign In"}
//             </button>
//             <div
//               className="game-login-page-toggle"
//               onClick={() => setIsSignup(true)}
//             >
//               Don't have an account? Sign Up
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
