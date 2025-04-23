import React from "react";

export const EmployeeNameField = ({ handleEmployeeChange, selectedDropdownEmployeeId, formData }) => {
    /*
                  <div className="vendor-input-group-styles">
                <label>Email Address:</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleEmailChange}
                  required
                  className="vendor-input-field-styles"
                />
                {isUserExists && (
                  <div>
                    <p
                      className="payment-info-form-bottom-banner-warning"
                      style={{ justifyContent: "flex-start", fontSize: "12px" }}
                    >
                      An account with this email address already exists.
                    </p>
                    <p
                      onClick={() => {
                        setResetPasswordRequest(true);
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#0056b3")} // Mouse hover effect
                      onMouseLeave={(e) => (e.target.style.color = "#007BFF")} // Mouse out effect
                      style={{ cursor: "pointer", color: "#007BFF" }}
                    >
                      Reset your password?
                    </p>
                  </div>
                )}
              </div>
    */
  return (
    <div className="vendor-input-group-styles">
      <label>Name:</label>
      <input
        type="text"
        name="name"
        placeholder={
          formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId].name
        }
        onChange={(e) => handleEmployeeChange(selectedDropdownEmployeeId, e)}
        className="vendor-input-field-styles"
      />
    </div>
  );
};
