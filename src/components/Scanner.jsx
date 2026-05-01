import React, { useRef, useState, useEffect, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { X, Loader } from 'lucide-react';

const Scanner = ({ onSuccess, onCancel, sessionLog }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  // Initialize camera
  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Get image data URL
      const imageData = canvas.toDataURL('image/jpeg');

      // Run Tesseract OCR
      const result = await Tesseract.recognize(
        imageData,
        'eng',
        { 
          logger: m => console.log(m),
        }
      );

      const text = result.data.text;
      console.log("OCR Result:", text);

      // Extract QD number (assuming format QD followed by alphanumeric/dashes)
      const match = text.match(/QD[A-Za-z0-9-]+/);

      if (match) {
        const serialNumber = match[0];
        
        // Stop stream before success
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        onSuccess(serialNumber);
      } else {
        setError("Could not find a valid QD number. Please try again.");
        setIsProcessing(false);
      }

    } catch (err) {
      console.error("OCR Error:", err);
      setError("Failed to process image. Please try again.");
      setIsProcessing(false);
    }
  }, [isProcessing, onSuccess, stream, sessionLog]);

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onCancel();
  };

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <button className="icon-btn" onClick={handleCancel}>
          <X size={24} />
        </button>
        <h3>SCAN LABEL</h3>
        <div style={{ width: 24 }}></div> {/* Spacer for alignment */}
      </div>

      <div className="video-wrapper">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <video 
          ref={videoRef} 
          playsInline 
          muted 
          className="video-feed"
        />
        
        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="target-overlay">
          <div className="target-box"></div>
        </div>
      </div>

      <div className="scanner-controls">
        <div className="button-ring" style={{ marginBottom: 0 }}>
          <button 
            className="scan-btn-neumorphic" 
            onClick={captureAndScan}
            disabled={isProcessing}
            style={{ 
              color: 'white', 
              fontSize: '1.2rem', 
              fontWeight: '600',
              letterSpacing: '2px',
              border: 'none',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <Loader className="spin-icon" size={36} color="white" />
            ) : (
              <span>CAPTURE</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
