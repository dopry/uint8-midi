import { channelMessageChannelMask } from './type'

// #region Utility Functions
// convert MIDI channel (1-16) to nibble (0-15)

export function channelNibble(channel: number): number {
  return (channelMessageChannelMask & (channel - 1)) as number
} // get the channel from a MIDI message

export function getChannel(message: Uint8Array): number {
  return (message[0] & channelMessageChannelMask) + 1
}
export const uint8Mask = 0xff as const
