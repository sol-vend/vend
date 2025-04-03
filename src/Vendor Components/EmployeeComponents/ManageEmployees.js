import React, { useState, useEffect } from "react";
import { retrieveExistingData } from "../Shared";
import Loading from "../../Loading";
import "./ManageEmployees.css";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import CustomCheckbox from "../CustomCheckbox";
import Tooltip from "../Tooltip";

export const ManageEmployees = () => {
  const keysToQuery = ["approvedReadOnlyEmployees"];
  const [formData, setFormData] = useState({ doFetch: true });
  const [loading, setLoading] = useState(true);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(
    window.innerWidth <= 768
  );
  const [selectedDropdownEmployeeId, setSelectedDropdownEmployeeId] =
    useState(-2);
  const [employeeEmailFormattingIssue, setEmployeeEmailFormattingIssue] =
    useState([{ isError: false }]);

  const handleAddNewEmployee = () => {
    setSelectedDropdownEmployeeId(-1);
  };

  const handleSelectEmployee = (index) => {
    setSelectedDropdownEmployeeId(index);
  };

  const EmployeeDropdown = ({ employees }) => {
    return (
      <div className="employee-dropdown-container">
        <h3>Employee's</h3>
        <div
          onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
          className={
            isEmployeeDropdownOpen
              ? "employee-dropdown-wrapper down"
              : "employee-dropdown-wrapper up"
          }
        >
          <div
            className={`employee-dropdown-container-selection ${
              isEmployeeDropdownOpen ? "open" : "closed"
            }`}
          >
            {selectedDropdownEmployeeId >= 0 && (
              <p>
                {
                  formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId]
                    .name
                }
              </p>
            )}
            {selectedDropdownEmployeeId == -1 && <p>{"Add New Employee"}</p>}
          </div>
          <div
            className={
              isEmployeeDropdownOpen
                ? "employee-dropdown open"
                : "employee-dropdown closed"
            }
          >
            <div
              className={"employee-dropdown-item"}
              onClick={handleAddNewEmployee}
            >
              <p>Add New Employee</p>
              <p>
                <FaPlus size={"1em"} />
              </p>
            </div>
            {employees.map((employee, index) => (
              <div
                className={"employee-dropdown-item"}
                onClick={() => handleSelectEmployee(index)}
              >
                <p className={"employee-dropdown-item-name"}>{employee.name}</p>
                <p className={"employee-dropdown-item-id"}>{employee.userId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const EmployeeOptions = () => {
    const handleCheckChange = () => {
      return null;
    };

    const formatPhoneNumber = (value) => {
      let cleaned = value.replace(/\D/g, "");
      if (cleaned === "") {
        return "";
      }

      if (cleaned.length > 10) {
        cleaned = cleaned.substring(0, 10);
      }
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        let formatted = "";

        if (match[1]) {
          formatted += `${match[1]}`;
        }
        if (match[2]) {
          if (formatted) formatted += " ";
          formatted += match[2];
        }

        if (match[3]) {
          if (formatted) formatted += "-";
          formatted += match[3];
        }

        return formatted;
      }

      return value;
    };

    const checkEmailErrors = (value) => {
      if (value.length > 0) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regex.test(value)) {
          return { value: value, isError: false };
        } else {
          return { value: value, isError: true };
        }
      }
      return { value: value, isError: false };
    };

    const handleEmployeeChange = (index, e) => {
      const { name, value } = e.target;
      console.log(name, value);
      const newEmployees = [...formData.approvedReadOnlyEmployees];
      let assignValue = value;

      if (name === "name") {
        newEmployees[index].userId = handleUserIdInitialization(
          value.toLowerCase()
        );
      }

      const updateEmployeeEmailStatus = (updateVal) => {
        setEmployeeEmailFormattingIssue((prevList) =>
          prevList.map((val, i) => (i === index ? { isError: updateVal } : val))
        );
      };

      if (name === "contactInfo") {
        if (e.target.placeholder !== "Email") {
          assignValue = formatPhoneNumber(value);
        } else {
          const verifyEmail = checkEmailErrors(value);
          if (verifyEmail.isError) {
            updateEmployeeEmailStatus(true);
          } else {
            updateEmployeeEmailStatus(false);
          }
        }
      }
      if (name === "contactPreference") {
        assignValue = e.target.checked ? "text" : "email";
      }
      newEmployees[index][name] = assignValue;
      setFormData((prevState) => ({
        ...prevState,
        approvedReadOnlyEmployees: newEmployees,
      }));
    };

    const handleAddEmployee = () => {
      setFormData((prevState) => ({
        ...prevState,
        approvedReadOnlyEmployees: [
          ...prevState.approvedReadOnlyEmployees,
          {
            name: "",
            role: "",
            pin: "",
            contactInfo: "",
            contactPreference: "email",
            userId: "",
            resetRequest: {},
          },
        ],
      }));
      setEmployeeEmailFormattingIssue((prevState) => [
        ...prevState,
        { index: prevState.length, isError: false },
      ]);
    };

    const handleUserIdInitialization = (currentName) => {
      const matchingNames = formData.approvedReadOnlyEmployees.filter(
        (item) => item.name.toLowerCase() === currentName
      );
      console.log(matchingNames);
      if (matchingNames.length === 0) {
        return `${currentName}@${formData.businessId}`;
      } else {
        return `${currentName}-${matchingNames.length}@${formData.businessId}`;
      }
    };

    return (
      <div
        className={
          isMobileDevice
            ? "mobile-custom-checkbox-wrapper frontend-designer"
            : "frontend-options-vendor-input-group-styles"
        }
      >
        <div className="vendor-input-group-styles vendor-expansion-wrapper-styles">
          <p>
            {selectedDropdownEmployeeId === -1
              ? "Add Your Employees:"
              : "Modify Employee Info:"}
          </p>
          <p className="custom-checkbox-wrapper-paragraph-descriptor">
            {selectedDropdownEmployeeId === -1
              ? "Just add your employee's name, job description and contact info and we'll have him or her complete the rest!"
              : "Modify your employee's name, job description and contact info as needed."}
          </p>

          <div>
            <input
              type="text"
              name="name"
              value={
                "" ||
                formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId]
                  .name
              }
              onChange={(e) =>
                handleEmployeeChange(selectedDropdownEmployeeId, e)
              }
              className="vendor-input-field-styles"
              style={{
                ...{
                  maxWidth: "40vw",
                },
              }}
              placeholder="Employee Name"
            />
            <input
              type="text"
              name="name"
              disabled
              value={
                "" ||
                formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId]
                  .userId
              }
              className="vendor-input-field-styles"
              style={{
                ...{
                  maxWidth: "40vw",
                },
              }}
              placeholder="Employee ID"
            />
            <input
              type="text"
              name="role"
              value={
                "" ||
                formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId]
                  .role
              }
              onChange={(e) =>
                handleEmployeeChange(selectedDropdownEmployeeId, e)
              }
              className="vendor-input-field-styles"
              style={{
                ...{
                  maxWidth: "40vw",
                },
              }}
              placeholder="Role / Job Description"
            />
            <div
              style={{
                display: "flex",
                gap: "3vw",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Tooltip
                  message={
                    "This allows your employee to finish setting up his or her account."
                  }
                >
                  <input
                    type={
                      formData.approvedReadOnlyEmployees[
                        selectedDropdownEmployeeId
                      ].contactInfo === "email"
                        ? "email"
                        : "tel"
                    }
                    name="contactInfo"
                    value={
                      "" ||
                      formData.approvedReadOnlyEmployees[
                        selectedDropdownEmployeeId
                      ].contactInfo
                    }
                    onChange={(e) =>
                      handleEmployeeChange(selectedDropdownEmployeeId, e)
                    }
                    className={"vendor-input-field-styles"}
                    style={{
                      ...{
                        maxWidth: "40vw",
                        borderColor:
                          employeeEmailFormattingIssue[
                            selectedDropdownEmployeeId
                          ].isError &&
                          formData.approvedReadOnlyEmployees[
                            selectedDropdownEmployeeId
                          ].contactPreference === "email"
                            ? "red"
                            : "",
                      },
                    }}
                    placeholder={
                      formData.approvedReadOnlyEmployees[
                        selectedDropdownEmployeeId
                      ].contactPreference === "email"
                        ? "Email"
                        : "(XXX) XXX-XXXX"
                    }
                  />
                </Tooltip>
                {employeeEmailFormattingIssue[selectedDropdownEmployeeId]
                  .isError &&
                  formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId]
                    .contactPreference === "email" && (
                    <p
                      style={{ fontSize: "12px" }}
                      className="payment-info-form-bottom-banner-warning"
                    >
                      There may be a problem with this email address...
                    </p>
                  )}
              </div>
              <div>
                <CustomCheckbox
                  label={{
                    title: "",
                    description: `Switch to ${
                      formData.approvedReadOnlyEmployees[
                        selectedDropdownEmployeeId
                      ].contactPreference === "email"
                        ? "text"
                        : "email"
                    }?`,
                  }}
                  checked={
                    formData.approvedReadOnlyEmployees[
                      selectedDropdownEmployeeId
                    ].contactPreference === "text"
                  }
                  onChange={handleEmployeeChange}
                  name={"contactPreference"}
                  selectedDropdownEmployeeId={selectedDropdownEmployeeId}
                />
              </div>
            </div>

            <div>
              <p
                name="notifyEmployee"
                className={
                  formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId]
                    .contactInfo &&
                  !employeeEmailFormattingIssue[selectedDropdownEmployeeId]
                    .isError
                    ? "vendor-employee-info-wrapper complete"
                    : "vendor-employee-info-wrapper"
                }
                style={{
                  ...{
                    marginLeft: "auto",
                    maxHeight: "10vh",
                    padding: "4px",
                  },
                }}
              >
                {selectedDropdownEmployeeId === -1 &&
                formData.approvedReadOnlyEmployees[selectedDropdownEmployeeId]
                  .contactInfo &&
                !employeeEmailFormattingIssue[selectedDropdownEmployeeId]
                  .isError ? (
                  <>
                    <FaCheckCircle color="green" size="2em" />
                    <span>Employee will be notified upon signup!</span>
                  </>
                ) : (
                  selectedDropdownEmployeeId === -1 && (
                    <span>
                      Add employee contact info to enable him/her to create
                      account.
                    </span>
                  )
                )}
              </p>
            </div>
          </div>

          <div style={{ boxShadow: "#cbcbcbc2 0px -0.5px 0px 0px" }}></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileDevice(true);
      } else {
        setIsMobileDevice(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getDatas = async () => {
      const datas = await retrieveExistingData(keysToQuery);
      if (datas.response) {
        setFormData((prev) => ({
          ...datas.response,
          doFetch: false,
        }));
      }
    };
    if (formData.doFetch) {
      if (!setLoading) {
        setLoading(true);
      }
      getDatas();
    }
  });

  useEffect(() => {
    console.log(formData);
    if (formData.approvedReadOnlyEmployees) {
      setLoading(false);
    }
  }, [formData]);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    return (
      <div className="employee-management-wrapper">
        <EmployeeDropdown employees={formData.approvedReadOnlyEmployees} />
        {selectedDropdownEmployeeId >= 0 && <EmployeeOptions />}
      </div>
    );
  }
};

export default ManageEmployees;
