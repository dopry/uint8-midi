# React Demo Components

This directory contains the React components for the web-midi-utils demo application.

## Component Architecture

The components follow a clean separation of concerns pattern:

### Core Device Components

- **`DeviceCard`** - Main container component that delegates to specialized components
- **`DeviceHeader`** - Displays common device information (name, manufacturer, state, connection)
- **`MidiInputDevice`** - Specialized component for handling MIDI input devices (message display)
- **`MidiOutputDevice`** - Specialized component for handling MIDI output devices (message sending)

### MIDI Functionality Components

- **`MidiMessage`** - Displays individual MIDI messages with color coding and formatting
- **`MidiOutputPanel`** - Complete UI for sending MIDI messages with controls for all message types
- **`StatusIndicator`** - Shows MIDI API support and connection status

## Design Principles

1. **Single Responsibility** - Each component has a focused, single purpose
2. **Delegation Pattern** - DeviceCard delegates to specialized components based on device type
3. **Type Safety** - Full TypeScript support with proper typing
4. **Reusability** - Components can be used independently in other projects
5. **Clean Imports** - Centralized exports through index.ts

## Usage

```tsx
import { DeviceCard, MidiMessage, StatusIndicator } from './components'

// For input devices
<DeviceCard
  device={inputDevice}
  type="Input"
  deviceInfo={deviceData}
/>

// For output devices
<DeviceCard
  device={outputDevice}
  type="Output"
  onSendMessage={(message) => outputDevice.send(message)}
/>
```

## Message Types Supported

- Note On/Off (0x80-0x9F)
- Control Change (0xB0-0xBF)
- Program Change (0xC0-0xCF)
- Pitch Bend (0xE0-0xEF)
- Channel Aftertouch (0xD0-0xDF)
- Polyphonic Aftertouch (0xA0-0xAF)
- System Messages (0xFA, 0xFB, 0xFC - Start, Continue, Stop)
