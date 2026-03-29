/**
 * UNIT TESTS — validateAccomplishment() from validation.ts
 *
 * WHY: This function guards every form submission. If validation is broken,
 * bad data gets into the database (missing titles, invalid dates, etc.).
 * Testing validation is high-value because the function has many branches
 * (one per field) and each branch has edge cases.
 *
 * PATTERN: "boundary testing" — test the edges of each input constraint.
 * For "title must be at least 3 characters", test with 2 chars (fail),
 * 3 chars (pass), and empty string (fail). This catches off-by-one errors.
 *
 * NOTE: We create FormData objects manually in tests. This is how you test
 * functions that take FormData without needing a browser or a form element.
 */
import { describe, it, expect } from 'vitest'
import { validateAccomplishment } from '@/lib/validation'

/**
 * Helper to build a FormData with all valid fields.
 * Tests override individual fields to test specific validation rules.
 *
 * WHY: Without a helper, every test would repeat 5 lines of FormData setup.
 * This keeps tests focused on what they're actually testing.
 */
function validFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData()
  fd.set('title', 'Built a feature')
  fd.set('date', '2026-03-28')
  fd.set('category', 'Engineering')
  fd.set('resumeStrength', '3')
  fd.set('timeSpent', '2')
  for (const [key, value] of Object.entries(overrides)) {
    fd.set(key, value)
  }
  return fd
}

describe('validateAccomplishment', () => {
  it('should return no errors for valid input', () => {
    // ARRANGE: all fields are valid
    const fd = validFormData()

    // ACT: validate
    const errors = validateAccomplishment(fd)

    // ASSERT: empty object = no errors
    expect(Object.keys(errors)).toHaveLength(0)
  })

  // --- Title validation ---
  it('should require title to be at least 3 characters', () => {
    const errors = validateAccomplishment(validFormData({ title: 'ab' }))
    expect(errors.title).toBeDefined()
  })

  it('should accept title with exactly 3 characters', () => {
    const errors = validateAccomplishment(validFormData({ title: 'abc' }))
    expect(errors.title).toBeUndefined()
  })

  it('should reject empty title', () => {
    const errors = validateAccomplishment(validFormData({ title: '' }))
    expect(errors.title).toBeDefined()
  })

  it('should reject whitespace-only title', () => {
    // WHY: "   " has length > 3 but trim().length < 3.
    // This catches the trim() logic.
    const errors = validateAccomplishment(validFormData({ title: '   ' }))
    expect(errors.title).toBeDefined()
  })

  // --- Date validation ---
  it('should reject missing date', () => {
    const fd = validFormData()
    fd.delete('date')
    const errors = validateAccomplishment(fd)
    expect(errors.date).toBeDefined()
  })

  it('should reject invalid date string', () => {
    const errors = validateAccomplishment(validFormData({ date: 'not-a-date' }))
    expect(errors.date).toBeDefined()
  })

  // --- Category validation ---
  it('should reject invalid category', () => {
    const errors = validateAccomplishment(validFormData({ category: 'InvalidCategory' }))
    expect(errors.category).toBeDefined()
  })

  it('should accept valid category', () => {
    const errors = validateAccomplishment(validFormData({ category: 'Leadership' }))
    expect(errors.category).toBeUndefined()
  })

  // --- Resume strength validation ---
  it('should reject strength below 1', () => {
    const errors = validateAccomplishment(validFormData({ resumeStrength: '0' }))
    expect(errors.resumeStrength).toBeDefined()
  })

  it('should reject strength above 5', () => {
    const errors = validateAccomplishment(validFormData({ resumeStrength: '6' }))
    expect(errors.resumeStrength).toBeDefined()
  })

  it('should reject non-numeric strength', () => {
    const errors = validateAccomplishment(validFormData({ resumeStrength: 'abc' }))
    expect(errors.resumeStrength).toBeDefined()
  })

  // --- Time spent validation ---
  it('should allow empty time spent (optional field)', () => {
    const fd = validFormData()
    fd.delete('timeSpent')
    const errors = validateAccomplishment(fd)
    expect(errors.timeSpent).toBeUndefined()
  })

  it('should reject negative time spent', () => {
    const errors = validateAccomplishment(validFormData({ timeSpent: '-1' }))
    expect(errors.timeSpent).toBeDefined()
  })

  it('should accept zero time spent', () => {
    const errors = validateAccomplishment(validFormData({ timeSpent: '0' }))
    expect(errors.timeSpent).toBeUndefined()
  })
})
