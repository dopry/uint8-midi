import React from 'react'

interface MidiPortComponentProps {
  port: MIDIPort
}

export const MidiPortComponent: React.FC<MidiPortComponentProps> = ({
  port,
}) => {
  const handleTogglePort = async () => {
    try {
      if (port.connection === 'open') {
        await port.close()
      } else {
        await port.open()
      }
    } catch (error) {
      console.error('Error toggling device port:', error)
    }
  }

  return (
    <>
      <div className="device-header">
        <div className="device-name">{port.name || 'Unknown Device'}</div>
        <div className="device-type">{port.type}</div>
      </div>
      <div className="device-info">
        <div className="device-details">
          <strong>Manufacturer:</strong> {port.manufacturer || 'Unknown'}
          <br />
          <strong>State:</strong> {port.state}
          <br />
          <strong>Connection:</strong> {port.connection}
        </div>
        <div className="device-controls">
          <button
            onClick={handleTogglePort}
            className={`port-toggle-btn ${port.connection === 'open' ? 'connected' : 'disconnected'}`}
            disabled={port.connection === 'pending'}
          >
            {port.connection === 'open'
              ? 'Close Port'
              : port.connection === 'closed'
                ? 'Open Port'
                : 'Pending...'}
          </button>
        </div>
      </div>
    </>
  )
}
