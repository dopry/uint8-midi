import React from 'react'

interface MIDIMessageInfo {
  type: string
  description: string
}

interface MIDIMessage {
  data: Uint8Array
  parsed: MIDIMessageInfo
  timestamp: number
}

interface MidiMessageProps {
  message: MIDIMessage
  showTimestamp?: boolean
  compact?: boolean
  className?: string
}

const MidiMessage: React.FC<MidiMessageProps> = ({ 
  message, 
  showTimestamp = true, 
  compact = false,
  className = ''
}) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString() + '.' + String(date.getMilliseconds()).padStart(3, '0')
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'note on':
        return 'note-on'
      case 'note off':
        return 'note-off'
      case 'control change':
        return 'control-change'
      case 'program change':
        return 'program-change'
      case 'pitch bend':
        return 'pitch-bend'
      case 'channel aftertouch':
        return 'channel-aftertouch'
      case 'polyphonic aftertouch':
        return 'polyphonic-aftertouch'
      case 'start':
      case 'stop':
      case 'continue':
        return 'transport'
      case 'system message':
        return 'system'
      default:
        return 'unknown'
    }
  }

  const formatBytes = (data: Uint8Array) => {
    return Array.from(data)
      .map(byte => `0x${byte.toString(16).padStart(2, '0').toUpperCase()}`)
      .join(' ')
  }

  if (compact) {
    return (
      <div className={`midi-message compact ${className}`}>
        <span className={`message-type ${getTypeColor(message.parsed.type)}`}>
          {message.parsed.type}
        </span>
        <span className="message-description">
          {message.parsed.description}
        </span>
        {showTimestamp && (
          <span className="message-timestamp">
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`midi-message ${className}`}>
      {showTimestamp && (
        <div className="message-header">
          <span className="message-timestamp">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      )}
      <div className="message-content">
        <div className={`message-type ${getTypeColor(message.parsed.type)}`}>
          {message.parsed.type}
        </div>
        <div className="message-description">
          {message.parsed.description}
        </div>
        <div className="message-data">
          <span className="data-label">Raw:</span>
          <span className="data-bytes">{formatBytes(message.data)}</span>
          <span className="data-decimal">[{Array.from(message.data).join(', ')}]</span>
        </div>
      </div>
    </div>
  )
}

export { MidiMessage }
