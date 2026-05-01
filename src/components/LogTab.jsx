import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle, RefreshCw, FileCheck } from 'lucide-react';

const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzGJBb0RUf6-xC6owFNFG6exW9djAW5Dd-WX_P_jOrV9oyef6rvd0BL16pA8LuOuxUz/exec";

const LogTab = ({ sessionLog }) => {
  const [logData, setLogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLog = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The updated Apps Script will need a doGet function that returns JSON.
      const response = await fetch(GOOGLE_SHEET_WEB_APP_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        // Assume data returns array of objects like { serialNumber: "QD...", receiptDate: "2026-05-01" }
        // Reverse so newest is first
        setLogData(data.data.reverse());
      } else {
        throw new Error(data.message || 'Invalid data format from server');
      }
    } catch (err) {
      console.error("Error fetching log:", err);
      setError("FAILED TO LOAD LIVE LOG. PLEASE TRY AGAIN.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, []);

  return (
    <div className="log-container">
      <div className="log-header">
        <h3>LIVE LOG</h3>
        <button className="icon-btn" onClick={fetchLog} disabled={isLoading}>
          <RefreshCw size={20} className={isLoading ? "spin-icon" : ""} />
        </button>
      </div>

      <div className="log-content">
        {error && (
          <div className="error-message" style={{ position: 'relative', top: 0 }}>
            <AlertCircle size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {error}
          </div>
        )}

        {isLoading && !error && (
          <div className="loading-state">
            <Loader className="spin-icon" size={32} color="#8a9690" />
            <p>LOADING SHEET DATA...</p>
          </div>
        )}

        {!isLoading && !error && logData.length === 0 && (
          <div className="empty-state">
            <FileCheck size={48} color="#8a9690" />
            <p>NO RECORDS FOUND IN LOG.</p>
          </div>
        )}

        {!isLoading && !error && logData.length > 0 && (
          <div className="log-list">
            {logData.map((item, index) => {
              // Highlight if scanned in this session
              const isSession = sessionLog.includes(item.serialNumber);
              return (
                <div key={index} className={`log-item ${isSession ? 'session-highlight' : ''}`}>
                  <div className="log-item-header">
                    <span className="log-serial">{item.serialNumber}</span>
                    {isSession && <span className="session-badge">JUST ADDED</span>}
                  </div>
                  <div className="log-item-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="log-date">{item.receiptDate}</span>
                    {item.traxNumber && (
                      <span className="log-trax" style={{ fontSize: '0.85rem', color: '#00f2fe', fontWeight: '500' }}>
                        TRAX: {item.traxNumber}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogTab;
