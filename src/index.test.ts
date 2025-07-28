import {
  buildNoteOn,
  buildNoteOff,
  buildControlChange,
  buildProgramChange,
  buildPitchBend,
  buildChannelAftertouch,
  buildPolyphonicAftertouch,
  isNoteOn,
  isNoteOff,
  isControlChange,
  isProgramChange,
  isPitchBend,
  isChannelAftertouch,
  isPolyphonicAftertouch,
  isSystemMessage,
  isChannelMessage,
  isStart,
  isStop,
  isContinue,
  getChannel,
  getPolyphonicAftertouchNote,
  getPolyphonicAftertouchPressure,
  getChannelAftertouchPressure,
  channelNibble,
  start,
  stop,
  cont,
} from './index'
import { describe, test, expect } from 'vitest'

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

    test('buildPitchBend creates correct message', () => {
      const message = buildPitchBend(1, 8192) // Center value
      expect(message).toEqual(new Uint8Array([224, 0, 64]))
    })

    test('buildChannelAftertouch creates correct message', () => {
      const message = buildChannelAftertouch(1, 100)
      expect(message).toEqual(new Uint8Array([208, 100]))
    })

    test('buildPolyphonicAftertouch creates correct message', () => {
      const message = buildPolyphonicAftertouch(1, 60, 100)
      expect(message).toEqual(new Uint8Array([160, 60, 100]))
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

    test('isPitchBend correctly identifies pitch bend messages', () => {
      const pitchBend = new Uint8Array([224, 0, 64])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isPitchBend(pitchBend)).toBe(true)
      expect(isPitchBend(noteOn)).toBe(false)
    })

    test('isChannelAftertouch correctly identifies channel aftertouch messages', () => {
      const channelAftertouch = new Uint8Array([208, 100])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isChannelAftertouch(channelAftertouch)).toBe(true)
      expect(isChannelAftertouch(noteOn)).toBe(false)
    })

    test('isPolyphonicAftertouch correctly identifies polyphonic aftertouch messages', () => {
      const polyAftertouch = new Uint8Array([160, 60, 100])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isPolyphonicAftertouch(polyAftertouch)).toBe(true)
      expect(isPolyphonicAftertouch(noteOn)).toBe(false)
    })
  })

  describe('System vs Data Messages', () => {
    test('isChannelMessage correctly identifies channel messages', () => {
      const noteOn = new Uint8Array([144, 60, 127])
      const startMsg = new Uint8Array([start])

      expect(isChannelMessage(noteOn)).toBe(true)
      expect(isChannelMessage(startMsg)).toBe(false)
    })

    test('isSystemMessage correctly identifies system messages', () => {
      const startMsg = new Uint8Array([start])
      const stopMsg = new Uint8Array([stop])
      const contMsg = new Uint8Array([cont])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isSystemMessage(startMsg)).toBe(true)
      expect(isSystemMessage(stopMsg)).toBe(true)
      expect(isSystemMessage(contMsg)).toBe(true)
      expect(isSystemMessage(noteOn)).toBe(false)
    })
  })

  describe('System Message Detection', () => {
    test('isStart correctly identifies start messages', () => {
      const startMsg = new Uint8Array([start])
      const stopMsg = new Uint8Array([stop])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isStart(startMsg)).toBe(true)
      expect(isStart(stopMsg)).toBe(false)
      expect(isStart(noteOn)).toBe(false)
    })

    test('isStop correctly identifies stop messages', () => {
      const stopMsg = new Uint8Array([stop])
      const startMsg = new Uint8Array([start])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isStop(stopMsg)).toBe(true)
      expect(isStop(startMsg)).toBe(false)
      expect(isStop(noteOn)).toBe(false)
    })

    test('isContinue correctly identifies continue messages', () => {
      const contMsg = new Uint8Array([cont])
      const startMsg = new Uint8Array([start])
      const noteOn = new Uint8Array([144, 60, 127])

      expect(isContinue(contMsg)).toBe(true)
      expect(isContinue(startMsg)).toBe(false)
      expect(isContinue(noteOn)).toBe(false)
    })
  })

  describe('Data Extraction Functions', () => {
    test('getPolyphonicAftertouchNote extracts correct note', () => {
      const polyAftertouch = new Uint8Array([160, 60, 100])
      expect(getPolyphonicAftertouchNote(polyAftertouch)).toBe(60)
    })

    test('getPolyphonicAftertouchPressure extracts correct pressure', () => {
      const polyAftertouch = new Uint8Array([160, 60, 100])
      expect(getPolyphonicAftertouchPressure(polyAftertouch)).toBe(100)
    })

    test('getChannelAftertouchPressure extracts correct pressure', () => {
      const channelAftertouch = new Uint8Array([208, 100])
      expect(getChannelAftertouchPressure(channelAftertouch)).toBe(100)
    })
  })

  describe('Utilities', () => {
    test('getChannel returns correct channel', () => {
      const message1 = new Uint8Array([144, 60, 127]) // Channel 1
      const message10 = new Uint8Array([153, 60, 127]) // Channel 10
      const message16 = new Uint8Array([159, 60, 127]) // Channel 16

      expect(getChannel(message1)).toBe(1)
      expect(getChannel(message10)).toBe(10)
      expect(getChannel(message16)).toBe(16)
    })

    test('channelNibble converts channel correctly', () => {
      expect(channelNibble(1)).toBe(0)
      expect(channelNibble(10)).toBe(9)
      expect(channelNibble(16)).toBe(15)
    })
  })

  describe('Edge Cases and Boundaries', () => {
    test('pitch bend handles boundary values correctly', () => {
      const minPitchBend = buildPitchBend(1, 0) // Minimum value
      const maxPitchBend = buildPitchBend(1, 16383) // Maximum value (14-bit)
      const centerPitchBend = buildPitchBend(1, 8192) // Center value

      expect(isPitchBend(minPitchBend)).toBe(true)
      expect(isPitchBend(maxPitchBend)).toBe(true)
      expect(isPitchBend(centerPitchBend)).toBe(true)

      // Check correct encoding
      expect(minPitchBend).toEqual(new Uint8Array([224, 0, 0]))
      expect(maxPitchBend).toEqual(new Uint8Array([224, 127, 127]))
      expect(centerPitchBend).toEqual(new Uint8Array([224, 0, 64]))
    })

    test('aftertouch handles all pressure values', () => {
      const minPressure = buildChannelAftertouch(1, 0)
      const maxPressure = buildChannelAftertouch(1, 127)

      expect(isChannelAftertouch(minPressure)).toBe(true)
      expect(isChannelAftertouch(maxPressure)).toBe(true)
      expect(getChannelAftertouchPressure(minPressure)).toBe(0)
      expect(getChannelAftertouchPressure(maxPressure)).toBe(127)
    })

    test('polyphonic aftertouch handles all values', () => {
      const minNote = buildPolyphonicAftertouch(1, 0, 64)
      const maxNote = buildPolyphonicAftertouch(1, 127, 64)
      const minPressure = buildPolyphonicAftertouch(1, 60, 0)
      const maxPressure = buildPolyphonicAftertouch(1, 60, 127)

      expect(isPolyphonicAftertouch(minNote)).toBe(true)
      expect(isPolyphonicAftertouch(maxNote)).toBe(true)
      expect(getPolyphonicAftertouchNote(minNote)).toBe(0)
      expect(getPolyphonicAftertouchNote(maxNote)).toBe(127)
      expect(getPolyphonicAftertouchPressure(minPressure)).toBe(0)
      expect(getPolyphonicAftertouchPressure(maxPressure)).toBe(127)
    })

    test('system message constants have correct values', () => {
      expect(start).toBe(0xfa)
      expect(stop).toBe(0xfc)
      expect(cont).toBe(0xfb)
    })

    test('all channels work correctly with different message types', () => {
      for (let channel = 1; channel <= 16; channel++) {
        const noteOnMsg = buildNoteOn(channel, 60, 127)
        const ccMsg = buildControlChange(channel, 7, 100)
        const pcMsg = buildProgramChange(channel, 1)
        const pbMsg = buildPitchBend(channel, 8192)
        const caMsg = buildChannelAftertouch(channel, 100)
        const paMsg = buildPolyphonicAftertouch(channel, 60, 100)

        expect(getChannel(noteOnMsg)).toBe(channel)
        expect(getChannel(ccMsg)).toBe(channel)
        expect(getChannel(pcMsg)).toBe(channel)
        expect(getChannel(pbMsg)).toBe(channel)
        expect(getChannel(caMsg)).toBe(channel)
        expect(getChannel(paMsg)).toBe(channel)
      }
    })
  })
})
