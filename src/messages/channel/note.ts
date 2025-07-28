import { ChannelMessage, channelMessageTypeMask } from '../type'
import { channelNibble, uint8Mask } from '../utility'

export const noteoff = 0x80 as const
export const noteon = 0x90 as const

export type NoteOn = ChannelMessage & {
  readonly __noteOn: unique symbol
}
export type NoteOff = ChannelMessage & {
  readonly __noteOff: unique symbol
}

function buildNote(
  type: number,
  channel: number,
  note: number,
  velocity: number,
  octaveOffset = 0
): NoteOff | NoteOn {
  return Uint8Array.from([
    (type & channelMessageTypeMask) | channelNibble(channel),
    (note + octaveOffset * 12) & uint8Mask,
    velocity & uint8Mask,
  ]) as NoteOff | NoteOn
}

export function buildNoteOff(
  channel: number,
  note: number,
  velocity: number,
  octaveOffset = 0
): NoteOff {
  return buildNote(noteoff, channel, note, velocity, octaveOffset) as NoteOff
}

export function buildNoteOn(
  channel: number,
  note: number,
  velocity: number,
  octaveOffset = 0
): NoteOn {
  return buildNote(noteon, channel, note, velocity, octaveOffset) as NoteOn
}

export function getNoteNumber(
  message: NoteOn | NoteOff,
  octaveOffset = 0
): number {
  return (message[1] & uint8Mask) - octaveOffset * 12
}
export function getNoteVelocity(message: NoteOn | NoteOff): number {
  return message[2] & uint8Mask
}

export function isNoteOff(message: Uint8Array): message is NoteOff {
  return (
    (message[0] & channelMessageTypeMask) === noteoff ||
    // noteon with a velocity of 0 is considered a note off
    ((message[0] & channelMessageTypeMask) === noteon && message[2] === 0)
  )
}

export function isNoteOn(message: Uint8Array): message is NoteOn {
  // noteon with a velocity of 0 is considered a note off
  return (message[0] & channelMessageTypeMask) === noteon && message[2] !== 0
}
