import { SystemMessage } from '../type'
import { uint8Mask } from '../utility'

export const cont = 0xfb as const // continue
export type Continue = SystemMessage & {
  readonly __continue: unique symbol
}
export function isContinue(message: Uint8Array): message is Continue {
  return (message[0] & uint8Mask) === cont
}
