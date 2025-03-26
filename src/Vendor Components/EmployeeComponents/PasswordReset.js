import React, { useState, useEffect } from "react";
import SolanaLogoSvg from "../SolanaLogoSvg";
import axios from "axios";
import { API_URL } from "../../Components/Shared";
import { GenericMessaging } from "../Shared";

export const PasswordReset = ({ isEmployerReset }) => {
  console.log(isEmployerReset);
  const [formData, setFormData] = useState({
    emailAddress: "",
  });
  const [allowEmailProceed, setAllowEmailProceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdateComplete, setIsUpdateComplete] = useState(false);
  const [updateCompleteDialog, setUpdateCompleteDialog] = useState("");
  const [isUpdateError, setIsUpdateError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page on submit
    setLoading(true);
    const postDatas = {
      isEmployerReset: isEmployerReset,
      userId: formData.emailAddress,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/reset_password`,
        postDatas,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      console.log(response);
      if (response.data.status) {
        if (response.data.status.doContinue) {
          if (isEmployerReset) {
            setUpdateCompleteDialog(
              "An email has been sent to your account.  Please follow the link in the email to complete the password reset process."
            );
            setIsUpdateComplete(true);
          } else {
            setUpdateCompleteDialog(
              "An email has been sent to your manager. If we have your information, you will also be receiving correspondence.  In either case, please follow the link to complete the password reset process."
            );
            setIsUpdateComplete(true);
          }
        }
      } else {
        setIsUpdateError(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error resetting password:", error);
      setIsUpdateError(true);
    }
  };

  useEffect(() => {
    const isValidEmail = /\S+@\S+\.\S+/.test(formData.emailAddress);
    setAllowEmailProceed(isValidEmail);
  }, [formData.emailAddress]);

  if (loading) {
    return (
      <div
        className="modal-overlay"
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgb(0 0 0 / 75%)",
        }}
      >
        <div className="modal">
          <div className="loading-dialog">
            <p>Loading...</p>
            <div className="spinner" style={{ marginLeft: "15%" }}></div>
          </div>
        </div>
      </div>
    );
  } else if (isUpdateComplete) {
    return (
      <GenericMessaging>
        <div>
          <h3>{updateCompleteDialog}</h3>
        </div>
      </GenericMessaging>
    );
  } else if (isUpdateError) {
    return (
      <GenericMessaging isError={true}>
        <div>
          <h3>There has been a problem...</h3>
        </div>
      </GenericMessaging>
    );
  } else {
    return (
      <div className="vendor-form-styles">
        <div className="vendor-form-header-wrapper">
          <h2 className="vendor-heading-styles">{"Reset Password"}</h2>
          <p>
            Powered by <SolanaLogoSvg />
          </p>
        </div>
        <form onSubmit={handlePasswordReset}>
          <div className="vendor-input-group-styles">
            <label>
              {isEmployerReset ? "Email Address:" : "Vend Username"}
            </label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder={
                isEmployerReset
                  ? "satoshi@protonmail.com"
                  : "satoshi@business-id"
              }
              required
              className="vendor-input-field-styles"
            />
          </div>
          {formData.emailAddress && allowEmailProceed && (
            <div>
              <button
                type="submit"
                className="vendor-submit-button-styles"
                disabled={!allowEmailProceed} // Disable the button if email is invalid
              >
                Reset Password
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }
};

export default PasswordReset;
