import React, { useState } from 'react';
import step1 from './Tutorial/step1.jpeg';
import step2 from './Tutorial/step2.jpeg';
import step3 from './Tutorial/step3.jpeg';
import step4 from './Tutorial/step4.jpeg';
import step5 from './Tutorial/step5.jpeg';
import step6 from './Tutorial/step6.jpeg';
import step7 from './Tutorial/step7.jpeg';

const tutorialImages = [
    step1, step2, step3, step4, step5, step6, step7
];

const TutorialModal = ({ keepOpen }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < tutorialImages.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="tutorial-modal-backdrop">
            <div className="tutorial-modal-content">
                <button onClick={() => keepOpen(false)} className="tutorial-exit-button">X</button>

                <div className="tutorial-image-container">
                    <img
                        src={tutorialImages[currentStep]}
                        alt={`Step ${currentStep + 1}`}
                    />
                </div>

                <div className="tutorial-button-container">
                    <button onClick={prevStep} className="tutorial-navigation-button">Previous</button>
                    <button onClick={nextStep} className="tutorial-navigation-button">Next</button>
                </div>

                {currentStep === tutorialImages.length - 1 && (
                    <div className="tutorial-link-container">
                        <p>Thank you for following the tutorial!</p>
                        <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" className="tutorial-paypal-link">
                            Visit PayPal
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};


export default TutorialModal;
