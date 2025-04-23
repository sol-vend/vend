import React, { useState, useEffect } from "react";
import { retrieveExistingData } from "../Shared";
import Loading from "../../Loading";
import "./ManageEmployees.css";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import CustomCheckbox from "../CustomCheckbox";
import Tooltip from "../Tooltip";

export const EmployeeDropdown = ({
  employees,
  setIsEmployeeDropdownOpen,
  isEmployeeDropdownOpen,
  formData,
  selectedDropdownEmployeeId,
  handleAddNewEmployee,
  handleSelectEmployee,
}) => {
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
            onClick={() => handleAddNewEmployee()}
          >
            <p>Add New Employee</p>
            <p>
              <FaPlus size={"1em"} />
            </p>
          </div>
          {employees.map((employee, index) => (
            <div
              className={"employee-dropdown-item"}
              key={`employee-${index}`}
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

export default EmployeeDropdown;
