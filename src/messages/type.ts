export type SystemMessage = Uint8Array & {
  readonly __systemMessage: unique symbol
}
export function isSystemMessage(message: Uint8Array): message is SystemMessage {
  return (message[0] & 0xf0) === 0xf0
}
// midi system messages types left to implement
// const sysexStart = 0xf0 as const
// const quarterFrame = 0xf1 as const
// const songPointer = 0xf2 as const
// const songSelect = 0xf3 as const
// const tuneRequest = 0xf6 as const
// const sysexEnd = 0xf7 as const
// const timingClock = 0xf8 as const

export type ChannelMessage = Uint8Array & {
  readonly __channelMessage: unique symbol
}
export const channelMessageChannelMask = 0x0f as const
export const channelMessageTypeMask = 0xf0 as const
export function isChannelMessage(
  message: Uint8Array
): message is ChannelMessage {
  return (message[0] & 0xf0) !== 0xf0
}
