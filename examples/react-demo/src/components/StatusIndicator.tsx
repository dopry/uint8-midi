import React from 'react'

interface StatusIndicatorProps {
  isSupported: boolean
  isEnabled: boolean
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isSupported, isEnabled }) => {
  return (
    <div className="status-indicator">
      <div className="status-item">
        <span className={`status-dot ${isSupported ? 'supported' : 'not-supported'}`}></span>
        <span className="status-text">
          MIDI API {isSupported ? 'Supported' : 'Not Supported'}
        </span>
      </div>
      <div className="status-item">
        <span className={`status-dot ${isEnabled ? 'enabled' : 'disabled'}`}></span>
        <span className="status-text">
          MIDI Access {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </div>
  )
}

export { StatusIndicator }
