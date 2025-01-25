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
    expansionWrapperStyles
} from './ManualSignUpStyles';  // Import the styles
import { socialPlatforms } from './Shared';
import LocationComponent from './LocationComponent';
import CustomDropdown from './CustomDropdown';
import DivExpandButton from './DivExpandButton';
import PaymentInfoForm from './PaymentInfoForm';

const ManualSignUp = () => {
    const [formData, setFormData] = useState({
        emailAddress: '',
        initialPassword: '',
        businessName: '',
        logo: null,
        businessDescription: '',
        businessHours: { open: '', close: '' },
        businessPhone: '',
        businessSocials: [{ platform: '', url: '' }],
        businessReviews: '',
        businessLocation: '',
        isLocationServicesEnabled: false,
        approvedReadOnlyEmployees: [{ name: '', role: '', isLocked: false, pin: '' }],
        ipAddress: '',
        userAgent: '',
        referer: '',
        timestamp: '',
        ipMetadata: {}
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isBusinessLogo, setIsBusinessLogo] = useState(false);
    const [showHours, setShowHours] = useState(false);
    const [showAddEmployees, setShowAddEmployees] = useState(false);
    const [submitResponse, setSubmitResponse] = useState({
        result: null,
        doProceed: false,
        isApproved: false,
        error: null,
        hasAttempted: false
    });

    useEffect(() => {
        const captureMetadata = async () => {
            if (!formData.ipAddress) {
                console.log('capturing metadata')
                const ipAddress = await getIpAddress();  // Fetch IP address using an external API
                const userAgent = navigator.userAgent;  // Get the user agent string
                const referer = document.referrer;      // Get the referer (the previous page URL)
                const timestamp = new Date().toISOString();  // Get the timestamp
                const ipMetadata = await getLocationMetadataFromIp(ipAddress);  // Get location metadata

                setFormData((prevState) => ({
                    ...prevState,
                    ipAddress: ipAddress,  // Use the fetched IP address here
                    userAgent: userAgent,
                    referer: referer,
                    timestamp: timestamp,
                    ipMetadata: ipMetadata
                }));
            }
        };

        captureMetadata();  // Make sure the function is called
    }, [formData.ipAddress]);  // Optionally add dependencies if needed

    useEffect(() => {
        console.log(formData);
        console.log(submitResponse);
    }, [submitResponse])

    const getIpAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return 'Unknown';
        }
    };

    const handleSelectPlatform = (index, selectedPlatform) => {
        const newBusinessSocials = [...formData.businessSocials];
        newBusinessSocials[index].platform = selectedPlatform.value;
        setFormData({ ...formData, businessSocials: newBusinessSocials });
    };

    const getLocationMetadataFromIp = async (ipAddress) => {
        try {
            const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return 'Unknown';
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }

        return value;
    };

    const handlePhoneNumberChange = (e) => {
        const { name, value } = e.target;
        const formattedPhoneNumber = formatPhoneNumber(value);
        setFormData((prevState) => ({
            ...prevState,
            [name]: formattedPhoneNumber,
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const logoObject = {
                file,
                previewURL: URL.createObjectURL(file),  // This creates a temporary URL for previewing the logo
            };
            setFormData((prevState) => ({
                ...prevState,
                logo: logoObject,  // Save the logo object with file and preview URL
            }));
        }
    }

    const handleBusinessHoursChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            businessHours: {
                ...prevState.businessHours,
                [name]: value,
            },
        }));
    };

    const handleLocationServicesChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            isLocationServicesEnabled: e.target.checked,
        }));
    };

    const handleEmployeeChange = (index, e) => {
        const { name, value } = e.target;
        const newEmployees = [...formData.approvedReadOnlyEmployees];
        let assignValue = value;
        if (e.target.tagName === 'BUTTON') {
            e.preventDefault();
            assignValue = !newEmployees[index][name];
            if (!newEmployees[index]['pin']) {
                newEmployees[index]['pin'] = generateEmployeePin();
            }
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
                { name: '', role: '', isLocked: false, pin: '' },
            ],
        }));
    };

    const handleAddSocialMedia = () => {
        setFormData((prevState) => ({
            ...prevState,
            businessSocials: [...prevState.businessSocials, { platform: '', url: '' }],
        }));
    };

    const handleSocialMediaChange = (index, e) => {
        const { name, value } = e.target;
        const newSocials = [...formData.businessSocials];
        newSocials[index][name] = value;
        setFormData((prevState) => ({
            ...prevState,
            businessSocials: newSocials,
        }));
    };

    const handleRemoveSocialMedia = (index) => {
        const newSocials = formData.businessSocials.filter((_, i) => i !== index);
        setFormData((prevState) => ({
            ...prevState,
            businessSocials: newSocials,
        }));
    };

    const updateSubmitProceedResponse = () => {
        setSubmitResponse((prevResponse) => ({
            ...prevResponse,
            doProceed: true
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitResponse({
            result: null,
            doProceed: true,
            isApproved: true,
            error: null,
            hasAttempted: true
        });
    };

    const generateEmployeePin = () => {
        return Math.floor(100000 + Math.random() * 900000)
    }

    return (
        <div>
            {submitResponse.doProceed && submitResponse.isApproved &&
                (
                    <PaymentInfoForm setSubmitResponse={setSubmitResponse} submitResponse={submitResponse} formData={formData} setFormData={setFormData} />
                )}
            {!submitResponse.doProceed && (
                <div style={formStyles}>
                    <h2 style={headingStyles}>Create Your Business Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={inputGroupStyles}>
                            <label>Email Address:</label>
                            <input
                                type="email"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                required
                                style={inputFieldStyles}
                            />
                        </div>
                        <div style={inputGroupStyles}>
                            <label>Password:</label>
                            <div style={passwordContainerStyles}>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="initialPassword"
                                    value={formData.initialPassword}
                                    onChange={handleChange}
                                    required
                                    style={inputFieldStyles}
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    style={passwordToggleBtnStyles}
                                    onMouseOver={(e) => (e.target.style.color = passwordToggleBtnHoverStyles.color)}
                                    onMouseOut={(e) => (e.target.style.color = '#007bff')}
                                >
                                    {passwordVisible ? 'Hide Password' : 'Show Password'}
                                </button>
                            </div>
                        </div>
                        <div style={inputGroupStyles}>
                            <label>Business Name:</label>
                            <div style={passwordContainerStyles}>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    style={inputFieldStyles}
                                    placeholder='Optional'
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsBusinessLogo(!isBusinessLogo)}
                                    style={passwordToggleBtnStyles}
                                    onMouseOver={(e) => (e.target.style.color = passwordToggleBtnHoverStyles.color)}
                                    onMouseOut={(e) => (e.target.style.color = '#007bff')}
                                >
                                    {isBusinessLogo ? 'Hide' : 'Upload Logo'}
                                </button>
                                {isBusinessLogo && (
                                    <div style={inputGroupStyles}>
                                        <label
                                            htmlFor='logo-upload'
                                        >Upload
                                            <div
                                                style={{ ...addButtonStyles, width: '14%' }}
                                            >Select File
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="logo-upload"
                                            onChange={handleLogoChange}
                                            style={{ ...inputFieldStyles, display: 'none' }}
                                        />
                                        {formData.logo && formData.logo.previewURL && (
                                            <div>
                                                <h4>Logo Preview:</h4>
                                                <img src={formData.logo.previewURL} alt="Logo Preview" style={{ width: '100px', height: 'auto' }} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={inputGroupStyles}>
                            <label>Business Description:</label>
                            <textarea
                                name="businessDescription"
                                value={formData.businessDescription}
                                onChange={handleChange}
                                style={inputFieldStyles}
                                placeholder='Optional'
                            />
                        </div>
                        {!showHours &&
                            <div style={expansionWrapperStyles}>
                                <DivExpandButton
                                    onClick={(e) => setShowHours(!showHours)}
                                    children={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            Add Business Hours
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                                                <path d="M12 2L12 22M12 22L6 16M12 22L18 16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    }
                                >
                                </DivExpandButton>
                            </div>
                        }
                        {showHours &&
                            <div style={{ ...inputGroupStyles, ...expansionWrapperStyles }}>
                                <label>Business Hours:</label>
                                <div style={socialMediaInputsStyles}>
                                    <label>Open:</label>
                                    <input
                                        type="time"
                                        name="open"
                                        value={formData.businessHours.open}
                                        onChange={handleBusinessHoursChange}
                                        style={inputFieldStyles}
                                    />
                                </div>
                                <div style={socialMediaInputsStyles}>
                                    <label>Close:</label>
                                    <input
                                        type="time"
                                        name="close"
                                        value={formData.businessHours.close}
                                        onChange={handleBusinessHoursChange}
                                        style={inputFieldStyles}
                                    />
                                </div>

                                <DivExpandButton
                                    onClick={(e) => setShowHours(!showHours)}
                                    children={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            Hide Business Hours
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 19V6M5 13l7-7 7 7" />
                                            </svg>
                                        </div>
                                    }
                                >
                                </DivExpandButton>
                            </div>
                        }
                        <div style={inputGroupStyles}>
                            <label>Phone:</label>
                            <input
                                type="tel"
                                name="businessPhone"
                                placeholder="(XXX) XXX-XXXX"
                                value={formData.businessPhone}
                                onChange={handlePhoneNumberChange}
                                style={inputFieldStyles}
                            />
                        </div>
                        <div style={inputGroupStyles}>
                            <label>Socials:</label>
                            {formData.businessSocials.map((social, index) => (
                                <div key={index} style={{ ...socialMediaInputsStyles, ...comboGroupStyles }}>
                                    <CustomDropdown
                                        options={socialPlatforms}
                                        selectedValue={social.platform}
                                        onSelect={(platform) =>
                                            handleSelectPlatform(index, platform)
                                        }
                                    />
                                    <input
                                        type="text"
                                        name="url"
                                        placeholder="Handle"
                                        value={social.url}
                                        onChange={(e) => handleSocialMediaChange(index, e)}
                                        style={{ ...inputFieldStyles, marginTop: "0px !important" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSocialMedia(index)}
                                        style={removeButtonStyles}
                                    >
                                        Remove Social
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSocialMedia}
                                style={addButtonStyles}
                            >
                                Add Social Media Account
                            </button>
                        </div>
                        <div style={inputGroupStyles}>
                            <label>Business Location:</label>
                            <input
                                type="text"
                                name="businessLocation"
                                value={formData.businessLocation}
                                onChange={handleChange}
                                style={inputFieldStyles}
                                placeholder='Optional'
                            />
                        </div>
                        <div style={inputGroupStyles}>
                            <label>Enable Location Services:</label>
                            <input
                                type="checkbox"
                                name="isLocationServicesEnabled"
                                checked={formData.isLocationServicesEnabled}
                                onChange={handleLocationServicesChange}
                                style={inputFieldStyles}
                            />
                        </div>
                        {formData.isLocationServicesEnabled &&
                            <LocationComponent />
                        }
                        {!showAddEmployees &&
                            <div style={expansionWrapperStyles}>
                                <DivExpandButton
                                    onClick={(e) => setShowAddEmployees(!showAddEmployees)}
                                    children={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            Add Employees
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                                                <path d="M12 2L12 22M12 22L6 16M12 22L18 16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    }
                                >
                                </DivExpandButton>
                            </div>
                        }
                        {showAddEmployees &&
                            <div style={{
                                ...inputGroupStyles, ...expansionWrapperStyles
                            }}>
                                <h3>Approved Read-Only Employees</h3>

                                {formData.approvedReadOnlyEmployees.map((employee, index) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            paddingBottom: '5px',
                                            alignItems: 'center',
                                            gap: '5vw',
                                        }}
                                    >
                                        <div key={index} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            paddingBottom: '5px'
                                        }}>
                                            <input
                                                type="text"
                                                name="name"
                                                value={employee.name}
                                                onChange={(e) => handleEmployeeChange(index, e)}
                                                style={{
                                                    ...inputFieldStyles, ...{
                                                        maxWidth: '40vw',
                                                        color: employee.isLocked ? 'gray' : '',
                                                        backgroundColor: employee.isLocked ? 'whitesmoke' : ''
                                                    }
                                                }}
                                                placeholder="Employee Name"
                                                readOnly={employee.isLocked}
                                            />
                                            <input
                                                type="text"
                                                name="role"
                                                value={employee.role}
                                                onChange={(e) => handleEmployeeChange(index, e)}
                                                style={{
                                                    ...inputFieldStyles, ...{
                                                        maxWidth: '40vw',
                                                        color: employee.isLocked ? 'gray' : '',
                                                        backgroundColor: employee.isLocked ? 'whitesmoke' : ''
                                                    }
                                                }}
                                                placeholder="Role"
                                                readOnly={employee.isLocked}
                                            />
                                        </div>

                                        {employee.isLocked &&
                                            <div
                                                style={{
                                                    textAlign: 'center',
                                                    maxWidth: '25vw',
                                                    marginBottom: 'auto',
                                                    borderRadius: '5px',
                                                    paddingInline: '10px',
                                                    boxShadow: '#8080805e 2px 2px 3px 3px',
                                                    background: 'linear-gradient(45deg, #f3f2f2a6, transparent)',
                                                    color: 'blue'
                                                }}
                                            >
                                                <h3>Employee Login Pin</h3>
                                                <p>{employee.pin}</p>
                                            </div>
                                        }
                                        <button
                                            name='isLocked'
                                            style={{
                                                ...addButtonStyles, ...{
                                                    marginLeft: 'auto',
                                                    maxWidth: '10vw',
                                                    maxHeight: '5vh',
                                                    marginTop: 'auto'
                                                }
                                            }}
                                            onClick={(e) =>
                                                handleEmployeeChange(index, e)
                                            }
                                        >
                                            {employee.isLocked ? 'Unlock' : 'Lock'}
                                        </button>

                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddEmployee}
                                    style={addButtonStyles}
                                >
                                    Add Employee
                                </button>
                                <div style={{ ...inputGroupStyles }}>

                                    <DivExpandButton
                                        onClick={(e) => setShowAddEmployees(!showAddEmployees)}
                                        children={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                Hide Add Employees
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="14"
                                                    height="14"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M12 19V6M5 13l7-7 7 7" />
                                                </svg>
                                            </div>
                                        }
                                    >
                                    </DivExpandButton>
                                </div>
                            </div>
                        }
                        {!submitResponse.isApproved &&
                            <button type="submit" style={submitButtonStyles}>
                                Submit
                            </button>
                        }
                        {submitResponse.isApproved &&
                        <p
                        className='manual-signup-edits-info'
                        >Need to make some edits or additions? No problem.</p>
                        }
                        {submitResponse.isApproved &&
                                <button
                                    className='payment-info-back-button'
                                    style={{
                                        left: '95%'
                                    }}
                                    onClick={updateSubmitProceedResponse}
                                >
                                    {"--->"}
                                </button>                            
                        }
                    </form>
                    {!submitResponse.doProceed && !submitResponse.isApproved && submitResponse.hasAttempted &&
                        <div>
                            <p>{"There was an issue with adding your account.  This is most likely a problem with our servers.  Please contact support."}</p>
                        </div>
                    }
                </div>
            )}
        </div>
    );
};

export default ManualSignUp;
