import { useState, useEffect } from "react";
import "./AppSetting.css";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

export default function AppSetting() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    applicationName: "",
    companyAddress: "",
    autoApproved: "Yes",
    upId: "",
    mobileNo: "",
    whatsappNo: "",
    emailId: "",
    telegramLink: "",
    youtubeLink: "",
    playstore: "",
    minPointAdd: "",
    minWithdraw: "",
    maxWithdraw: "",
    withdrawOpen: "",
    withdrawClose: "",
    withdrawalEnabled: "Yes",
    withdrawalContent: "",
    shareLink: "",
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Handle API errors consistently
  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
      throw new Error("Session expired. Please login again.");
    }
    throw new Error(error.response?.data?.message || "Request failed");
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        const response = await fetch(`${API_BASE_URL}/app-settings`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch settings");

        const data = await response.json();
        const setting = data[0]; // Handle array response

        if (setting) {
          setFormData({
            applicationName: setting.applicationName || "",
            companyAddress: setting.companyAddress || "",
            autoApproved: setting.autoApproved ? "Yes" : "No",
            upId: setting.upiId || "",
            mobileNo: setting.mobileNumber || "",
            whatsappNo: setting.whatsappNumber || "",
            emailId: setting.email || "",
            telegramLink: setting.telegramLink || "",
            youtubeLink: setting.youtubeLink || "",
            playstore: setting.playstoreLink || "",
            minPointAdd: setting.minPointAdd?.toString() || "",
            minWithdraw: setting.minWithdraw?.toString() || "",
            maxWithdraw: setting.maxWithdraw?.toString() || "",
            withdrawOpen: setting.withdrawOpenTime?.substring(0, 5) || "",
            withdrawClose: setting.withdrawCloseTime?.substring(0, 5) || "",
            withdrawalEnabled: setting.withdrawalEnabled ? "Yes" : "No",
            withdrawalContent: setting.withdrawalContent || "",
            shareLink: setting.shareLink || "",
          });
        } else {
          throw new Error("No settings found");
        }
      } catch (error) {
        setMessage({ text: error.message, type: "error" });
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      // Prepare payload in API format
      const payload = {
        applicationName: formData.applicationName,
        companyAddress: formData.companyAddress,
        autoApproved: formData.autoApproved === "Yes",
        upiId: formData.upId,
        mobileNumber: formData.mobileNo,
        whatsappNumber: formData.whatsappNo,
        email: formData.emailId,
        telegramLink: formData.telegramLink,
        youtubeLink: formData.youtubeLink,
        playstoreLink: formData.playstore,
        minPointAdd: Number(formData.minPointAdd) || 0,
        minWithdraw: Number(formData.minWithdraw) || 0,
        maxWithdraw: Number(formData.maxWithdraw) || 0,
        withdrawOpenTime: formData.withdrawOpen
          ? `${formData.withdrawOpen}:00`
          : "00:00:00",
        withdrawCloseTime: formData.withdrawClose
          ? `${formData.withdrawClose}:00`
          : "00:00:00",
        withdrawalEnabled: formData.withdrawalEnabled === "Yes",
        withdrawalContent: formData.withdrawalContent,
        shareLink: formData.shareLink,
      };

      // Save/Update data
      const response = await fetch(`${API_BASE_URL}/app-settings`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setMessage({ text: "Settings saved successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="form-container">Loading settings...</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="section-header">App Setting</div>

          {message.text && (
            <div className={`alert ${message.type}`}>{message.text}</div>
          )}

          <div className="form-body">
            {/* Row 1 */}
            <div className="form-row">
              <div className="form-group form-group-half">
                <label className="form-label">Application Name</label>
                <input
                  type="text"
                  name="applicationName"
                  value={formData.applicationName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group form-group-half">
                <label className="form-label">Company Address</label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="form-group form-group-quarter">
                <label className="form-label">Auto Approved</label>
                <select
                  name="autoApproved"
                  value={formData.autoApproved}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="form-group form-group-quarter">
                <label className="form-label">UPI ID</label>
                <input
                  type="text"
                  name="upId"
                  value={formData.upId}
                  onChange={handleInputChange}
                  className="form-input light-gray-bg"
                />
              </div>
              <div className="form-group form-group-quarter">
                <label className="form-label">Mobile No</label>
                <input
                  type="text"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  className="form-input light-gray-bg"
                />
              </div>
              <div className="form-group form-group-quarter">
                <label className="form-label">Whatsapp No</label>
                <input
                  type="text"
                  name="whatsappNo"
                  value={formData.whatsappNo}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="form-row">
              <div className="form-group form-group-half">
                <label className="form-label">Email ID</label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group form-group-half">
                <label className="form-label">Telegram Link</label>
                <input
                  type="url"
                  name="telegramLink"
                  value={formData.telegramLink}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="form-row">
              <div className="form-group form-group-half">
                <label className="form-label">Youtube Link</label>
                <input
                  type="url"
                  name="youtubeLink"
                  value={formData.youtubeLink}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group form-group-half">
                <label className="form-label">Playstore Link</label>
                <input
                  type="url"
                  name="playstore"
                  value={formData.playstore}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="form-row">
              <div className="form-group form-group-quarter">
                <label className="form-label">Min Point Add</label>
                <input
                  type="number"
                  name="minPointAdd"
                  value={formData.minPointAdd}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>
              <div className="form-group form-group-quarter">
                <label className="form-label">Min. Withdraw</label>
                <input
                  type="number"
                  name="minWithdraw"
                  value={formData.minWithdraw}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>
              <div className="form-group form-group-quarter">
                <label className="form-label">Max. Withdraw</label>
                <input
                  type="number"
                  name="maxWithdraw"
                  value={formData.maxWithdraw}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>
              <div className="form-group form-group-quarter">
                <label className="form-label">Withdraw Open</label>
                <div className="time-input">
                  <input
                    type="time"
                    name="withdrawOpen"
                    value={formData.withdrawOpen}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 6 */}
            <div className="form-row">
              <div className="form-group form-group-half">
                <label className="form-label">Withdraw Close</label>
                <div className="time-input">
                  <input
                    type="time"
                    name="withdrawClose"
                    value={formData.withdrawClose}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group form-group-half">
                <label className="form-label">Withdrawal Enabled</label>
                <select
                  name="withdrawalEnabled"
                  value={formData.withdrawalEnabled}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Withdrawal Content Editor */}
            <div className="form-group">
              <label className="withdrawal-form-label">
                Withdrawal Content
              </label>
              <div className="editor-container">
                <div className="editor-toolbar">
                  <div className="format-group">
                    <select className="text-type-select">
                      <option value="normal">Normal text</option>
                      <option value="heading1">Heading 1</option>
                      <option value="heading2">Heading 2</option>
                      <option value="heading3">Heading 3</option>
                      <option value="paragraph">Paragraph</option>
                    </select>
                  </div>
                  <div className="toolbar-buttons">
                    <button type="button" className="tool-button bold-button">
                      Bold
                    </button>
                    <button type="button" className="tool-button italic-button">
                      Italic
                    </button>
                    <button
                      type="button"
                      className="tool-button underline-button"
                    >
                      Underline
                    </button>
                    <button type="button" className="tool-button">
                      ≡
                    </button>
                    <button type="button" className="tool-button">
                      •
                    </button>
                    <button type="button" className="tool-button">
                      ⟰
                    </button>
                    <button type="button" className="tool-button">
                      ⟱
                    </button>
                    <button type="button" className="tool-button">
                      ✎
                    </button>
                    <button type="button" className="tool-button">
                      🔗
                    </button>
                    <button type="button" className="tool-button">
                      🖼
                    </button>
                  </div>
                </div>

                <div className="editor-content">
                  <textarea
                    name="withdrawalContent"
                    value={formData.withdrawalContent}
                    onChange={handleInputChange}
                    className="withdrawal-text-input"
                    placeholder="WITHDRAWL AVAILABLE 12am TO 12am"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="withdrawal-form-label">Share Link</label>
              <div className="editor-container">
                <textarea
                  name="shareLink"
                  value={formData.shareLink}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Download Career point Group and earn coins at home, Download link - https://aarabonlinegames.live/"
                  rows="3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
