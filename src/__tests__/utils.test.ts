/**
 * UNIT TESTS — parseArray() and constants from utils.ts
 *
 * WHY: parseArray is used throughout the app to safely parse JSON strings
 * from form data and database fields. If it breaks, data silently disappears.
 * These tests verify it handles all the edge cases: valid JSON, invalid JSON,
 * null, undefined, and non-array JSON values.
 *
 * PATTERN: "pure function unit test" — no mocks, no setup, just input → output.
 * These are the easiest and most valuable tests to write. If your app has pure
 * functions, test them first.
 */
import { describe, it, expect } from 'vitest'
import { parseArray, CATEGORIES, STRENGTH_COLORS, STRENGTH_LABELS } from '@/lib/utils'

describe('parseArray', () => {
  it('should parse a valid JSON array string', () => {
    // ARRANGE: a JSON string containing an array
    const input = '["Engineering", "Leadership"]'

    // ACT: parse it
    const result = parseArray(input)

    // ASSERT: we get the array back
    expect(result).toEqual(['Engineering', 'Leadership'])
  })

  it('should return empty array for null input', () => {
    // WHY: FormData.get() returns null when a field is missing.
    // parseArray must handle this gracefully instead of crashing.
    expect(parseArray(null)).toEqual([])
  })

  it('should return empty array for undefined input', () => {
    expect(parseArray(undefined)).toEqual([])
  })

  it('should return empty array for empty string', () => {
    expect(parseArray('')).toEqual([])
  })

  it('should return empty array for invalid JSON', () => {
    // WHY: If corrupted data gets into the database, parseArray should
    // fail safely rather than throwing an exception that crashes the page.
    expect(parseArray('not valid json')).toEqual([])
  })

  it('should return empty array when JSON parses to non-array', () => {
    // WHY: JSON.parse('42') returns 42 (a number), not an array.
    // parseArray should only return actual arrays.
    expect(parseArray('42')).toEqual([])
    expect(parseArray('"just a string"')).toEqual([])
    expect(parseArray('{"key": "value"}')).toEqual([])
  })
})

describe('CATEGORIES', () => {
  it('should contain expected categories', () => {
    // WHY: Categories are used for validation and UI dropdowns.
    // If someone accidentally deletes one, forms break silently.
    expect(CATEGORIES).toContain('Engineering')
    expect(CATEGORIES).toContain('Leadership')
    expect(CATEGORIES).toContain('Other')
  })

  it('should have 8 categories', () => {
    expect(CATEGORIES).toHaveLength(8)
  })
})

describe('STRENGTH_COLORS', () => {
  it('should have colors for all 5 strength levels', () => {
    for (let i = 1; i <= 5; i++) {
      expect(STRENGTH_COLORS[i]).toBeDefined()
      expect(STRENGTH_COLORS[i]).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
})

describe('STRENGTH_LABELS', () => {
  it('should have labels for all 5 strength levels', () => {
    for (let i = 1; i <= 5; i++) {
      expect(STRENGTH_LABELS[i]).toBeDefined()
      expect(typeof STRENGTH_LABELS[i]).toBe('string')
    }
  })
})
