import { ChannelMessage, channelMessageTypeMask } from '../type'
import { channelNibble, uint8Mask } from '../utility'

export const polyphonicaftertouch = 0xa0 as const

export type PolyphonicAftertouch = ChannelMessage & {
  readonly __polyphonicAftertouch: unique symbol
}

export function buildPolyphonicAftertouch(
  channel: number,
  note: number,
  pressure: number
): PolyphonicAftertouch {
  return Uint8Array.from([
    polyphonicaftertouch | channelNibble(channel),
    note & uint8Mask,
    pressure & uint8Mask,
  ]) as PolyphonicAftertouch
}

export function isPolyphonicAftertouch(
  message: Uint8Array
): message is PolyphonicAftertouch {
  return (message[0] & channelMessageTypeMask) === polyphonicaftertouch
}

export function getPolyphonicAftertouchNote(
  message: PolyphonicAftertouch
): number {
  return message[1] & uint8Mask
}

export function getPolyphonicAftertouchPressure(
  message: PolyphonicAftertouch
): number {
  return message[2] & uint8Mask
}
