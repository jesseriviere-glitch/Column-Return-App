import { useState } from 'react'
import { FileText, ScanLine } from 'lucide-react'
import Home from './components/Home'
import Scanner from './components/Scanner'
import Confirmation from './components/Confirmation'
import LogTab from './components/LogTab'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'scanner', 'confirmation', 'log'
  const [scannedData, setScannedData] = useState(null)
  const [sessionLog, setSessionLog] = useState([])

  const handleScanStart = () => setCurrentScreen('scanner')
  
  const handleScanSuccess = (data) => {
    setScannedData(data)
    setCurrentScreen('confirmation')
  }

  const handleScanCancel = () => setCurrentScreen('home')

  const handleConfirmSuccess = () => {
    setSessionLog(prev => [...prev, scannedData])
    setScannedData(null)
    setCurrentScreen('home')
  }

  const handleConfirmCancel = () => setCurrentScreen('scanner')

  const isMainNav = currentScreen === 'home' || currentScreen === 'log';

  return (
    <div className="app-container">
      <main className="app-main">
        {currentScreen === 'home' && (
          <Home onStart={handleScanStart} />
        )}
        {currentScreen === 'log' && (
          <LogTab sessionLog={sessionLog} />
        )}
        {currentScreen === 'scanner' && (
          <Scanner 
            onSuccess={handleScanSuccess} 
            onCancel={handleScanCancel} 
            sessionLog={sessionLog}
          />
        )}
        {currentScreen === 'confirmation' && (
          <Confirmation 
            data={scannedData} 
            onSuccess={handleConfirmSuccess} 
            onCancel={handleConfirmCancel} 
          />
        )}
      </main>

      {isMainNav && (
        <nav className="bottom-nav">
          <button 
            className={`nav-btn ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('home')}
          >
            <ScanLine size={24} />
            <span>SCAN</span>
          </button>
          <button 
            className={`nav-btn ${currentScreen === 'log' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('log')}
          >
            <FileText size={24} />
            <span>LOG</span>
          </button>
        </nav>
      )}
    </div>
  )
}

export default App
