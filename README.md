# web-midi-utils

**1.x release series will be unstable and will have breaking changes. Upon 2.x the projects will begin following semantic versioning**

A lightweight TypeScript library for creating and parsing MIDI messages using Uint8Array. It is designed to work with the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) in the browser. It has been designed with performance in mind by:

1.  Minimizing any type conversion or copying of the Uint8Array provided by the native layer.
2.  Using bitwise logic to ensure fast evaluation of MIDI messages.

**[Demo](https://dopry.github.io/web-midi-utils/)**

## Requirements

- Node.js 18+ (maintenance and active LTS versions only)

## Installation

```bash
npm install web-midi-utils
```

## Features

- 🎵 Create MIDI messages (Note On/Off, Control Change, Program Change)
- 🔍 Parse and identify MIDI message types
- 🚀 Lightweight and fast - uses native Uint8Array
- 📝 Full TypeScript support with type guards
- 🎯 Zero dependencies
- ⚡ Real-time performance optimized

## Usage

### Creating MIDI Messages

```typescript
import {
  buildNoteOn,
  buildNoteOff,
  buildControlChange,
  buildProgramChange,
  buildPitchBend,
  buildChannelAftertouch,
  buildPolyphonicAftertouch,
} from 'web-midi-utils'

// Create a Note On message (channel 1, note 60, velocity 127)
const noteOn = buildNoteOn(1, 60, 127)
console.log(noteOn) // Uint8Array(3) [144, 60, 127]

// Create a Note Off message
const noteOff = buildNoteOff(1, 60, 0)
console.log(noteOff) // Uint8Array(3) [128, 60, 0]

// Create a Control Change message (channel 1, controller 7, value 100)
const cc = buildControlChange(1, 7, 100)
console.log(cc) // Uint8Array(3) [176, 7, 100]

// Create a Program Change message (channel 1, program 42)
const pc = buildProgramChange(1, 42)
console.log(pc) // Uint8Array(2) [192, 42]

// Create a Pitch Bend message (channel 1, value 8192 = center)
const pb = buildPitchBend(1, 8192)
console.log(pb) // Uint8Array(3) [224, 0, 64]

// Create Channel Aftertouch (channel 1, pressure 100)
const cat = buildChannelAftertouch(1, 100)
console.log(cat) // Uint8Array(2) [208, 100]

// Create Polyphonic Aftertouch (channel 1, note 60, pressure 100)
const pat = buildPolyphonicAftertouch(1, 60, 100)
console.log(pat) // Uint8Array(3) [160, 60, 100]
```

### Parsing MIDI Messages

```typescript
import {
  isNoteOn,
  isNoteOff,
  isControlChange,
  isProgramChange,
  isPitchBend,
  isChannelAftertouch,
  isPolyphonicAftertouch,
  isSystemMessage,
  isChannelMessage,
  isStart,
  isStop,
  isContinue,
  getChannel,
  getPolyphonicAftertouchNote,
  getPolyphonicAftertouchPressure,
  getChannelAftertouchPressure,
} from 'web-midi-utils'

const midiData = new Uint8Array([144, 60, 127]) // Note On

// Type checking
if (isNoteOn(midiData)) {
  console.log('This is a Note On message')
  console.log(`Channel: ${getChannel(midiData)}`) // Channel: 1
}

if (isChannelMessage(midiData)) {
  console.log('This is a channel voice message')
}

// System message checking
const startMessage = new Uint8Array([250])
if (isStart(startMessage)) {
  console.log('MIDI Start message received')
}

// Data extraction from Polyphonic Aftertouch
const polyAftertouch = new Uint8Array([160, 60, 100])
if (isPolyphonicAftertouch(polyAftertouch)) {
  const note = getPolyphonicAftertouchNote(polyAftertouch)
  const pressure = getPolyphonicAftertouchPressure(polyAftertouch)
  console.log(`Polyphonic Aftertouch: Note ${note}, Pressure ${pressure}`)
}

// Data extraction from Channel Aftertouch
const channelAftertouch = new Uint8Array([208, 100])
if (isChannelAftertouch(channelAftertouch)) {
  const pressure = getChannelAftertouchPressure(channelAftertouch)
  console.log(`Channel Aftertouch: Pressure ${pressure}`)
}
```

### Type Guards

The library provides type guards for safe message handling:

```typescript
import {
  isChannelMessage,
  isSystemMessage,
  isStart,
  isStop,
  getChannel,
} from 'web-midi-utils'

function handleMIDIMessage(message: Uint8Array) {
  if (isChannelMessage(message)) {
    // Handle channel messages (Note On/Off, CC, etc.)
    const channel = getChannel(message)
    console.log(`Channel message on channel ${channel}`)
  } else if (isSystemMessage(message)) {
    // Handle system messages (Start, Stop, Continue, etc.)
    if (isStart(message)) {
      console.log('MIDI Start received')
    } else if (isStop(message)) {
      console.log('MIDI Stop received')
    }
  }
}
```

## Examples

### Basic MIDI Message Handling

```typescript
import {
  buildNoteOn,
  isNoteOn,
  getChannel,
  isPolyphonicAftertouch,
  getPolyphonicAftertouchNote,
  getPolyphonicAftertouchPressure,
} from 'web-midi-utils'

// Send a message
const noteOnMessage = buildNoteOn(1, 60, 127)
midiOutput.send(noteOnMessage)

// Parse received messages
function onMIDIMessage(event: WebMidi.MIDIMessageEvent) {
  const data = new Uint8Array(event.data)

  if (isNoteOn(data)) {
    console.log(`Note On: Channel ${getChannel(data)}`)
  } else if (isPolyphonicAftertouch(data)) {
    const note = getPolyphonicAftertouchNote(data)
    const pressure = getPolyphonicAftertouchPressure(data)
    console.log(`Poly Aftertouch: Note ${note}, Pressure ${pressure}`)
  }
}
```

### Live Demo,

Check out the [Live demo](https://dopry.github.io/web-midi-utils/) to see web-midi-utils in action with live MIDI device detection and message parsing. The demo includes:

- **[`<MidiInputComponent.ParseMIDIMessage>`](examples/react-demo/src/components/MidiInputComponent.tsx#L43)** - demonstrates parsing incomming midi messages
- **[`<MidiOutputComponent.send*>`](examples/react-demo/src/components/MidiOutputComponent.tsx#L92)** - Shows MIDI output devices with controls to send various MIDI messages

**Features Demonstrated**

- **Message Parsing**: Real-time parsing and display of all MIDI message types
- **Message Building**: Creating various MIDI messages to output devices
- **Type Safety**: Full TypeScript integration with proper type guards

You can check out the source code in [examples/react-demo](examples/react-demo)

## API Reference

### Message Builders

| Function                                             | Description                          | Parameters                                     | Returns      |
| ---------------------------------------------------- | ------------------------------------ | ---------------------------------------------- | ------------ |
| `buildNoteOn(channel, note, velocity)`               | Create Note On message               | channel: 1-16, note: 0-127, velocity: 0-127    | `Uint8Array` |
| `buildNoteOff(channel, note, velocity)`              | Create Note Off message              | channel: 1-16, note: 0-127, velocity: 0-127    | `Uint8Array` |
| `buildControlChange(channel, controller, value)`     | Create Control Change message        | channel: 1-16, controller: 0-127, value: 0-127 | `Uint8Array` |
| `buildProgramChange(channel, program)`               | Create Program Change message        | channel: 1-16, program: 0-127                  | `Uint8Array` |
| `buildPitchBend(channel, value)`                     | Create Pitch Bend message            | channel: 1-16, value: 0-16383                  | `Uint8Array` |
| `buildChannelAftertouch(channel, pressure)`          | Create Channel Aftertouch message    | channel: 1-16, pressure: 0-127                 | `Uint8Array` |
| `buildPolyphonicAftertouch(channel, note, pressure)` | Create Polyphonic Aftertouch message | channel: 1-16, note: 0-127, pressure: 0-127    | `Uint8Array` |

### Type Guards

| Function                       | Description                                 | Parameters         | Returns                        |
| ------------------------------ | ------------------------------------------- | ------------------ | ------------------------------ |
| `isNoteOn(data)`               | Check if message is Note On                 | data: `Uint8Array` | `data is NoteOn`               |
| `isNoteOff(data)`              | Check if message is Note Off                | data: `Uint8Array` | `data is NoteOff`              |
| `isControlChange(data)`        | Check if message is Control Change          | data: `Uint8Array` | `data is ControlChange`        |
| `isProgramChange(data)`        | Check if message is Program Change          | data: `Uint8Array` | `data is ProgramChange`        |
| `isPitchBend(data)`            | Check if message is Pitch Bend              | data: `Uint8Array` | `data is PitchBend`            |
| `isChannelAftertouch(data)`    | Check if message is Channel Aftertouch      | data: `Uint8Array` | `data is ChannelAftertouch`    |
| `isPolyphonicAftertouch(data)` | Check if message is Polyphonic Aftertouch   | data: `Uint8Array` | `data is PolyphonicAftertouch` |
| `isChannelMessage(data)`       | Check if message is a channel voice message | data: `Uint8Array` | `data is ChannelMessage`       |
| `isSystemMessage(data)`        | Check if message is a system message        | data: `Uint8Array` | `data is SystemMessage`        |
| `isStart(data)`                | Check if message is MIDI Start              | data: `Uint8Array` | `data is Start`                |
| `isStop(data)`                 | Check if message is MIDI Stop               | data: `Uint8Array` | `data is Stop`                 |
| `isContinue(data)`             | Check if message is MIDI Continue           | data: `Uint8Array` | `data is Continue`             |

### Data Extraction

| Function                                | Description                                 | Parameters                   | Returns          |
| --------------------------------------- | ------------------------------------------- | ---------------------------- | ---------------- |
| `getChannel(data)`                      | Extract channel number from channel message | data: `Uint8Array`           | `number` (1-16)  |
| `getChannelAftertouchPressure(data)`    | Extract pressure from Channel Aftertouch    | data: `ChannelAftertouch`    | `number` (0-127) |
| `getControlChangeController(data)`      | Extract control from Control Change         | data: `ControlChange`        | `number` (0-127) |
| `getControlChangeValue(data)`           | Extract control from Control Change         | data: `ControlChange`        | `number` (0-127) |
| `getNoteNumber(data)`                   | Extract node from NoteOn or NoteOff         | data: `NoteOn \| NoteOff`    | `number` (0-127) |
| `getNoteVelocity(data)`                 | Extract node from NoteOn or NoteOff         | data: `NoteOn \| NoteOff`    | `number` (0-127) |
| `getPolyphonicAftertouchNote(data)`     | Extract note from Polyphonic Aftertouch     | data: `PolyphonicAftertouch` | `number` (0-127) |
| `getPolyphonicAftertouchPressure(data)` | Extract pressure from Polyphonic Aftertouch | data: `PolyphonicAftertouch` | `number` (0-127) |

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, guidelines, and release process.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
