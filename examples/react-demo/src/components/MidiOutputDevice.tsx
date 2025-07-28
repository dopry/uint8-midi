import React, { useCallback } from 'react'
import { MidiOutputPanel } from './MidiOutputPanel'
import { MidiPort } from './DeviceInfo'

interface MidiOutputDeviceProps {
  device: MIDIOutput
}

export const MidiOutputDevice: React.FC<MidiOutputDeviceProps> = ({ device }) => {
  const handleSendMessage = useCallback((message: Uint8Array) => {
    try {
      if (device.state === 'connected') {
        device.send(message)
      } else {
        console.warn('Cannot send message: device not connected')
      }
    } catch (error) {
      console.error('Error sending MIDI message:', error)
    }
  }, [device])

  return (
    <div className="device-card">
      <MidiPort port={device}  />
      
      <div className="device-output">
        <MidiOutputPanel onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
