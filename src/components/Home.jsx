import React from 'react';
import { Plus } from 'lucide-react';
import logo from '../assets/logo.png';

const Home = ({ onStart }) => {
  return (
    <div className="home-container">
      <img src={logo} alt="Metafix Logo" className="home-logo" />
      <div className="home-content">
        <h2 className="home-title">
          <span className="title-light">COLUMN</span>
          <span className="title-bold">RETURNS</span>
        </h2>
        
        <div className="button-ring">
          <button className="scan-btn-neumorphic" onClick={onStart}>
            <Plus size={56} color="white" strokeWidth={2.5} />
          </button>
        </div>
        <p className="scan-hint">TAP TO SCAN</p>
      </div>
    </div>
  );
};

export default Home;
