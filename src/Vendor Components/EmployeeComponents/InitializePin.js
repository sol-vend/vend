import React, { useState, useEffect } from "react";
import SolanaLogoSvg from "../SolanaLogoSvg";
import PasswordToggle from "../PasswordToggle";
import axios from "axios";
import { API_URL } from "../../Components/Shared";
import { GenericMessaging } from "../Shared";

export const InitializePin = ({ hash, isEmployerReset }) => {
  const [formData, setFormData] = useState({
    confirmationPassword: "",
    initialPassword: "",
    businessId: "",
    userId: "",
    employeeIndex: -1,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [passwordsStatus, setPasswordsStatus] = useState(false);
  const [submitFailureMessage, setSubmitFailureMessage] = useState(false);
  const [passwordComplexityMessage, setPasswordComplexityMessage] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdateComplete, setIsUpdateComplete] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [submitResponse, setSubmitResponse] = useState({
    result: null,
    doProceed: false,
    isApproved: false,
    error: null,
    hasAttempted: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordComplexityMessage !== "") {
      setSubmitFailureMessage(
        "Your password must contain a minimum of 8 characters. It must have at least one UPPERCASE and one lowercase letter, a number and a special character."
      );
    } else if (formData.initialPassword !== formData.confirmationPassword) {
      setSubmitFailureMessage(
        "It looks like your passwords do not match. Fix this and then come back and see me."
      );
    } else if (formData.confirmationPassword.length === 0) {
      setSubmitFailureMessage("You must confirm your password to continue.");
    } else {
      setSubmitResponse({
        result: null,
        doProceed: true,
        isApproved: true,
        error: null,
        hasAttempted: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmationPassword") {
      if (submitFailureMessage) {
        setSubmitFailureMessage(false);
      }
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (value.length > 0) {
      setPasswordVerify(true);
    } else {
      setPasswordVerify(false);
    }
    const testPasswordComplexity = (password) => {
      const minLength = 8;
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
      }
      if (!hasLowerCase) {
        return "Password must contain at least one lowercase letter.";
      }
      if (!hasUpperCase) {
        return "Password must contain at least one uppercase letter.";
      }
      if (!hasNumber) {
        return "Password must contain at least one number.";
      }
      if (!hasSpecialChar) {
        return "Password must contain at least one special character.";
      }

      return "";
    };
    const passwordComplexityMessage = testPasswordComplexity(value);
    setPasswordComplexityMessage(passwordComplexityMessage);
    handleChange(e);
  };

  console.log(formData);

  const handlePasswordSet = () => {
    const setPassword = async () => {
      const postDatas = {
        initialPassword: formData.initialPassword,
        userId: formData.userId,
        businessId: formData.businessId,
        employeeIndex: formData.employeeIndex,
      };
      try {
        const response = await axios.post(
          `${API_URL}/api/employee_password_finalization`,
          postDatas,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);
        if (response.data.status && response.data.status.doContinue) {
          setIsUpdateComplete(true);
        } else {
          setIsUpdateError(true);
          setErrorResponse(response.data.status.message);
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        setLoading(false);
        setIsUpdateError(true);
      }
    };
    if (passwordsStatus) {
      setLoading(true);
      setPassword();
    }
  };

  useEffect(() => {
    if (!passwordComplexityMessage && formData.initialPassword.length > 0) {
      if (formData.confirmationPassword === formData.initialPassword) {
        setPasswordsStatus(true);
      } else {
        setPasswordsStatus(false);
      }
    } else {
      setPasswordsStatus(false);
    }
  }, [
    passwordComplexityMessage,
    formData.initialPassword,
    formData.confirmationPassword,
  ]);

  useEffect(() => {
    if (!formData.userId) {
      const fetchUserId = async () => {
        try {
          const postDatas = {
            hash: hash,
            isEmployer: isEmployerReset,
          };
          const response = await axios.post(
            `${API_URL}/api/employee_pin_initialization`,
            postDatas,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data) {
            console.log(response.data);
            setFormData((prevState) => ({
              ...prevState,
              userId: response.data.userData.userId,
              businessId: response.data.businessId || response.data.userData.userId.split('@')[1],
              employeeIndex: response.data.employeeIndex,
            }));
          } else {
          }
        } catch (error) {
          console.error("Error resetting password:", error);
        }
      };
      fetchUserId();
    }
  });

  useEffect(() => {
    if (loading) {
      if (formData.userId) {
        setLoading(false);
      }
    } else {
    }
  }, [formData.userId]);

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
          <h3>Your account is now setup! You may now login.</h3>
        </div>
      </GenericMessaging>
    );
  } else if (isUpdateError) {
    return (
      <GenericMessaging isError={true}>
        <div>
          <h3>{errorResponse}</h3>
        </div>
      </GenericMessaging>
    );
  } else {
    return (
      <div className="vendor-form-styles">
        <div className="vendor-form-header-wrapper">
          <h2 className="vendor-heading-styles">{"Initialize Account"}</h2>
          <p>
            Powered by <SolanaLogoSvg />
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="vendor-input-group-styles">
            <label>User ID:</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              disabled
              required
              className="vendor-input-field-styles"
            />
          </div>
          <div className="vendor-input-group-styles">
            <div>
              <label>Password:</label>
              <div
                className="vendor-password-container-styles"
                style={{ width: "50%" }}
              >
                <div className="password-control-visibility-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="initialPassword"
                    value={formData.initialPassword}
                    onChange={handlePasswordChange}
                    required
                    className="password-input-field-styles"
                  />
                  <div>
                    <PasswordToggle
                      parentSetPasswordVisibility={setPasswordVisible}
                    />
                  </div>
                </div>
              </div>
              {passwordComplexityMessage && formData.initialPassword && (
                <div>
                  <p
                    className="payment-info-form-bottom-banner-warning"
                    style={{
                      justifyContent: "flex-start",
                      fontSize: "12px",
                    }}
                  >
                    {passwordComplexityMessage}
                  </p>
                </div>
              )}
            </div>
            {passwordVerify && (
              <div>
                <label> Confirm Password:</label>
                <div
                  className="vendor-password-container-styles"
                  style={{ width: "50%" }}
                >
                  <div className="password-control-visibility-wrapper">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="confirmationPassword"
                      value={formData.confirmationPassword}
                      onChange={handleChange}
                      required
                      className="password-input-field-styles"
                    />
                    <div>
                      <PasswordToggle
                        parentSetPasswordVisibility={setPasswordVisible}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {formData.initialPassword !== formData.confirmationPassword && (
              <p
                className="payment-info-form-bottom-banner-warning"
                style={{ justifyContent: "flex-start", fontSize: "12px" }}
              >
                Passwords do not match!
              </p>
            )}
          </div>
          {formData.userId &&
            formData.initialPassword &&
            formData.confirmationPassword &&
            passwordsStatus && (
              <div>
                <button
                  onClick={handlePasswordSet}
                  className="vendor-submit-button-styles"
                  type="submit"
                >
                  Complete Account Setup
                </button>
              </div>
            )}
        </form>
      </div>
    );
  }
};

export default InitializePin;
