/**
 * UNIT TEST — serialize() from serialize.ts
 *
 * WHY: Prisma returns Date objects, but React client components can't
 * receive Date objects as props (they aren't serializable). serialize()
 * converts dates to ISO strings. If this breaks, the app crashes when
 * trying to pass database records to client components.
 *
 * PATTERN: "mock the shape, test the transform" — we create a fake
 * Accomplishment object that matches the Prisma type shape, pass it
 * through serialize(), and verify the date fields became strings while
 * everything else stayed the same.
 */
import { describe, it, expect } from 'vitest'
import { serialize } from '@/lib/serialize'

// Fake Accomplishment matching Prisma's shape.
// We don't import the real type to avoid pulling in Prisma's generated client
// (which may not be available in the test environment).
function fakeAccomplishment() {
  return {
    id: 1,
    title: 'Shipped feature X',
    description: 'Implemented the new dashboard widget',
    date: new Date('2026-03-28T00:00:00.000Z'),
    category: 'Engineering',
    resumeStrength: 4,
    timeSpent: 3.5,
    tags: '["react","typescript"]',
    createdAt: new Date('2026-03-28T12:00:00.000Z'),
    updatedAt: new Date('2026-03-28T14:00:00.000Z'),
  }
}

describe('serialize', () => {
  it('should convert date fields to ISO strings', () => {
    // ARRANGE
    const entry = fakeAccomplishment()

    // ACT
    const result = serialize(entry as Parameters<typeof serialize>[0])

    // ASSERT: date fields are now strings
    expect(typeof result.date).toBe('string')
    expect(typeof result.createdAt).toBe('string')
    expect(typeof result.updatedAt).toBe('string')
    expect(result.date).toBe('2026-03-28T00:00:00.000Z')
    expect(result.createdAt).toBe('2026-03-28T12:00:00.000Z')
    expect(result.updatedAt).toBe('2026-03-28T14:00:00.000Z')
  })

  it('should preserve non-date fields unchanged', () => {
    const entry = fakeAccomplishment()
    const result = serialize(entry as Parameters<typeof serialize>[0])

    expect(result.id).toBe(1)
    expect(result.title).toBe('Shipped feature X')
    expect(result.description).toBe('Implemented the new dashboard widget')
    expect(result.category).toBe('Engineering')
    expect(result.resumeStrength).toBe(4)
    expect(result.timeSpent).toBe(3.5)
    expect(result.tags).toBe('["react","typescript"]')
  })
})
