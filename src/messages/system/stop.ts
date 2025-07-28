import { SystemMessage } from '../type'
import { uint8Mask } from '../utility'

export const stop = 0xfc as const
export type Stop = SystemMessage & {
  readonly __stop: unique symbol
}
export function isStop(message: Uint8Array): message is Stop {
  return (message[0] & uint8Mask) === stop
}
