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
import { buildNoteOn, buildNoteOff, buildControlChange } from 'web-midi-utils'

// Create a Note On message (channel 1, note 60, velocity 127)
const noteOn = buildNoteOn(1, 60, 127)
console.log(noteOn) // Uint8Array(3) [144, 60, 127]

// Create a Note Off message
const noteOff = buildNoteOff(1, 60, 0)
console.log(noteOff) // Uint8Array(3) [128, 60, 0]

// Create a Control Change message (channel 1, controller 7, value 100)
const cc = buildControlChange(1, 7, 100)
console.log(cc) // Uint8Array(3) [176, 7, 100]
```

### Parsing MIDI Messages

```typescript
import {
  isNoteOn,
  isNoteOff,
  isControlChange,
  getChannel,
} from 'web-midi-utils'

const message = new Uint8Array([144, 60, 127])

if (isNoteOn(message)) {
  console.log('Note On detected!')
  console.log('Channel:', getChannel(message)) // 1
  console.log('Note:', message[1]) // 60
  console.log('Velocity:', message[2]) // 127
}
```

### Type Guards

The library provides type guards for safe message handling:

```typescript
import {
  isDataMessage,
  isSystemMessage,
  isStart,
  isStop,
  getChannel,
} from 'web-midi-utils'

function handleMIDIMessage(message: Uint8Array) {
  if (isDataMessage(message)) {
    // Handle channel messages (Note On/Off, CC, etc.)
    const channel = getChannel(message)
    // ...
  } else if (isSystemMessage(message)) {
    // Handle system messages (Start, Stop, Continue, etc.)
    if (isStart(message)) {
      console.log('MIDI Start received')
    }
  }
}
```

## API Reference

### Message Builders

- `buildNoteOn(channel, note, velocity, octaveOffset?)` - Create Note On message
- `buildNoteOff(channel, note, velocity, octaveOffset?)` - Create Note Off message
- `buildControlChange(channel, controller, value)` - Create Control Change message
- `buildProgramChange(channel, program)` - Create Program Change message

### Message Parsers

- `isNoteOn(message)` - Check if message is Note On
- `isNoteOff(message)` - Check if message is Note Off (includes Note On with velocity 0)
- `isControlChange(message)` - Check if message is Control Change
- `isProgramChange(message)` - Check if message is Program Change
- `isStart(message)` - Check if message is MIDI Start
- `isStop(message)` - Check if message is MIDI Stop
- `isContinue(message)` - Check if message is MIDI Continue

### Utilities

- `getChannel(message)` - Get MIDI channel (1-16) from message
- `channelNibble(channel)` - Convert MIDI channel to nibble (0-15)
- `isDataMessage(message)` - Check if message is a channel/data message
- `isSystemMessage(message)` - Check if message is a system message

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, guidelines, and release process.

## Demo

Check out the [browser demo](examples/browser-demo/) to see web-midi-utils in action with live MIDI device detection and message parsing.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
