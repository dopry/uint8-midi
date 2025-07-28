const uint8Mask = 0xff as const

// MIDI data message masks
const midiDataMessageChannelMask = 0x0f as const
const midiDataMessageTypeMask = 0xf0 as const
const noteoff = 0x80 as const
const noteon = 0x90 as const
const controlchange = 0xb0 as const
const programchange = 0xc0 as const

// midi system messages masks
// const sysexStart = 0xf0 as const
// const quarterFrame = 0xf1 as const
// const songPointer = 0xf2 as const
// const songSelect = 0xf3 as const
// const tuneRequest = 0xf6 as const
// const sysexEnd = 0xf7 as const
// const timingClock = 0xf8 as const
// const measureEnd = 0xf9 as const
const start = 0xfa as const
const cont = 0xfb as const // continue
const stop = 0xfc as const
// const undef = 0xfd as const // undefined, reserved for future use, ignore.
// const activeSensing = 0xfe as const
// const reset = 0xff as const

export type MIDIMessage = Uint8Array
export type SystemMessage = MIDIMessage
export type DataMessage = MIDIMessage
export type NoteOn = DataMessage
export type NoteOff = DataMessage
export type ControlChange = DataMessage
export type ProgramChange = DataMessage
export type Start = SystemMessage
export type Continue = SystemMessage
export type Stop = SystemMessage

// convert MIDI channel (1-16) to nibble (0-15)
export function channelNibble(channel: number): number {
  return (midiDataMessageChannelMask & (channel - 1)) as number
}

export function isSystemMessage(message: Uint8Array): message is SystemMessage {
  return (message[0] & 0xf0) === 0xf0
}

export function isDataMessage(message: Uint8Array): message is DataMessage {
  return (message[0] & 0xf0) !== 0xf0
}

export function buildControlChange(
  channel: number,
  controller: number,
  value: number
): ControlChange {
  return Uint8Array.from([
    controlchange | channelNibble(channel),
    controller & uint8Mask,
    value & uint8Mask,
  ])
}

export function buildNoteOff(
  channel: number,
  note: number,
  velocity: number,
  octaveOffset = 0
): NoteOff {
  return Uint8Array.from([
    noteoff | channelNibble(channel),
    (note + octaveOffset * 12) & uint8Mask,
    velocity & uint8Mask,
  ])
}

export function buildNoteOn(
  channel: number,
  note: number,
  velocity: number,
  octaveOffset = 0
): NoteOn {
  return Uint8Array.from([
    noteon | channelNibble(channel),
    (note + octaveOffset * 12) & uint8Mask,
    velocity & uint8Mask,
  ])
}

export function buildProgramChange(
  channel: number,
  program: number
): ProgramChange {
  return Uint8Array.from([
    programchange | channelNibble(channel),
    program & uint8Mask,
  ])
}

export function getChannel(message: Uint8Array): number {
  return (message[0] & midiDataMessageChannelMask) + 1
}

export function isNoteOn(message: Uint8Array): message is NoteOn {
  // noteon with a velocity of 0 is considered a note off
  return (message[0] & midiDataMessageTypeMask) === noteon && message[2] !== 0
}

export function isNoteOff(message: Uint8Array): message is NoteOff {
  return (
    (message[0] & midiDataMessageTypeMask) === noteoff ||
    // noteon with a velocity of 0 is considered a note off
    ((message[0] & midiDataMessageTypeMask) === noteon && message[2] === 0)
  )
}
export function isControlChange(message: Uint8Array): message is ControlChange {
  return (message[0] & midiDataMessageTypeMask) === controlchange
}
export function isProgramChange(message: Uint8Array): message is ProgramChange {
  return (message[0] & midiDataMessageTypeMask) === programchange
}
export function isStart(message: Uint8Array): message is Start {
  return (message[0] & uint8Mask) === start
}
export function isStop(message: Uint8Array): message is Stop {
  return (message[0] & uint8Mask) === stop
}
export function isContinue(message: Uint8Array): message is Continue {
  return (message[0] & uint8Mask) === cont
}
