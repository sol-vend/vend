// ManualSignUpStyles.js
const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '600px',
    margin: 'auto',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
};

const inputGroupStyles = {
    display: 'flex',
    flexDirection: 'column',
};

const comboGroupStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
}

const inputFieldStyles = {
    padding: '10px',
    marginTop: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
};

const radioButtonInputStyles = {
    paddingBlock: "10px",
    border: "#f3f3f3",
    borderStyle: "solid",
    borderRadius: "20px",
    maxWidth: "20vw",
    boxShadow: "#f0f8ff8f -4px -2px 18px 11px",
    background: "linear-gradient(180deg, #f4f4f4, transparent)",
    marginBottom: "10px",
}

const passwordContainerStyles = {
    position: 'relative',
};

const passwordToggleBtnStyles = {
    position: 'absolute',
    right: '0',
    top: '0',
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'color 0.3s ease',
};

const passwordToggleBtnHoverStyles = {
    color: '#0056b3',
};

const buttonStyles = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const buttonHoverStyles = {
    backgroundColor: '#0056b3',
};

const socialMediaInputsStyles = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
};

const addButtonStyles = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const removeButtonStyles = {
    backgroundColor: '#ff5733',
    color: 'white',
    border: 'none',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const submitButtonStyles = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px',
    fontSize: '18px',
    marginTop: '20px',
    width: '100%',
    cursor: 'pointer',
};

const headingStyles = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    color: '#333',
};

const imgStyles = {
    width: '20px',    // Adjust size as needed
    height: '20px',   // Adjust size as needed
    marginRight: '10px',
    verticalAlign: 'middle',
  };
  
  const optionStyles = {
    display: 'flex',
    alignItems: 'center',
  };

  const showHideStyles = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBlock: '5px',
    paddingBlock: '5px',
    paddingInline: '7.5px',
    background: 'linear-gradient(45deg, #e2e2e275, #d1d1d199)',
    borderRadius: '5px',
    fontSize: '14px',
    maxWidth: 'fit-content',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    cursor: 'pointer',
    marginLeft: 'auto',
  };
  
  const expansionWrapperStyles = {
    borderColor: "#98989817",
    borderRadius: "4px",
    borderStyle: "solid",
    boxShadow: "#f2f1f1 5px 1px 8px 2px"
  }

export {
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
};
