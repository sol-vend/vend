import React, { useState, useEffect } from "react";
import { retrieveExistingData, updateExistingData } from "../Shared";
import Loading from "../../Loading";
import "./ManageEmployees.css";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import CustomCheckbox from "../CustomCheckbox";
import Tooltip from "../Tooltip";

const ManageEmployees = () => {
  // State management
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(-1);
  const [formFields, setFormFields] = useState({
    name: "",
    userId: "",
    role: "",
    contactInfo: "",
    contactPreference: "email"
  });
  const [emailError, setEmailError] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(window.innerWidth <= 768);

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await retrieveExistingData(["approvedReadOnlyEmployees", "businessId"]);
        if (data.response) {
          setFormData(data.response);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle dropdown selection change
  const handleEmployeeChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedEmployeeIndex(index);
    
    if (index >= 0 && formData.approvedReadOnlyEmployees[index]) {
      const employee = formData.approvedReadOnlyEmployees[index];
      setFormFields({
        name: employee.name || "",
        userId: employee.userId || "",
        role: employee.role || "",
        contactInfo: employee.contactInfo || "",
        contactPreference: employee.contactPreference || "email"
      });
    } else {
      // Reset form for new employee
      setFormFields({
        name: "",
        userId: "",
        role: "",
        contactInfo: "",
        contactPreference: "email"
      });
    }
  };

  // Add a new employee (sets the dropdown to "Add New Employee")
  const handleAddNewEmployee = () => {
    setSelectedEmployeeIndex(-1);
    setFormFields({
      name: "",
      userId: "",
      role: "",
      contactInfo: "", 
      contactPreference: "email"
    });
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      const newUserId = generateUserId(value);
      setFormFields(prev => ({ 
        ...prev, 
        [name]: value,
        userId: newUserId
      }));
    } else if (name === "contactInfo" && formFields.contactPreference === "email") {
      // Validate email format
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      setEmailError(!isValidEmail && value !== "");
      setFormFields(prev => ({ ...prev, [name]: value }));
    } else if (name === "contactInfo" && formFields.contactPreference === "text") {
      // Format phone number
      const formattedValue = formatPhoneNumber(value);
      setFormFields(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormFields(prev => ({ ...prev, [name]: value }));
    }
  };

  // Toggle contact preference
  const handleContactPreferenceChange = () => {
    const newPreference = formFields.contactPreference === "email" ? "text" : "email";
    setFormFields(prev => ({ ...prev, contactPreference: newPreference }));
    
    // Reset error when switching preference
    if (newPreference === "text") {
      setEmailError(false);
    }
  };

  // Format phone number helper
  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned === "") return "";
    
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);
    
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      let formatted = "";
      if (match[1]) formatted += `${match[1]}`;
      if (match[2]) formatted += formatted ? ` ${match[2]}` : match[2];
      if (match[3]) formatted += formatted ? `-${match[3]}` : match[3];
      return formatted;
    }
    
    return value;
  };

  // Generate userId based on name
  const generateUserId = (name) => {
    if (!name || !formData || !formData.businessId) return "";
    
    const lowerCaseName = name.toLowerCase();
    const matchingNames = formData.approvedReadOnlyEmployees.filter(
      item => item.name.toLowerCase() === lowerCaseName
    );
    
    if (matchingNames.length === 0) {
      return `${lowerCaseName}@${formData.businessId}`;
    } else {
      return `${lowerCaseName}-${matchingNames.length}@${formData.businessId}`;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formFields.name || !formFields.role || !formFields.contactInfo) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (formFields.contactPreference === "email" && emailError) {
      alert("Please enter a valid email address");
      return;
    }
    
    const updatedEmployees = [...formData.approvedReadOnlyEmployees];
    
    if (selectedEmployeeIndex === -1) {
      // Add new employee
      updatedEmployees.push({
        name: formFields.name,
        userId: formFields.userId,
        role: formFields.role,
        contactInfo: formFields.contactInfo,
        contactPreference: formFields.contactPreference,
        resetRequest: {}
      });
    } else {
      // Update existing employee
      updatedEmployees[selectedEmployeeIndex] = {
        ...updatedEmployees[selectedEmployeeIndex],
        name: formFields.name,
        userId: formFields.userId,
        role: formFields.role,
        contactInfo: formFields.contactInfo,
        contactPreference: formFields.contactPreference
      };
    }
    
    setFormData({
      ...formData,
      approvedReadOnlyEmployees: updatedEmployees
    });
    
    updateExistingData({approvedReadOnlyEmployees: updatedEmployees});
    handleAddNewEmployee();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="employee-management-wrapper">
      {/* Standard Select Dropdown */}
      <div className="employee-dropdown-container">
        <label htmlFor="employee-select">Select Employee:</label>
        <div className="select-container">
          <select 
            id="employee-select"
            value={selectedEmployeeIndex}
            onChange={handleEmployeeChange}
            className="employee-select"
          >
            <option value="-1">Add New Employee</option>
            {formData.approvedReadOnlyEmployees.map((employee, index) => (
              <option key={index} value={index}>
                {employee.name || "Unnamed Employee"}
              </option>
            ))}
          </select>
          <button 
            type="button" 
            className="add-employee-button"
            onClick={handleAddNewEmployee}
          >
            <FaPlus /> New
          </button>
        </div>
      </div>

      {/* Employee Form */}
      <div className={isMobileDevice ? "mobile-custom-checkbox-wrapper" : "frontend-options-vendor-input-group-styles"}>
        <div className="vendor-input-group-styles vendor-expansion-wrapper-styles">
          <p>{selectedEmployeeIndex === -1 ? "Add Your Employee:" : "Modify Employee Info:"}</p>
          <p className="custom-checkbox-wrapper-paragraph-descriptor">
            {selectedEmployeeIndex === -1
              ? "Just add your employee's name, job description and contact info and we'll have them complete the rest!"
              : "Modify your employee's name, job description and contact info as needed."}
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="vendor-input-group-styles">
              {/* Name Field */}
              <div>
                <label htmlFor="name-input">Name</label>
                <input
                  id="name-input"
                  type="text"
                  name="name"
                  value={formFields.name}
                  onChange={handleInputChange}
                  className="vendor-input-field-styles"
                  required
                />
              </div>
              
              {/* User ID Field */}
              <div>
                <label htmlFor="userid-input">User ID</label>
                <input
                  id="userid-input"
                  type="text"
                  name="userId"
                  value={formFields.userId}
                  className="vendor-input-field-styles"
                  readOnly={true}
                />
              </div>
              
              {/* Role Field */}
              <div>
                <label htmlFor="role-input">Job Title:</label>
                <input
                  id="role-input"
                  type="text"
                  name="role"
                  value={formFields.role}
                  onChange={handleInputChange}
                  className="vendor-input-field-styles"
                  required
                />
              </div>
              
              {/* Contact Info Section */}
              <div style={{ display: "flex", gap: "3vw", justifyContent: "space-between" }}>
                <div>
                  <Tooltip message="This allows your employee to finish setting up their account.">
                    <label htmlFor="contact-input">Contact Info:</label>
                    <input
                      id="contact-input"
                      type={formFields.contactPreference === "email" ? "email" : "tel"}
                      name="contactInfo"
                      value={formFields.contactInfo}
                      onChange={handleInputChange}
                      className="vendor-input-field-styles"
                      style={{
                        maxWidth: "40vw",
                        borderColor: emailError ? "red" : ""
                      }}
                      placeholder={formFields.contactPreference === "email" ? "Email" : "Phone"}
                      required
                    />
                  </Tooltip>
                  {emailError && (
                    <p style={{ fontSize: "12px" }} className="payment-info-form-bottom-banner-warning">
                      There may be a problem with this email address...
                    </p>
                  )}
                </div>
                
                <div>
                  <CustomCheckbox
                    label={{
                      title: "",
                      description: `Switch to ${formFields.contactPreference === "email" ? "text" : "email"}?`
                    }}
                    checked={formFields.contactPreference === "text"}
                    onChange={handleContactPreferenceChange}
                    name="contactPreference"
                  />
                </div>
              </div>
              
              {/* Notification Status */}
              <div>
                <p
                  className={
                    formFields.contactInfo && !emailError
                      ? "vendor-employee-info-wrapper complete"
                      : "vendor-employee-info-wrapper"
                  }
                  style={{ marginLeft: "auto", maxHeight: "10vh", padding: "4px" }}
                >
                  {selectedEmployeeIndex === -1 && formFields.contactInfo && !emailError ? (
                    <>
                      <FaCheckCircle color="green" size="2em" />
                      <span>Employee will be notified upon signup!</span>
                    </>
                  ) : (
                    selectedEmployeeIndex === -1 && (
                      <span>Add employee contact info to enable them to create an account.</span>
                    )
                  )}
                </p>
              </div>
            </div>
            
            {/* Submit Button */}
            <div>
              <button type="submit" className="vendor-submit-button-styles">
                {selectedEmployeeIndex === -1 ? "Add Employee" : "Update Employee"}
              </button>
            </div>
          </form>
          
          <div style={{ boxShadow: "#cbcbcbc2 0px -0.5px 0px 0px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployees;