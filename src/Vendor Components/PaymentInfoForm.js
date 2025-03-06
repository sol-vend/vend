import React, { useState, useEffect } from "react";
import {
  passwordToggleBtnStyles,
  passwordToggleBtnHoverStyles,
} from "./ManualSignUpStyles";
import { API_URL } from "../Components/Shared";
import PaypalOptions from "./PaypalOptions";
import CustomDropdownInput from "./CustomDropdownInput";
import CustomRadioButton from "./CustomRadioButton";
import TutorialModal from "./TutorialModal";
import AccountGenerationEmail from "./AccountGenerationEmail";
import ImageDeck from "./ImageDeck";

const PaymentInfoForm = ({
  submitResponse,
  setSubmitResponse,
  formData,
  setResetPasswordRequest,
}) => {
  const initialTokenDisplayLimit = 50;
  const [paymentMethod, setPaymentMethod] = useState("venmo");
  const [walletAddress, setWalletAddress] = useState(null);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [tokenDisplayLimit, setTokenDisplayLimit] = useState(
    initialTokenDisplayLimit
  );
  const [selectedPaymentCurrency, setSelectedPaymentCurrency] = useState();
  const [displayTutorial, setDisplayTutorial] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [bottomBannerWarning, setBottomBannerWarning] = useState("");
  const [isRepeatSignup, setIsRepeatSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://tokens.jup.ag/tokens?tags=verified"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAvailableTokens(data);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };
    if (availableTokens.length == 0) {
      fetchTokens();
    }
  }, []);

  useEffect(() => {
    if (paymentMethod == "paypal" || paymentMethod == "venmo") {
      setSelectedPaymentCurrency(getPaypalUsd());
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (selectedPaymentCurrency === undefined) {
      setSelectedPaymentCurrency(getPaypalUsd());
    }
  }, [availableTokens]);

  const handlePostResponse = () => {
    if (walletAddress.length > 0) {
      if (selectedPaymentCurrency) {
        setLoading(true);
        let now = new Date();
        now.setMinutes(now.getMinutes() + 60);
        const updatedFormData = {
          ...formData,
          vendorWalletAddress: walletAddress,
          vendorPaymentNetwork: "Solana",
          selectedPaymentMethod: selectedPaymentCurrency,
          isAccountVerified: false,
          verificationEmailExpiry: now.toISOString(),
          verificationPin: Math.floor(100000 + Math.random() * 900000),
        };
        const postData = async () => {
          try {
            const response = await fetch(`${API_URL}/api/initialize_user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
              const result = await response.json();
              if (result.status) {
                if (result.status.doContinue) {
                  setLoading(false);
                  setSignupComplete(true);
                } else {
                  setLoading(false);
                  setIsRepeatSignup(true);
                }
              }
            } else {
              setLoading(false);
              setSubmitResponse({
                result: null,
                doProceed: false,
                isApproved: false,
                error: response,
                hasAttempted: true,
              });
            }
          } catch (err) {
            setLoading(false);
            setSubmitResponse({
              result: null,
              doProceed: false,
              isApproved: false,
              error: err,
              hasAttempted: true,
            });
          }
        };
        postData();
      } else {
        setBottomBannerWarning(
          "You must select a form of payment in order to proceed!"
        );
        setTimeout(() => setBottomBannerWarning(""), 100000);
      }
    }
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const updateSubmitProceedResponseFalse = () => {
    setSubmitResponse((prevResponse) => ({
      ...prevResponse,
      doProceed: false,
    }));
  };

  const relativePasswordButtonStyles = {
    ...passwordToggleBtnStyles,
    position: "relative",
  };

  const prioritizeMajors = (array, sortCriteria) =>
    array.sort((a, b) => {
      const aContainsUSD = a.symbol.toLowerCase().includes(sortCriteria);
      const bContainsUSD = b.symbol.toLowerCase().includes(sortCriteria);

      if (aContainsUSD === bContainsUSD) {
        return b.volume - a.volume;
      }
      return aContainsUSD ? -1 : 1;
    });

  const getPaypalUsd = () => {
    return availableTokens.filter(
      (token) => token.address == "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo"
    )[0];
  };

  if (isRepeatSignup) {
    return (
      <div className="account-exists-container">
        <div className="account-exists-message">
          <h2>Account Already Exists</h2>
          <p>
            It looks like an account with this email address already exists. If
            you've forgotten your password, you can reset it.
          </p>
          <p>
            <a href="/reset-password" className="reset-password-link">
              Reset your password here.
            </a>
          </p>
        </div>
      </div>
    );
  } else if (loading) {
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
  } else {
    return (
      <div>
        {!signupComplete && (
          <div>
            <div>
              {displayTutorial && (
                <TutorialModal keepOpen={setDisplayTutorial} />
              )}
            </div>

            <div className="vendor-form-styles">
              <h3 className="vendor-header-styls">
                Set Up Your Payment Information
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="vendor-input-field-styles">
                  <div>
                    <CustomRadioButton
                      label="Venmo"
                      value="venmo"
                      checked={paymentMethod === "venmo"}
                      onChange={handlePaymentMethodChange}
                      color="#1c74bb" // Custom color
                      imagePaths={["./venmo-logo.png"]}
                    />
                  </div>
                  <div>
                    <CustomRadioButton
                      label="PayPal"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={handlePaymentMethodChange}
                      color="#1c74bb" // Custom color
                      imagePaths={["./paypal-logo.png"]}
                    />
                  </div>
                  <div>
                    <CustomRadioButton
                      label="Solana Wallet"
                      value="phantom"
                      checked={paymentMethod === "phantom"}
                      onChange={handlePaymentMethodChange}
                      color="#1c74bb" // Custom color
                      imagePaths={[
                        "./phantom-logo.png",
                        "./solflare-logo.jpg",
                        "./backpack-logo.jpg",
                      ]}
                    />
                  </div>
                </div>
                {paymentMethod === "venmo" && (
                  <div className="vendor-input-field-styles">
                    <label htmlFor="currency">Preferred Currency:</label>
                    <div className="paypal-selected-div-input">PayPal USD</div>
                    <div>
                      <button
                        onClick={() => null}
                        style={relativePasswordButtonStyles}
                        onMouseOver={(e) =>
                          (e.target.style.color =
                            passwordToggleBtnHoverStyles.color)
                        }
                        onMouseOut={(e) => (e.target.style.color = "#007bff")}
                      >
                        Why PayPal USD?
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => setDisplayTutorial(true)}
                        style={relativePasswordButtonStyles}
                        onMouseOver={(e) =>
                          (e.target.style.color =
                            passwordToggleBtnHoverStyles.color)
                        }
                        onMouseOut={(e) => (e.target.style.color = "#007bff")}
                      >
                        Need help getting started with Venmo?
                      </button>
                    </div>
                  </div>
                )}
                {paymentMethod === "paypal" && (
                  <div className="vendor-input-field-styles">
                    <label htmlFor="currency">Preferred Currency:</label>
                    <div className="paypal-selected-div-input">PayPal USD</div>
                    <div>
                      <button
                        onClick={() => setDisplayTutorial(true)}
                        style={relativePasswordButtonStyles}
                        onMouseOver={(e) =>
                          (e.target.style.color =
                            passwordToggleBtnHoverStyles.color)
                        }
                        onMouseOut={(e) => (e.target.style.color = "#007bff")}
                      >
                        Need help getting started with PayPal?
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === "phantom" && (
                  <div className="vendor-input-field-styles">
                    <label htmlFor="currency">Preferred Token:</label>
                    <CustomDropdownInput
                      options={prioritizeMajors(
                        availableTokens.slice(0, tokenDisplayLimit),
                        "usd"
                      )}
                      displayKeys={["name", "symbol"]}
                      imageKey={"logoURI"}
                      placeholderValue={"Enter coin address or select coin..."}
                      setter={setSelectedPaymentCurrency}
                    />
                    <p className="vendor-payment-change-text">
                      You can switch your payment method later if you change you
                      mind.
                    </p>
                  </div>
                )}
                {paymentMethod && (
                  <PaypalOptions parentSetWalletAddress={setWalletAddress} />
                )}
                <div>
                  <button
                    type="submit"
                    className="vendor-submit-button-styles"
                    disabled={walletAddress ? false : true}
                    onClick={() => handlePostResponse()}
                  >
                    {walletAddress
                      ? "Add Payment Info"
                      : "Wallet Address Required"}
                  </button>
                </div>
              </form>
              <div>
                {bottomBannerWarning != "" && (
                  <div className="payment-info-form-bottom-banner-warning-wrapper">
                    <h2 className="payment-info-form-bottom-banner-warning">
                      {bottomBannerWarning}
                    </h2>
                  </div>
                )}
              </div>
              {submitResponse.doProceed && (
                <div
                  className="payment-info-back-button"
                  onClick={updateSubmitProceedResponseFalse}
                >
                  {"<---"}
                </div>
              )}
            </div>
          </div>
        )}
        {signupComplete && (
          <div>
            <AccountGenerationEmail
              userEmailAddress={formData.emailAddress}
              setResetPasswordRequest={setResetPasswordRequest}
            />
          </div>
        )}
      </div>
    );
  }
};

export default PaymentInfoForm;
