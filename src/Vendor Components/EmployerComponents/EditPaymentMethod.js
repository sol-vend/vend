import React, { useState, useEffect } from "react";

import CustomDropdownInput from "../CustomDropdownInput";
import CustomRadioButton from "../CustomRadioButton";
import { API_URL } from "../../Components/Shared";
import PaypalOptions from "../PaypalOptions";
import { retrieveExistingData, updateExistingData } from "../Shared";

const EditPaymentMethod = ({ userId }) => {
  const [currentPaymentDetails, setCurrentPaymentDetails] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [availableTokens, setAvailableTokens] = useState([]);
  const [selectedPaymentCurrency, setSelectedPaymentCurrency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await fetch("https://tokens.jup.ag/tokens?tags=verified");
      const data = await res.json();
      setAvailableTokens(data);
    };

    const fetchUserPaymentInfo = async () => {
      const paymentDetails = await retrieveExistingData([
        "vendorWalletAddress",
        "vendorPaymentNetwork",
        "selectedPaymentMethod",
      ]);
      if (paymentDetails.response) {
        setCurrentPaymentDetails(paymentDetails.response);
      }
    };

    fetchTokens();
    fetchUserPaymentInfo();
  }, []);

  useEffect(() => {
    console.log(currentPaymentDetails);
    if (currentPaymentDetails.vendorWalletAddress?.length > 0){
        setWalletAddress(currentPaymentDetails.vendorWalletAddress)
    }
  }, [currentPaymentDetails]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);

    const updatedData = {
      vendorWalletAddress: walletAddress,
      selectedPaymentMethod: selectedPaymentCurrency,
    };
    const status = await updateExistingData(updatedData)
    setLoading(false);
    setUpdateStatus(status.status === "Success" ? "success" : "error");
  };

  const getPaypalUsd = () =>
    availableTokens.find(
      (t) => t.address === "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo"
    );

  useEffect(() => {
    if (
      (paymentMethod === "paypal" || paymentMethod === "venmo") &&
      availableTokens.length > 0
    ) {
      setSelectedPaymentCurrency(getPaypalUsd());
    }
  }, [paymentMethod, availableTokens]);

  return (
    <div className="vendor-form-styles">
      <h3>Edit Your Payment Information</h3>

      <CustomRadioButton
        label="Venmo"
        value="venmo"
        checked={paymentMethod === "venmo"}
        onChange={handlePaymentMethodChange}
        imagePaths={["./venmo-logo.png"]}
      />
      <CustomRadioButton
        label="PayPal"
        value="paypal"
        checked={paymentMethod === "paypal"}
        onChange={handlePaymentMethodChange}
        imagePaths={["./paypal-logo.png"]}
      />
      <CustomRadioButton
        label="Solana Wallet"
        value="phantom"
        checked={paymentMethod === "phantom"}
        onChange={handlePaymentMethodChange}
        imagePaths={["./phantom-logo.png"]}
      />

      {paymentMethod === "phantom" && (
        <CustomDropdownInput
          options={availableTokens.slice(0, 50)}
          displayKeys={["name", "symbol"]}
          imageKey="logoURI"
          setter={setSelectedPaymentCurrency}
        />
      )}

      <PaypalOptions parentSetWalletAddress={setWalletAddress} walletAddress={walletAddress} />

      <button
        onClick={handleSave}
        className={"vendor-submit-button-styles"}
        disabled={loading || !walletAddress  || ! selectedPaymentCurrency}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {updateStatus === "success" && <p>Payment info updated successfully.</p>}
      {updateStatus === "error" && (
        <p style={{ color: "red" }}>Update failed. Try again.</p>
      )}
    </div>
  );
};

export default EditPaymentMethod;
