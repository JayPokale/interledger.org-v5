import { describe, expect, it } from 'vitest'
import type { BlockIntro } from '../../types/blockIntro'
import {
  blockIntroLabel,
  normalizeBlockIntro,
  resolveBlockIntro
} from './blockIntro'

describe('normalizeBlockIntro', () => {
  it('returns null for a missing intro', () => {
    expect(normalizeBlockIntro(undefined)).toBeNull()
    expect(normalizeBlockIntro(null)).toBeNull()
  })

  it('returns null for an intro with no fields', () => {
    expect(normalizeBlockIntro({})).toBeNull()
  })

  it('returns null when every field is blank', () => {
    expect(
      normalizeBlockIntro({ heading: '  ', subheading: '', description: '\n' })
    ).toBeNull()
  })

  it('keeps a full intro, trimmed', () => {
    expect(
      normalizeBlockIntro({
        heading: ' Our grants ',
        subheading: 'How they work',
        description: 'Read the **rules**.\n'
      })
    ).toEqual({
      heading: 'Our grants',
      subheading: 'How they work',
      description: 'Read the **rules**.'
    })
  })

  it.each<[string, BlockIntro]>([
    ['heading', { heading: 'Heading' }],
    ['subheading', { subheading: 'Subheading' }],
    ['description', { description: 'Description' }]
  ])('keeps an intro that has only a %s', (field, intro) => {
    const normalized = normalizeBlockIntro(intro)
    expect(normalized).not.toBeNull()
    expect(normalized?.[field as keyof BlockIntro]).toBe(
      intro[field as keyof BlockIntro]
    )
  })

  it('sets the missing fields to null', () => {
    expect(normalizeBlockIntro({ heading: 'Heading' })).toEqual({
      heading: 'Heading',
      subheading: null,
      description: null
    })
  })

  it('turns a CKEditor <br/> in the description into a paragraph break', () => {
    expect(
      normalizeBlockIntro({ description: 'One<br />Two<br/>Three<BR>Four' })
        ?.description
    ).toBe('One\n\nTwo\n\nThree\n\nFour')
  })

  it('treats a description of only break tags as empty', () => {
    expect(normalizeBlockIntro({ description: ' <br /> <br/> ' })).toBeNull()
  })

  it('treats a non-string field as empty', () => {
    const malformed = {
      heading: 42,
      description: ['x']
    } as unknown as BlockIntro
    expect(normalizeBlockIntro(malformed)).toBeNull()
  })

  it('treats a non-object intro as empty', () => {
    expect(normalizeBlockIntro('Heading' as unknown as BlockIntro)).toBeNull()
  })
})

describe('resolveBlockIntro', () => {
  it('prefers an intro with content over the legacy heading', () => {
    expect(resolveBlockIntro({ subheading: 'Sub' }, 'Old')).toEqual({
      heading: null,
      subheading: 'Sub',
      description: null
    })
  })

  it('falls back to the legacy heading', () => {
    expect(resolveBlockIntro({ heading: ' ' }, ' Old ')).toEqual({
      heading: 'Old',
      subheading: null,
      description: null
    })
    expect(resolveBlockIntro(undefined, 'Old')?.heading).toBe('Old')
  })

  it('returns null when neither has content', () => {
    expect(resolveBlockIntro(null, '')).toBeNull()
    expect(resolveBlockIntro(undefined, undefined)).toBeNull()
  })
})

describe('blockIntroLabel', () => {
  it('uses the heading, then the subheading', () => {
    expect(
      blockIntroLabel(normalizeBlockIntro({ heading: 'H', subheading: 'S' }))
    ).toBe('H')
    expect(blockIntroLabel(normalizeBlockIntro({ subheading: 'S' }))).toBe('S')
  })

  it('returns null without a heading or subheading', () => {
    expect(
      blockIntroLabel(normalizeBlockIntro({ description: 'D' }))
    ).toBeNull()
    expect(blockIntroLabel(null)).toBeNull()
  })
})
