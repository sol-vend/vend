import React, { useState, useEffect } from 'react';
import { API_URL } from '../Components/Shared';
import {
  formStyles,
  inputGroupStyles,
  inputFieldStyles,
  passwordContainerStyles,
  passwordToggleBtnStyles,
  passwordToggleBtnHoverStyles,
  buttonStyles,
  buttonHoverStyles,
  socialMediaInputsStyles,
  addButtonStyles,
  removeButtonStyles,
  submitButtonStyles,
  headingStyles,
  optionStyles,
  imgStyles,
  comboGroupStyles,
  showHideStyles,
  expansionWrapperStyles,
  radioButtonInputStyles
} from './ManualSignUpStyles';
import PaypalOptions from './PaypalOptions';
import CustomDropdownInput from './CustomDropdownInput';
import CustomRadioButton from './CustomRadioButton';
import TutorialModal from './TutorialModal'

const PaymentInfoForm = ({ submitResponse, setSubmitResponse, formData, setFormData }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currency, setCurrency] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [tokenDisplayLimit, setTokenDisplayLimit] = useState(50);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [displayTutorial, setDisplayTutorial] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://tokens.jup.ag/tokens?tags=verified');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAvailableTokens(data); // Set the fetched tokens to the state
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };
    if (availableTokens.length == 0) {
      fetchTokens();
    }
  }, []);

  const handlePostResponse = () => {
    if (walletAddress.length > 0) {
      if (selectedPayment) {
        const updatedFormData = {
          ...formData,
          vendorWalletAddress: walletAddress,
          vendorPaymentNetwork: 'Solana',
          selectedPaymentMethod: paymentMethod == 'paypal' ? getPaypalUsd() : selectedPayment,
        }
        console.log(updatedFormData);
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
            //setREsult
          }
        } catch (err){

        }
      }
    }
  }

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setSelectedPayment(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ paymentMethod, currency, walletAddress });
  };

  const updateSubmitProceedResponseFalse = () => {
    setSubmitResponse((prevResponse) => ({
      ...prevResponse,
      doProceed: false
    }))
  }

  const relativePasswordButtonStyles = {
    ...passwordToggleBtnStyles,
    position: 'relative'
  }

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
    return (availableTokens.filter((token) => token.address == "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo")[0]);
  }

  return (
    <div>
      <div>
        {displayTutorial &&
          <TutorialModal keepOpen={setDisplayTutorial} />
        }
      </div>

      <div style={formStyles}>
        <h3 style={headingStyles}>Set Up Your Payment Information</h3>
        <form
          onSubmit={handleSubmit}
        >
          <div style={inputGroupStyles}>
            <div
              style={radioButtonInputStyles}
            >
              <CustomRadioButton
                label="PayPal"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={handlePaymentMethodChange}
                color="#1c74bb" // Custom color
              />
            </div>
            <div
              style={radioButtonInputStyles}
            >
              <CustomRadioButton
                label="Solana Wallet"
                value="phantom"
                checked={paymentMethod === 'phantom'}
                onChange={handlePaymentMethodChange}
                color="#1c74bb" // Custom color
              />
            </div>
          </div>

          {paymentMethod === 'paypal' && (
            <div style={inputGroupStyles}>
              <label htmlFor="currency">Preferred Currency:</label>
              <div
                className='paypal-selected-div-input'
              >PayPal USD</div>
              <div>
                <button
                  onClick={() => setDisplayTutorial(true)}
                  style={relativePasswordButtonStyles}
                  onMouseOver={(e) => (e.target.style.color = passwordToggleBtnHoverStyles.color)}
                  onMouseOut={(e) => (e.target.style.color = '#007bff')}
                >Need some help getting integrating with PayPal?</button></div>
            </div>
          )}

          {paymentMethod === 'phantom' && (
            <div style={inputGroupStyles}>
              <label htmlFor="currency">Preferred Token:</label>
              <CustomDropdownInput
                options={prioritizeMajors(availableTokens.slice(0, tokenDisplayLimit), 'usd')}
                displayKeys={['name', 'symbol']}
                imageKey={'logoURI'}
                placeholderValue={'Enter coin address or select coin...'}
                setter={setSelectedPayment}
              />
              <p className='vendor-payment-change-text'>
                You can switch your payment method later if you change you mind.
              </p>
            </div>
          )}
          {paymentMethod &&
            <PaypalOptions parentSetWalletAddress={setWalletAddress} />
          }
          <div style={inputGroupStyles}>
            <button
              type="submit"
              style={{ ...submitButtonStyles, ...buttonStyles }}
              className='vendor-submit-button-styles'
              disabled={walletAddress ? false : true}
              onClick={() => handlePostResponse()}
            >
              {walletAddress ? "Add Payment Info" : "Wallet Address Required"}
            </button>
          </div>
        </form>
        {submitResponse.doProceed &&
          <button
            className='payment-info-back-button'
            onClick={updateSubmitProceedResponseFalse}
          >
            {"<---"}
          </button>
        }
      </div>
    </div>
  );
};

export default PaymentInfoForm;
