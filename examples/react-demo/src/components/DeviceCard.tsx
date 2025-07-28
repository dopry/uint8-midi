import React from 'react'
import { MidiInputDevice } from './MidiInputDevice'
import { MidiOutputDevice } from './MidiOutputDevice'

export interface DeviceCardProps {
  port: MIDIInput | MIDIOutput
}

export const MidiPort: React.FC<DeviceCardProps> = ({ port }) => {
  return (
    <>
      {port.type === 'input' ? (
        <MidiInputDevice device={port as MIDIInput} />
      ) : (
        <MidiOutputDevice device={port as MIDIOutput} />
      )}
    </>
  )
}