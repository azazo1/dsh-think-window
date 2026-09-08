import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  DEFAULT_LINES, MAX_LINES, MIN_LINES, clampLines, decodeThinkWindowSettings,
  isNearBottom,
} from '../src/shared.ts'

describe('clampLines', () => {
  it('keeps a value inside the window', () => {
    assert.equal(clampLines(12), 12)
  })

  it('rounds and clamps to the legal range', () => {
    assert.equal(clampLines(-3), MIN_LINES)
    assert.equal(clampLines(MAX_LINES + 8), MAX_LINES)
    assert.equal(clampLines(7.6), 8)
  })

  it('falls back when the value is not a finite number', () => {
    assert.equal(clampLines('nope'), DEFAULT_LINES)
    assert.equal(clampLines(Number.NaN), DEFAULT_LINES)
    assert.equal(clampLines(undefined), DEFAULT_LINES)
  })

  it('accepts a numeric string', () => {
    assert.equal(clampLines('4'), 4)
  })
})

describe('decodeThinkWindowSettings', () => {
  it('returns undefined for a non-object section', () => {
    assert.equal(decodeThinkWindowSettings(null), undefined)
    assert.equal(decodeThinkWindowSettings('x'), undefined)
  })

  it('reads a valid lines field', () => {
    assert.deepEqual(decodeThinkWindowSettings({ lines: 16 }), { lines: 16 })
  })

  it('falls back when lines is missing or invalid', () => {
    assert.deepEqual(decodeThinkWindowSettings({}), { lines: DEFAULT_LINES })
    assert.deepEqual(decodeThinkWindowSettings({ lines: 'nope' }), { lines: DEFAULT_LINES })
  })
})

describe('isNearBottom', () => {
  it('treats the last slop pixels as the bottom', () => {
    assert.equal(isNearBottom(68, 120, 40, 16), true)
    assert.equal(isNearBottom(60, 120, 40, 16), false)
  })
})
