import { describe, expect, it } from 'vitest'
import { normalizeBlockIntro, serializeIntroProp } from './blockIntro'

describe('normalizeBlockIntro', () => {
  it('returns null for a missing intro', () => {
    expect(normalizeBlockIntro(undefined)).toBeNull()
    expect(normalizeBlockIntro(null)).toBeNull()
  })

  it('returns null when every field is empty or null', () => {
    expect(
      normalizeBlockIntro({ heading: '  ', subheading: null, description: '' })
    ).toBeNull()
  })

  it('drops empty fields and trims the rest', () => {
    expect(
      normalizeBlockIntro({
        heading: ' Heading ',
        subheading: '',
        description: null
      })
    ).toEqual({ heading: 'Heading' })
  })

  it('converts pasted HTML in a heading to text', () => {
    expect(normalizeBlockIntro({ heading: '<p>Heading</p>' })).toEqual({
      heading: 'Heading'
    })
  })

  it('converts a CKEditor description to markdown', () => {
    expect(
      normalizeBlockIntro({
        description: '<p>Read the <strong>rules</strong>.</p>'
      })
    ).toEqual({ description: 'Read the **rules**.' })
  })

  it('turns a <br/> in the description into a paragraph break', () => {
    expect(normalizeBlockIntro({ description: 'One<br/>Two' })).toEqual({
      description: 'One\n\nTwo'
    })
  })
})

describe('serializeIntroProp', () => {
  it('writes nothing for an empty intro', () => {
    expect(serializeIntroProp(undefined)).toBe('')
    expect(serializeIntroProp(null)).toBe('')
    expect(serializeIntroProp({ heading: '', subheading: null })).toBe('')
  })

  it('writes only the fields that have content', () => {
    expect(
      serializeIntroProp({ heading: 'Our grants', subheading: null })
    ).toBe(' intro={{"heading":"Our grants"}}')
  })

  it('writes a full intro in field order', () => {
    expect(
      serializeIntroProp({
        description: 'Text',
        subheading: 'Sub',
        heading: 'Heading'
      })
    ).toBe(
      ' intro={{"heading":"Heading","subheading":"Sub","description":"Text"}}'
    )
  })

  it('escapes quotes, backslashes and newlines as JSON', () => {
    expect(serializeIntroProp({ description: 'Say "hi"\\\n\nNext' })).toBe(
      ' intro={{"description":"Say \\"hi\\"\\\\\\n\\nNext"}}'
    )
  })

  it('leaves braces as they are', () => {
    expect(serializeIntroProp({ heading: 'a } b {' })).toBe(
      ' intro={{"heading":"a } b {"}}'
    )
  })
})
