import { ChannelMessage, channelMessageTypeMask } from '../type'
import { channelNibble, uint8Mask } from '../utility'

export const programchange = 0xc0 as const
export type ProgramChange = ChannelMessage & {
  readonly __programChange: unique symbol
}
export function buildProgramChange(
  channel: number,
  program: number
): ProgramChange {
  return Uint8Array.from([
    programchange | channelNibble(channel),
    program & uint8Mask,
  ]) as ProgramChange
}
export function isProgramChange(message: Uint8Array): message is ProgramChange {
  return (message[0] & channelMessageTypeMask) === programchange
}
