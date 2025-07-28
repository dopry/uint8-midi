import {
  buildNoteOn,
  buildNoteOff,
  buildControlChange,
  buildProgramChange,
  isNoteOn,
  isNoteOff,
  isControlChange,
  isProgramChange,
  isSystemMessage,
  isDataMessage,
  getChannel,
  channelNibble,
} from './index'

describe('uint8-midi', () => {
  describe('Message Builders', () => {
    test('buildNoteOn creates correct message', () => {
      const message = buildNoteOn(1, 60, 127)
      expect(message).toEqual(new Uint8Array([144, 60, 127]))
    })

    test('buildNoteOff creates correct message', () => {
      const message = buildNoteOff(1, 60, 0)
      expect(message).toEqual(new Uint8Array([128, 60, 0]))
    })

    test('buildControlChange creates correct message', () => {
      const message = buildControlChange(1, 7, 100)
      expect(message).toEqual(new Uint8Array([176, 7, 100]))
    })

    test('buildProgramChange creates correct message', () => {
      const message = buildProgramChange(1, 5)
      expect(message).toEqual(new Uint8Array([192, 5]))
    })
  })

  describe('Message Type Detection', () => {
    test('isNoteOn correctly identifies note on messages', () => {
      const noteOn = new Uint8Array([144, 60, 127])
      const noteOff = new Uint8Array([128, 60, 0])
      const noteOnZeroVel = new Uint8Array([144, 60, 0])

      expect(isNoteOn(noteOn)).toBe(true)
      expect(isNoteOn(noteOff)).toBe(false)
      expect(isNoteOn(noteOnZeroVel)).toBe(false) // Note on with velocity 0 is treated as note off
    })

    test('isNoteOff correctly identifies note off messages', () => {
      const noteOff = new Uint8Array([128, 60, 0])
      const noteOn = new Uint8Array([144, 60, 127])
      const noteOnZeroVel = new Uint8Array([144, 60, 0])

      expect(isNoteOff(noteOff)).toBe(true)
      expect(isNoteOff(noteOn)).toBe(false)
      expect(isNoteOff(noteOnZeroVel)).toBe(true) // Note on with velocity 0 is treated as note off
    })

    test('isControlChange correctly identifies CC messages', () => {
      const cc = new Uint8Array([176, 7, 100])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isControlChange(cc)).toBe(true)
      expect(isControlChange(noteOn)).toBe(false)
    })

    test('isProgramChange correctly identifies PC messages', () => {
      const pc = new Uint8Array([192, 5])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isProgramChange(pc)).toBe(true)
      expect(isProgramChange(noteOn)).toBe(false)
    })
  })

  describe('System vs Data Messages', () => {
    test('isDataMessage correctly identifies data messages', () => {
      const noteOn = new Uint8Array([144, 60, 127])
      const start = new Uint8Array([250])

      expect(isDataMessage(noteOn)).toBe(true)
      expect(isDataMessage(start)).toBe(false)
    })

    test('isSystemMessage correctly identifies system messages', () => {
      const start = new Uint8Array([250])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isSystemMessage(start)).toBe(true)
      expect(isSystemMessage(noteOn)).toBe(false)
    })
  })

  describe('Utilities', () => {
    test('getChannel returns correct channel', () => {
      const message1 = new Uint8Array([144, 60, 127]) // Channel 1
      const message10 = new Uint8Array([153, 60, 127]) // Channel 10

      expect(getChannel(message1)).toBe(1)
      expect(getChannel(message10)).toBe(10)
    })

    test('channelNibble converts channel correctly', () => {
      expect(channelNibble(1)).toBe(0)
      expect(channelNibble(16)).toBe(15)
    })
  })
})
