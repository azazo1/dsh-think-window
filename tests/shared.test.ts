import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { FOLLOW_SLOP_PX, isNearBottom } from '../src/shared.ts'

describe('isNearBottom', () => {
  it('treats the last slop pixels as the bottom', () => {
    assert.equal(isNearBottom(68, 120, 40, 16), true)
    assert.equal(isNearBottom(60, 120, 40, 16), false)
  })

  it('uses the default slop when none is given', () => {
    assert.equal(isNearBottom(120 - 40, 120, 40), true)
    assert.equal(isNearBottom(120 - 40 - FOLLOW_SLOP_PX - 1, 120, 40), false)
  })
})
