import { ChannelMessage, channelMessageTypeMask } from '../type'
import { channelNibble } from '../utility'

export const pitchbend = 0xe0 as const

export type PitchBend = ChannelMessage & {
  readonly __pitchBend: unique symbol
}

export function buildPitchBend(channel: number, value: number): PitchBend {
  return Uint8Array.from([
    pitchbend | channelNibble(channel),
    value & 0x7f,
    (value >> 7) & 0x7f,
  ]) as PitchBend
}

export function isPitchBend(message: Uint8Array): message is PitchBend {
  return (message[0] & channelMessageTypeMask) === pitchbend
}
