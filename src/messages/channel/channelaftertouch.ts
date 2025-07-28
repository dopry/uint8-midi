import { ChannelMessage, channelMessageTypeMask } from '../type'
import { channelNibble, uint8Mask } from '../utility'

export type ChannelAftertouch = ChannelMessage & {
  readonly __channelAftertouch: unique symbol
}
export const channelaftertouch = 0xd0 as const
// #region Data Message Builders

export function buildChannelAftertouch(
  channel: number,
  pressure: number
): ChannelAftertouch {
  return Uint8Array.from([
    channelaftertouch | channelNibble(channel),
    pressure & uint8Mask,
  ]) as ChannelAftertouch
}

export function isChannelAftertouch(
  message: Uint8Array
): message is ChannelAftertouch {
  return (message[0] & channelMessageTypeMask) === channelaftertouch
}

export function getChannelAftertouchPressure(
  message: ChannelAftertouch
): number {
  return message[1] & uint8Mask
}
