import { useCallback, useEffect, useState } from 'react'
import './App.css'
import {
  MidiInputComponent,
  MidiOutputComponent,
  StatusIndicator,
} from './components'

function App() {
  const [midiAccess, setMidiAccess] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [inputs, setInputs] = useState<MIDIInput[]>([])
  const [outputs, setOutputs] = useState<MIDIOutput[]>([])

  const updateDeviceStates = useCallback((access: any) => {
    const newInputs = Array.from(access.inputs.values()) as MIDIInput[]
    const newOutputs = Array.from(access.outputs.values()) as MIDIOutput[]
    setInputs(newInputs)
    setOutputs(newOutputs)
  }, [])

  const setupMIDIHandlers = useCallback(
    (access: any) => {
      // Handle state changes (device connect/disconnect)
      access.onstatechange = (event: any) => {
        console.log('Device state change:', event.port.name, event.port.state)
        updateDeviceStates(access)
      }

      // Initialize device states
      updateDeviceStates(access)
    },
    [updateDeviceStates]
  )

  const requestMIDIAccess = async () => {
    try {
      if (navigator.requestMIDIAccess) {
        const access = await navigator.requestMIDIAccess()
        setMidiAccess(access)
        setIsConnected(true)
        setupMIDIHandlers(access)
        console.log('MIDI access granted')
      } else {
        console.error('Web MIDI API not supported')
      }
    } catch (error) {
      console.error(
        'MIDI Access Error:',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  useEffect(() => {
    // This will run once when component mounts to check MIDI support
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Web Midi Utils Demo</h1>
        <p>
          Connect and interact with MIDI devices in your browser using the{' '}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API">
            Web MIDI API
          </a>{' '}
          +<a href="https://github.com/dopry/web-midi-utils">Web Midi Utils</a>
        </p>
      </header>

      <StatusIndicator
        isSupported={!!navigator.requestMIDIAccess}
        isEnabled={isConnected}
      />

      <section className="midi-access">
        <button onClick={requestMIDIAccess} className="connect-btn">
          Request MIDI Access
        </button>
      </section>

      <section className="devices">
        <h2>MIDI Devices</h2>
        <div className="device-list">
          {!midiAccess ? (
            <div className="no-devices">
              <p>No MIDI access. Click "Request MIDI Access" to connect.</p>
            </div>
          ) : inputs.length === 0 && outputs.length === 0 ? (
            <div className="no-devices">
              <p>
                No MIDI devices detected. Connect a MIDI device and try again.
              </p>
            </div>
          ) : (
            <>
              {inputs.map((input: any) => (
                <MidiInputComponent key={input.id} port={input} />
              ))}
              {outputs.map((output: any) => (
                <MidiOutputComponent key={output.id} port={output} />
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
