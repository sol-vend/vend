import React, { useState, useEffect } from 'react';
import { API_URL } from '../Components/Shared';
import {
    passwordToggleBtnHoverStyles,
} from './ManualSignUpStyles';  // Import the styles
import { socialPlatforms } from './Shared';
import LocationComponent from './LocationComponent';
import CustomDropdown from './CustomDropdown';
import DivExpandButton from './DivExpandButton';
import PaymentInfoForm from './PaymentInfoForm';
import CustomWeekdayPicker from './CustomWeekdayPicker';
import CustomCheckbox from './CustomCheckbox';
import PasswordToggle from './PasswordToggle';

const ManualSignUp = () => {
    const [formData, setFormData] = useState({
        emailAddress: '',
        confirmationPassword: '',
        initialPassword: '',
        businessName: '',
        logo: null,
        businessDescription: '',
        businessHours: {},
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
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [submitFailureMessage, setSubmitFailureMessage] = useState(false);
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

    useEffect(() => {
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
        if (name === 'confirmationPassword'){
            if (submitFailureMessage){
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
        handleChange(e);
    }

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
        e.preventDefault();
        if (formData.initialPassword !== formData.confirmationPassword) {
            setSubmitFailureMessage("It looks like your passwords do not match. Fix this and then come back and see me.")
        } else if (formData.confirmationPassword.length === 0) {
            setSubmitFailureMessage("You must confirm your password to continue.")
        } else {
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
                    <PaymentInfoForm setSubmitResponse={setSubmitResponse} submitResponse={submitResponse} formData={formData} setFormData={setFormData} />
                )}
            {!submitResponse.doProceed && (
                <div
                    className='vendor-form-styles'
                >
                    <h2
                        className='vendor-heading-styles'
                    >Create Your Business Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div
                            className='vendor-input-group-styles'>
                            <label>Email Address:</label>
                            <input
                                type="email"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                required
                                className='vendor-input-field-styles'
                            />
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
                                <div>
                                    Passwords do not match!
                                </div>
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
                                        placeholder='Optional'
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

                                <DivExpandButton
                                    onClick={(e) => setShowHours(!showHours)}
                                    children={
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '15vw'
                                            }}
                                        >
                                            Business Hours
                                            <span>-</span>
                                        </div>
                                    }
                                >
                                </DivExpandButton>
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
                                                alignItems: 'center'
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
                                            className='vendor-add-button-styles'
                                            style={{
                                                ...{
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
                                    className='vendor-add-button-styles'
                                >
                                    Add Employee
                                </button>
                                <div
                                    className='vendor-input-group-styles'
                                >

                                    <DivExpandButton
                                        onClick={(e) => setShowAddEmployees(!showAddEmployees)}
                                        children={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '15vw'
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
                            </div>
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
                                    left: '90%'
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
