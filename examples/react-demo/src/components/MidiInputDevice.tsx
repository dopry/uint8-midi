import React, { useState, useEffect, useCallback } from 'react'
import { MidiMessage } from './MidiMessage'
import { MidiPort } from './DeviceInfo'
import {
  isNoteOn,
  isNoteOff,
  isControlChange,
  isProgramChange,
  isPitchBend,
  isChannelAftertouch,
  isPolyphonicAftertouch,
  isStart,
  isStop,
  isContinue,
  isChannelMessage,
  getChannel,
  getPolyphonicAftertouchNote,
  getPolyphonicAftertouchPressure,
  getChannelAftertouchPressure,
  isSystemMessage
} from 'web-midi-utils'

interface MIDIMessageInfo {
  type: string
  description: string
}

interface MessageData {
  data: Uint8Array
  parsed: MIDIMessageInfo
  timestamp: number
}

interface MidiInputDeviceProps {
  device: MIDIInput
}

export const MidiInputDevice: React.FC<MidiInputDeviceProps> = ({ device }) => {
  const [messageHistory, setMessageHistory] = useState<MessageData[]>([])

  const parseMIDIMessage = useCallback((data: Uint8Array): MIDIMessageInfo => {
    let type = 'Unknown'
    let description = ''
    
    if (isChannelMessage(data)) {
      const channel = getChannel(data)
      
      if (isNoteOn(data)) {
        type = 'Note On'
        description = `Channel ${channel}, Note ${data[1]}, Velocity ${data[2]}`
      } else if (isNoteOff(data)) {
        type = 'Note Off'
        description = `Channel ${channel}, Note ${data[1]}, Velocity ${data[2]}`
      } else if (isControlChange(data)) {
        type = 'Control Change'
        description = `Channel ${channel}, CC ${data[1]}, Value ${data[2]}`
      } else if (isProgramChange(data)) {
        type = 'Program Change'
        description = `Channel ${channel}, Program ${data[1]}`
      } else if (isPitchBend(data)) {
        type = 'Pitch Bend'
        const value = (data[2] << 7) | data[1]
        description = `Channel ${channel}, Value ${value}`
      } else if (isChannelAftertouch(data)) {
        type = 'Channel Aftertouch'
        const pressure = getChannelAftertouchPressure(data)
        description = `Channel ${channel}, Pressure ${pressure}`
      } else if (isPolyphonicAftertouch(data)) {
        type = 'Polyphonic Aftertouch'
        const note = getPolyphonicAftertouchNote(data)
        const pressure = getPolyphonicAftertouchPressure(data)
        description = `Channel ${channel}, Note ${note}, Pressure ${pressure}`
      }
    } else if (isSystemMessage(data)) {
      if (isStart(data)) {
        type = 'System Start'
        description = 'Real-time Start message'
      } else if (isStop(data)) {
        type = 'System Stop'
        description = 'Real-time Stop message'
      } else if (isContinue(data)) {
        type = 'System Continue'
        description = 'Real-time Continue message'
      } else {
        type = 'System Message'
        description = `Status: 0x${data[0]?.toString(16).toUpperCase()}`
      }
    } else {
       console.warn("Unsupported MIDI message received, this should be an impossible condition as isSystemMessage is checked and isChannelMessage are inverse checks")
       type = 'Unsupported Message'
       if (data.length > 0) {
         description = `Status: 0x${data[0]?.toString(16).toUpperCase()}`
       }
    }
    return { type, description }
  }, [])

  const handleMIDIMessage = useCallback((event: any) => {
    const messageData: MessageData = {
      data: new Uint8Array(event.data),
      parsed: parseMIDIMessage(new Uint8Array(event.data)),
      timestamp: event.timeStamp
    }

    setMessageHistory(prev => [...prev, messageData])
  }, [parseMIDIMessage])

  useEffect(() => {
    if (device.state === 'connected') {
      device.addEventListener('midimessage', handleMIDIMessage)
      return () => {
        device.removeEventListener('midimessage', handleMIDIMessage)
      }
    }
  }, [device, handleMIDIMessage])

  const recentMessages = messageHistory.slice(-5) // Show last 5 messages

  return (
    <div className="device-card">
      <MidiPort port={device} />
      
      <div className="device-messages">
        <div className="message-title">
          Recent Messages ({messageHistory.length} total)
        </div>
        {recentMessages.length > 0 ? (
          <div className="device-message-list">
            {recentMessages.map((message, index) => (
              <MidiMessage
                key={`${message.timestamp}-${index}`}
                message={message}
                compact={true}
                showTimestamp={true}
                className="device-message-item"
              />
            ))}
          </div>
        ) : (
          <div className="no-message">No messages received yet</div>
        )}
      </div>
    </div>
  )
}
