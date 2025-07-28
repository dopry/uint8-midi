import { ChannelMessage, channelMessageTypeMask } from '../type'
import { channelNibble, uint8Mask } from '../utility'

export const controlchange = 0xb0 as const

export type ControlChange = ChannelMessage & {
  readonly __controlChange: unique symbol
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
  ]) as ControlChange
}

export function isControlChange(message: Uint8Array): message is ControlChange {
  return (message[0] & channelMessageTypeMask) === controlchange
}

export function getControlChangeController(message: ControlChange): number {
  return message[1] & uint8Mask
}

export function getControlChangeValue(message: ControlChange): number {
  return message[2] & uint8Mask
}
