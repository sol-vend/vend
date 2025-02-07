import React, { useState, useEffect } from 'react';
import { API_URL } from '../Components/Shared';
import { socialPlatforms, getIpAddress, getLocationMetadataFromIp } from './Shared';
import LocationComponent from './LocationComponent';
import CustomDropdown from './CustomDropdown';
import DivExpandButton from './DivExpandButton';
import PaymentInfoForm from './PaymentInfoForm';
import CustomWeekdayPicker from './CustomWeekdayPicker';
import CustomCheckbox from './CustomCheckbox';
import PasswordToggle from './PasswordToggle';
import SolanaLogoSvg from './SolanaLogoSvg';
import Tooltip from './Tooltip';

const ManualSignUp = () => {

    const [formData, setFormData] = useState({
        emailAddress: '',
        confirmationPassword: '',
        initialPassword: '',
        businessName: '',
        businessId: '',
        logo: null,
        businessDescription: '',
        businessHours: {},
        businessPhone: '',
        businessSocials: [{ platform: '', url: '' }],
        businessReviews: '',
        businessLocation: '',
        isLocationServicesEnabled: false,
        approvedReadOnlyEmployees: [{ name: '', role: '', isLocked: false, pin: '', contactInfo: '', contactPreference: 'email' }],
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
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [submitFailureMessage, setSubmitFailureMessage] = useState(false);
    const [isUserExists, setIsUserExists] = useState(false);
    const [resetPasswordRequest, setResetPasswordRequest] = useState(false);
    const [passwordComplexityMessage, setPasswordComplexityMessage] = useState('');
    const [allowEmailProceed, setAllowEmailProceed] = useState(false);
    const [employeeEmailFormattingIssue, setEmployeeEmailFormattingIssue] = useState([{ isError: false }])
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

    const handleSelectPlatform = (index, selectedPlatform) => {
        const newBusinessSocials = [...formData.businessSocials];
        newBusinessSocials[index].platform = selectedPlatform.value;
        setFormData({ ...formData, businessSocials: newBusinessSocials });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'businessName') {
            const cleaned = value.replace(/[^\w\s]/g, '');
            const formatted = cleaned.replace(/\s+/g, '-');
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
                businessId: formatted
            }));
        } else {
            if (name === 'confirmationPassword') {
                if (submitFailureMessage) {
                    setSubmitFailureMessage(false);
                }
            }
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
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
    }

    const handleEmailChange = (e) => {
        handleChange(e)
        const { name, value } = e.target;
        if (value.length > 0) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (regex.test(value)) {
                const checkUserExistStatus = async () => {
                    try {
                        const response = await fetch(`${API_URL}/api/user_in_database`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ emailAddress: value }),
                        });
                        const data = await response.json();
                        setIsUserExists(data.result);
                        setAllowEmailProceed(!data.result)
                    } catch (error) {
                        console.error(error);
                    }
                }
                checkUserExistStatus();
            } else {
                setIsUserExists(false);
                setAllowEmailProceed(false);
            }
        }
    }

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
                return 'Password must be at least 8 characters long.';
            }
            if (!hasLowerCase) {
                return 'Password must contain at least one lowercase letter.';
            }
            if (!hasUpperCase) {
                return 'Password must contain at least one uppercase letter.';
            }
            if (!hasNumber) {
                return 'Password must contain at least one number.';
            }
            if (!hasSpecialChar) {
                return 'Password must contain at least one special character.';
            }

            return '';
        }
        setPasswordComplexityMessage(testPasswordComplexity(value));
        handleChange(e);
    }

    const formatPhoneNumber = (value) => {
        let cleaned = value.replace(/\D/g, '');
        if (cleaned === '') {
            return '';
        }

        if (cleaned.length > 10) {
            cleaned = cleaned.substring(0, 10);
        }
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            let formatted = '';

            if (match[1]) {
                formatted += `${match[1]}`;
            }
            if (match[2]) {
                if (formatted) formatted += ' ';
                formatted += match[2];
            }

            if (match[3]) {
                if (formatted) formatted += '-';
                formatted += match[3];
            }

            return formatted;
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
                previewURL: URL.createObjectURL(file),
            };
            setFormData((prevState) => ({
                ...prevState,
                logo: logoObject,
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
console.log(formData);
    const handleLocationServicesChange = (isEnabled) => {
        setFormData((prevState) => ({
            ...prevState,
            isLocationServicesEnabled: isEnabled,
        }));
    };

    const handleEmployeeChange = (index, e) => {
        const { name, value } = e.target;
        const newEmployees = [...formData.approvedReadOnlyEmployees];
        let assignValue = value;

        const updateEmployeeEmailStatus = (updateVal) => {
            setEmployeeEmailFormattingIssue((prevList) =>
                prevList.map((val, i) =>
                    i === index
                        ? { isError: updateVal } :
                        val
                )
            )
        };

        if (name === 'contactInfo') {
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
        if (name === 'contactPreference') {
            assignValue = e.target.checked ? 'text' : 'email';
        }
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
    }

    const handleAddEmployee = () => {
        setFormData((prevState) => ({
            ...prevState,
            approvedReadOnlyEmployees: [
                ...prevState.approvedReadOnlyEmployees,
                { name: '', role: '', isLocked: false, pin: '' },
            ],
        }));
        setEmployeeEmailFormattingIssue((prevState) => ([
            ...prevState,
            { index: prevState.length, isError: false }
        ]))
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
        e.preventDefault();
        if (passwordComplexityMessage !== "") {
            setSubmitFailureMessage("Your password must contain a minimum of 8 characters. It must have at least one UPPERCASE and one lowercase letter, a number and a special character.")
        }
        else if (formData.initialPassword !== formData.confirmationPassword) {
            setSubmitFailureMessage("It looks like your passwords do not match. Fix this and then come back and see me.")
        } else if (formData.confirmationPassword.length === 0) {
            setSubmitFailureMessage("You must confirm your password to continue.")
        } else if (!allowEmailProceed) {
            setSubmitFailureMessage("It looks like there's a problem with your email address. Fix this and let's try again.")
        }
        else {
            setSubmitResponse({
                result: null,
                doProceed: true,
                isApproved: true,
                error: null,
                hasAttempted: true
            });
        }
    };

    const generateEmployeePin = () => {
        return Math.floor(100000 + Math.random() * 900000)
    }

    return (
        <div>
            {submitResponse.doProceed && submitResponse.isApproved &&
                (
                    <PaymentInfoForm setSubmitResponse={setSubmitResponse} submitResponse={submitResponse} formData={formData} setResetPasswordRequest={setResetPasswordRequest} />
                )}
            {!submitResponse.doProceed && (
                <div
                    className='vendor-form-styles'
                >
                    <div className='vendor-form-header-wrapper'>
                        <h2
                            className='vendor-heading-styles'
                        >{"Welcome to "}<strong>Vend</strong></h2>
                        <p>Powered by <SolanaLogoSvg /></p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div
                            className='vendor-input-group-styles'>
                            <label>Email Address:</label>
                            <input
                                type="email"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleEmailChange}
                                required
                                className='vendor-input-field-styles'
                            />
                            {isUserExists &&
                                <div>
                                    <p className='payment-info-form-bottom-banner-warning' style={{ justifyContent: 'flex-start', fontSize: '12px' }}>
                                        An account with this email address already exists.
                                    </p>
                                    <p
                                        onClick={() => { setResetPasswordRequest(true) }}
                                        onMouseEnter={(e) => e.target.style.color = '#0056b3'}  // Mouse hover effect
                                        onMouseLeave={(e) => e.target.style.color = '#007BFF'}  // Mouse out effect
                                        style={{ cursor: 'pointer', color: "#007BFF" }}
                                    >
                                        Reset your password?
                                    </p>
                                </div>
                            }
                        </div>
                        <div
                            className='vendor-input-group-styles'>
                            <div>
                                <label>Password:</label>
                                <div
                                    className='vendor-password-container-styles'
                                    style={{ width: '50%' }}
                                >
                                    <div
                                        className='password-control-visibility-wrapper'
                                    >
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            name="initialPassword"
                                            value={formData.initialPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className='password-input-field-styles'
                                        />
                                        <div>
                                            <PasswordToggle parentSetPasswordVisibility={setPasswordVisible} />
                                        </div>
                                    </div>
                                </div>
                                {passwordComplexityMessage && formData.initialPassword &&
                                    <div>
                                        <p className='payment-info-form-bottom-banner-warning' style={{ justifyContent: 'flex-start', fontSize: '12px' }}>{passwordComplexityMessage}</p>
                                    </div>
                                }
                            </div>
                            {passwordVerify &&
                                <div>
                                    <label> Confirm Password:</label>
                                    <div
                                        className='vendor-password-container-styles'
                                        style={{ width: '50%' }}
                                    >
                                        <div
                                            className='password-control-visibility-wrapper'
                                        >
                                            <input
                                                type={passwordVisible ? 'text' : 'password'}
                                                name="confirmationPassword"
                                                value={formData.confirmationPassword}
                                                onChange={handleChange}
                                                required
                                                className='password-input-field-styles'
                                            />
                                            <div>
                                                <PasswordToggle parentSetPasswordVisibility={setPasswordVisible} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {formData.initialPassword !== formData.confirmationPassword &&
                                <p className='payment-info-form-bottom-banner-warning' style={{ justifyContent: 'flex-start', fontSize: '12px' }}>Passwords do not match!</p>
                            }
                        </div>
                        <div
                            className='vendor-input-group-styles'>
                            <label>Business Name:</label>
                            <div
                                className='vendor-password-container-styles'
                            >
                                <div
                                    className='business-name-logo-preview-wrapper'
                                >
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className='vendor-input-field-styles'
                                        required
                                        placeholder='Business Name'
                                    />
                                    {formData.logo !== null &&
                                        <div
                                            className='preview-logo-image-wrapper'
                                        >
                                            <img src={formData.logo.previewURL}></img>
                                        </div>
                                    }
                                </div>
                                <div
                                    type="button"
                                    onClick={() => { setIsBusinessLogo(false); setTimeout(() => document.getElementById('logo-upload').click(), 100); }}  // Trigger the file input click directly
                                    className='vendor-show-hide-styles'
                                >
                                    {isBusinessLogo ? 'Add Logo' : 'Change Logo'}
                                </div>

                                <div
                                    style={{ display: 'none' }}
                                >
                                    <label
                                        htmlFor='logo-upload'
                                        className='vendor-input-field-styles' // Keep the styling for the label (optional)
                                    >
                                        {isBusinessLogo ? (
                                            <div
                                                className='vendor-add-button-styles'
                                                style={{ width: '14%' }}
                                            >
                                                Select File
                                            </div>
                                        ) : null}
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="logo-upload"
                                        onChange={handleLogoChange}
                                        className='vendor-input-field-styles'
                                        style={{ display: 'none' }} // Hide the file input
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className='vendor-input-group-styles'>
                            <label>Business Description:</label>
                            <textarea
                                name="businessDescription"
                                value={formData.businessDescription}
                                onChange={handleChange}
                                className='vendor-input-field-styles'
                                placeholder='Optional'
                            />
                        </div>

                        <div
                            className='vendor-input-group-styles'>
                            <label>Phone:</label>
                            <input
                                type="tel"
                                name="businessPhone"
                                placeholder="(XXX) XXX-XXXX"
                                value={formData.businessPhone}
                                onChange={handlePhoneNumberChange}
                                className='vendor-input-field-styles'
                            />
                        </div>
                        <div
                            className='vendor-input-group-styles'>
                            <label>Socials:</label>
                            {formData.businessSocials.map((social, index) => (
                                <div key={index}
                                    className='vendor-social-media-inputs-styles vendor-combo-group-styles'
                                >
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
                                        className='vendor-input-field-styles'
                                        style={{ ...{ marginTop: "0px !important", maxWidth: '50%', marginLeft: '10%' } }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSocialMedia(index)}
                                        className='vendor-remove-button-styles'
                                    >
                                        -
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSocialMedia}
                                className='vendor-add-button-styles'
                            >
                                +
                            </button>
                        </div>
                        <div
                            className='vendor-input-group-styles'>
                            <label>Business Address:</label>
                            <input
                                type="text"
                                name="businessLocation"
                                value={formData.businessLocation}
                                onChange={handleChange}
                                className='vendor-input-field-styles'
                                placeholder='Optional'
                            />
                        </div>
                        <div
                            className='vendor-input-group-styles'>
                            <CustomCheckbox
                                label={{ title: "Location Services Preference:", description: "This will automatically let people know if you're open and how to find you." }}
                                name="isLocationServicesEnabled"
                                checked={formData.isLocationServicesEnabled}
                                onChange={handleLocationServicesChange}
                            />
                        </div>
                        {formData.isLocationServicesEnabled &&
                            <LocationComponent />
                        }
                        {!showHours &&
                            <div className='vendor-expansion-wrapper-styles'>
                                <DivExpandButton
                                    onClick={(e) => setShowHours(!showHours)}
                                    children={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingInline: '5px',
                                                width: '100px'
                                            }}
                                        >
                                            Business Hours
                                            <span>+</span>
                                        </div>
                                    }
                                >
                                </DivExpandButton>
                            </div>
                        }
                        {showHours &&
                            <div
                                className='vendor-input-group-styles vendor-expansion-wrapper-styles'
                            >
                                <div>Business Hours:</div>
                                <CustomWeekdayPicker />
                                <div
                                    className='vendor-social-media-inputs-styles'>
                                    <input
                                        type="time"
                                        name="open"
                                        style={{ display: 'none' }}
                                        value={formData.businessHours.open}
                                        onChange={handleBusinessHoursChange}
                                        className='vendor-input-field-styles'
                                    />
                                </div>
                                <div className='vendor-social-media-inputs-styles'>
                                    <input
                                        type="time"
                                        name="close"
                                        style={{ display: 'none' }}
                                        value={formData.businessHours.close}
                                        onChange={handleBusinessHoursChange}
                                        className='vendor-input-field-styles'
                                    />
                                </div>
                                <div style={{ boxShadow: "#cbcbcbc2 0px -0.5px 0px 0px" }}>
                                    <DivExpandButton
                                        onClick={(e) => setShowHours(!showHours)}
                                        children={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingInline: '5px',
                                                    width: '100px',
                                                }}
                                            >
                                                Business Hours
                                                <span>-</span>
                                            </div>
                                        }
                                    >
                                    </DivExpandButton>
                                </div>
                            </div>
                        }
                        {!showAddEmployees &&
                            <div className='vendor-expansion-wrapper-styles'>
                                <DivExpandButton
                                    onClick={(e) => setShowAddEmployees(!showAddEmployees)}
                                    children={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingInline: '5px',
                                                width: '100px'
                                            }}
                                        >
                                            Add Employees
                                            <span>+</span>
                                        </div>
                                    }
                                >
                                </DivExpandButton>
                            </div>
                        }
                        {showAddEmployees &&
                            <div
                                className='vendor-input-group-styles vendor-expansion-wrapper-styles'
                            >
                                <p>Add Your Employees:</p>
                                <p
                                    className='custom-checkbox-wrapper-paragraph-descriptor'
                                >
                                    Be sure to share the generated pin number so your employee can login.
                                </p>
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
                                                className='vendor-input-field-styles'
                                                style={{
                                                    ...{
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
                                                className='vendor-input-field-styles'
                                                style={{
                                                    ...{
                                                        maxWidth: '40vw',
                                                        color: employee.isLocked ? 'gray' : '',
                                                        backgroundColor: employee.isLocked ? 'whitesmoke' : ''
                                                    }
                                                }}
                                                placeholder="Role / Job Description"
                                                readOnly={employee.isLocked}
                                            />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '3vw',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <div>
                                                    <Tooltip message={"Quickly share PIN with your employee."}>
                                                        <input
                                                            type={employee.contactInfo === 'email' ? 'email' : 'tel'}
                                                            name="contactInfo"
                                                            value={employee.contactInfo}
                                                            onChange={(e) => handleEmployeeChange(index, e)}
                                                            className={'vendor-input-field-styles'}
                                                            style={{
                                                                ...{
                                                                    maxWidth: '40vw',
                                                                    color: employee.isLocked ? 'gray' : '',
                                                                    backgroundColor: employee.isLocked ? 'whitesmoke' : '',
                                                                    borderColor: employeeEmailFormattingIssue[index].isError && employee.contactPreference === 'email' ? 'red' : ''
                                                                }
                                                            }}
                                                            placeholder={employee.contactPreference === 'email' ? "Email" : "(XXX) XXX-XXXX"}
                                                            readOnly={employee.isLocked}
                                                        />
                                                    </Tooltip>
                                                    {employeeEmailFormattingIssue[index].isError && employee.contactPreference === 'email' &&
                                                        <p
                                                            style={{ fontSize: '12px' }}
                                                            className='payment-info-form-bottom-banner-warning'>
                                                            There may be a problem with this email address...
                                                        </p>
                                                    }
                                                </div>
                                                <div>
                                                    <CustomCheckbox
                                                        label={{ title: '', description: `Switch to ${employee.contactPreference === 'email' ? 'text' : 'email'}?` }}
                                                        checked={employee.contactPreference === 'text'}
                                                        onChange={handleEmployeeChange}
                                                        name={'contactPreference'}
                                                        index={index} />
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={employee.isLocked ? 'vendor-employee-pin-wrapper' : ''}
                                        >
                                            {employee.isLocked &&
                                                <div
                                                    style={{
                                                        textAlign: 'end',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <p>Employee Login Pin: <strong>{employee.pin}</strong></p>
                                                </div>
                                            }
                                            <button
                                                name='isLocked'
                                                className='vendor-add-button-styles'
                                                disabled={employee.name ? false : true}
                                                style={{
                                                    ...{
                                                        marginLeft: 'auto',
                                                        maxHeight: '10vh',
                                                    }
                                                }}
                                                onClick={(e) =>
                                                    handleEmployeeChange(index, e)
                                                }
                                            >
                                                {!employee.name ? 'Enter Name' : employee.isLocked ? 'Edit Employee Details' : 'Generate Login Pin'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddEmployee}
                                    className={'vendor-add-button-styles'}
                                >
                                    +
                                </button>
                                <div
                                    style={{ boxShadow: "#cbcbcbc2 0px -0.5px 0px 0px" }}
                                >

                                    <DivExpandButton
                                        onClick={(e) => setShowAddEmployees(!showAddEmployees)}
                                        children={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingInline: '5px',
                                                    width: '100px'
                                                }}
                                            >
                                                Add Employees <span>-</span>
                                            </div>
                                        }
                                    >
                                    </DivExpandButton>
                                </div>
                            </div>
                        }
                        {!submitResponse.isApproved &&
                            <div>
                                <button type="submit" className='vendor-submit-button-styles'>
                                    Submit
                                </button>
                                {formData.initialPassword !== formData.confirmationPassword &&
                                    <div className='signup-submission-failure-wrapper'>
                                        <p>{submitFailureMessage}</p>
                                    </div>
                                }
                                {passwordComplexityMessage !== "" &&
                                    < div className='signup-submission-failure-wrapper'>
                                        <p>{submitFailureMessage}</p>
                                    </div>
                                }
                                {!allowEmailProceed &&
                                    <div className='signup-submission-failure-wrapper'>
                                        <p>{submitFailureMessage}</p>
                                    </div>
                                }
                            </div>
                        }
                        {submitResponse.isApproved &&
                            <p
                                className='manual-signup-edits-info'
                            >Need to make some edits or additions? No problem. This can be done now or later in our Employer Panel.</p>
                        }
                        {submitResponse.isApproved &&
                            <button
                                className='payment-info-back-button'
                                style={{
                                    marginLeft: '90%',
                                    minWidth: '60px'
                                }}
                                onClick={updateSubmitProceedResponse}
                            >
                                {"--->"}
                            </button>
                        }
                    </form>
                    {
                        !submitResponse.doProceed && !submitResponse.isApproved && submitResponse.hasAttempted &&
                        <div>
                            <p>{"There was an issue with adding your account.  This is most likely a problem with our servers.  Please contact support."}</p>
                        </div>
                    }
                </div >
            )}
        </div >
    );
};

export default ManualSignUp;
