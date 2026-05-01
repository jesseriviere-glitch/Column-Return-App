import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

// Replace this with the actual URL from the Google Apps Script deployment
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzGJBb0RUf6-xC6owFNFG6exW9djAW5Dd-WX_P_jOrV9oyef6rvd0BL16pA8LuOuxUz/exec";

const Confirmation = ({ data, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Receipt date automatically generated as current date
    const receiptDate = new Date().toISOString().split('T')[0];

    const payload = {
      serialNumber: data,
      receiptDate: receiptDate
    };

    if (GOOGLE_SHEET_WEB_APP_URL === "YOUR_WEB_APP_URL_HERE") {
        console.warn("Using placeholder URL. Simulating success.");
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setTimeout(onSuccess, 1500);
        }, 1000);
        return;
    }

    try {
      const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Bypass CORS preflight issues for simple scripts
        }
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setSubmitStatus('success');
        setTimeout(onSuccess, 1500); // Wait a moment before returning home
      } else {
        setSubmitStatus('error');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <h3>Scanned Successfully</h3>
        
        <div className="data-card">
          <span className="data-label">Serial Number</span>
          <span className="data-value">{data}</span>
        </div>

        {submitStatus === 'error' && (
          <div className="error-message">
            Failed to submit to database. Please try again.
          </div>
        )}

        {submitStatus === 'success' ? (
          <div className="success-state">
            <CheckCircle size={64} className="success-icon" />
            <p>Logged to In House Log</p>
          </div>
        ) : (
          <div className="action-buttons">
            <button 
              className="secondary-button" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <XCircle size={20} />
              <span>Cancel</span>
            </button>
            <button 
              className="primary-button" 
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="spin-icon" size={20} />
              ) : (
                <CheckCircle size={20} />
              )}
              <span>{isSubmitting ? 'Submitting...' : 'Confirm'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmation;
