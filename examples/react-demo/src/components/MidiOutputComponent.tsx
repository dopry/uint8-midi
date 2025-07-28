import React, { useCallback, useState } from 'react'
import {
  buildNoteOn,
  buildNoteOff,
  buildControlChange,
  buildProgramChange,
  buildPitchBend,
  buildChannelAftertouch,
  buildPolyphonicAftertouch,
} from 'web-midi-utils'
import { MidiPortComponent } from './MidiPortComponent'

interface MidiOutputComponentProps {
  port: MIDIOutput
}

export const MidiOutputComponent: React.FC<MidiOutputComponentProps> = ({
  port,
}) => {
  const [channel, setChannel] = useState(1)
  const [note, setNote] = useState(60) // Middle C
  const [velocity, setVelocity] = useState(64)
  const [controller, setController] = useState(7) // Volume
  const [controlValue, setControlValue] = useState(64)
  const [program, setProgram] = useState(1)
  const [pitchBendValue, setPitchBendValue] = useState(8192) // Center
  const [pressure, setPressure] = useState(64)
  const [polyAftertouchNote, setPolyAftertouchNote] = useState(60) // Separate note for poly AT

  const handleSendMessage = useCallback(
    (message: Uint8Array) => {
      try {
        if (port.state === 'connected') {
          port.send(message)
        } else {
          console.warn('Cannot send message: device not connected')
        }
      } catch (error) {
        console.error('Error sending MIDI message:', error)
      }
    },
    [port]
  )

  // Helper function to get note name
  const getNoteName = (noteNumber: number) => {
    const noteNames = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ]
    const octave = Math.floor(noteNumber / 12) - 1
    const noteName = noteNames[noteNumber % 12]
    return `${noteName}${octave}`
  }

  // Helper function to generate note options
  const generateNoteOptions = () => {
    const options = []
    for (let i = 0; i <= 127; i++) {
      options.push(
        <option key={i} value={i}>
          {i} ({getNoteName(i)})
        </option>
      )
    }
    return options
  }

  // Helper function to generate program options
  const generateProgramOptions = () => {
    const options = []
    for (let i = 1; i <= 128; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      )
    }
    return options
  }

  const sendNoteOn = () => {
    const message = buildNoteOn(channel, note, velocity)
    handleSendMessage(message)
  }

  const sendNoteOff = () => {
    const message = buildNoteOff(channel, note, 0)
    handleSendMessage(message)
  }

  const sendControlChange = () => {
    const message = buildControlChange(channel, controller, controlValue)
    handleSendMessage(message)
  }

  const sendProgramChange = () => {
    const message = buildProgramChange(channel, program)
    handleSendMessage(message)
  }

  const sendPitchBend = () => {
    const message = buildPitchBend(channel, pitchBendValue)
    handleSendMessage(message)
  }

  const sendChannelAftertouch = () => {
    const message = buildChannelAftertouch(channel, pressure)
    handleSendMessage(message)
  }

  const sendPolyphonicAftertouch = () => {
    const message = buildPolyphonicAftertouch(
      channel,
      polyAftertouchNote,
      pressure
    )
    handleSendMessage(message)
  }

  return (
    <div className="device-card">
      <MidiPortComponent port={port} />

      <div className="device-output">
        <div className="midi-output-panel">
          <h3>Send MIDI Messages</h3>

          {/* Global Controls */}
          <div className="output-section">
            <h4>Global Settings</h4>
            <div className="control-group">
              <label>
                Channel:
                <select
                  value={channel}
                  onChange={(e) => setChannel(Number(e.target.value))}
                >
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Note Messages */}
          <div className="output-section">
            <h4>Note Messages</h4>
            <div className="control-group">
              <label>
                Note:
                <select
                  value={note}
                  onChange={(e) => setNote(Number(e.target.value))}
                >
                  {generateNoteOptions()}
                </select>
              </label>
              <label>
                Velocity:
                <input
                  type="range"
                  min="1"
                  max="127"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                />
                <span>{velocity}</span>
              </label>
            </div>
            <div className="button-group">
              <button onClick={sendNoteOn} className="send-btn note-on">
                Note On
              </button>
              <button onClick={sendNoteOff} className="send-btn note-off">
                Note Off
              </button>
            </div>
          </div>

          {/* Control Change */}
          <div className="output-section">
            <h4>Control Change</h4>
            <div className="control-group">
              <label>
                Controller:
                <select
                  value={controller}
                  onChange={(e) => setController(Number(e.target.value))}
                >
                  <option value={1}>Modulation (1)</option>
                  <option value={7}>Volume (7)</option>
                  <option value={10}>Pan (10)</option>
                  <option value={11}>Expression (11)</option>
                  <option value={64}>Sustain (64)</option>
                  <option value={91}>Reverb (91)</option>
                  <option value={93}>Chorus (93)</option>
                </select>
              </label>
              <label>
                Value:
                <input
                  type="range"
                  min="0"
                  max="127"
                  value={controlValue}
                  onChange={(e) => setControlValue(Number(e.target.value))}
                />
                <span>{controlValue}</span>
              </label>
            </div>
            <div className="button-group">
              <button
                onClick={sendControlChange}
                className="send-btn control-change"
              >
                Send CC
              </button>
            </div>
          </div>

          {/* Program Change */}
          <div className="output-section">
            <h4>Program Change</h4>
            <div className="control-group">
              <label>
                Program:
                <select
                  value={program}
                  onChange={(e) => setProgram(Number(e.target.value))}
                >
                  {generateProgramOptions()}
                </select>
              </label>
            </div>
            <div className="button-group">
              <button
                onClick={sendProgramChange}
                className="send-btn program-change"
              >
                Send PC
              </button>
            </div>
          </div>

          {/* Pitch Bend */}
          <div className="output-section">
            <h4>Pitch Bend</h4>
            <div className="control-group">
              <label>
                Value:
                <input
                  type="range"
                  min="0"
                  max="16383"
                  value={pitchBendValue}
                  onChange={(e) => setPitchBendValue(Number(e.target.value))}
                />
                <span>
                  {pitchBendValue} (
                  {pitchBendValue === 8192
                    ? 'Center'
                    : pitchBendValue > 8192
                      ? '+' + (pitchBendValue - 8192)
                      : '-' + (8192 - pitchBendValue)}
                  )
                </span>
              </label>
            </div>
            <div className="button-group">
              <button onClick={sendPitchBend} className="send-btn pitch-bend">
                Send Pitch Bend
              </button>
            </div>
          </div>

          {/* Aftertouch */}
          <div className="output-section">
            <h4>Aftertouch</h4>
            <div className="control-group">
              <label>
                Polyphonic Note:
                <select
                  value={polyAftertouchNote}
                  onChange={(e) =>
                    setPolyAftertouchNote(Number(e.target.value))
                  }
                >
                  {generateNoteOptions()}
                </select>
              </label>
              <label>
                Pressure:
                <input
                  type="range"
                  min="0"
                  max="127"
                  value={pressure}
                  onChange={(e) => setPressure(Number(e.target.value))}
                />
                <span>{pressure}</span>
              </label>
            </div>
            <div className="button-group">
              <button
                onClick={sendChannelAftertouch}
                className="send-btn channel-aftertouch"
              >
                Channel AT
              </button>
              <button
                onClick={sendPolyphonicAftertouch}
                className="send-btn polyphonic-aftertouch"
              >
                Poly AT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
