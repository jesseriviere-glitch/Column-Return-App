import { useState } from 'react'
import Home from './components/Home'
import Scanner from './components/Scanner'
import Confirmation from './components/Confirmation'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'scanner', 'confirmation'
  const [scannedData, setScannedData] = useState(null)

  const handleScanStart = () => setCurrentScreen('scanner')
  
  const handleScanSuccess = (data) => {
    setScannedData(data)
    setCurrentScreen('confirmation')
  }

  const handleScanCancel = () => setCurrentScreen('home')

  const handleConfirmSuccess = () => {
    setScannedData(null)
    setCurrentScreen('home')
  }

  const handleConfirmCancel = () => setCurrentScreen('scanner')

  return (
    <div className="app-container">
      <main className="app-main">
        {currentScreen === 'home' && (
          <Home onStart={handleScanStart} />
        )}
        {currentScreen === 'scanner' && (
          <Scanner onSuccess={handleScanSuccess} onCancel={handleScanCancel} />
        )}
        {currentScreen === 'confirmation' && (
          <Confirmation 
            data={scannedData} 
            onSuccess={handleConfirmSuccess} 
            onCancel={handleConfirmCancel} 
          />
        )}
      </main>
    </div>
  )
}

export default App
