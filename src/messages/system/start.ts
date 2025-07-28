import { SystemMessage } from '../type'
import { uint8Mask } from '../utility'

// const measureEnd = 0xf9 as const
export const start = 0xfa as const // system messages

export type Start = SystemMessage & {
  readonly __start: unique symbol
}
// #endregion Data Message Type Checkers

export function isStart(message: Uint8Array): message is Start {
  return (message[0] & uint8Mask) === start
}
