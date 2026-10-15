import type { BlockIntroInput } from './contentTypes'
import {
  ckeditorFieldToParsedMarkdown,
  htmlToMarkdown,
  looksLikeHtmlField
} from './mdx'

/** Fields of `shared.block-intro`, in the order they are written to MDX. */
export const BLOCK_INTRO_FIELDS = [
  'heading',
  'subheading',
  'description'
] as const satisfies ReadonlyArray<keyof BlockIntroInput>

export type BlockIntroField = (typeof BLOCK_INTRO_FIELDS)[number]

/** A block intro as written to MDX: trimmed, with empty fields left out. */
export type SerializedBlockIntro = Partial<Record<BlockIntroField, string>>

// heading and subheading are plain strings, converted only if pasted HTML
// slipped in. description is CKEditor markdown that the site renders with
// parseMarkdown, so a <br/> has to become a paragraph break.
function normalizePlainText(value: string): string {
  return (looksLikeHtmlField(value) ? htmlToMarkdown(value) : value).trim()
}

function normalizeField(field: BlockIntroField, value: string): string {
  return field === 'description'
    ? ckeditorFieldToParsedMarkdown(value)
    : normalizePlainText(value)
}

/**
 * Normalizes a `shared.block-intro` component, or returns `null` when no
 * field has content, so an empty intro writes nothing to MDX.
 */
export function normalizeBlockIntro(
  intro: BlockIntroInput | null | undefined
): SerializedBlockIntro | null {
  if (!intro) return null

  const normalized: SerializedBlockIntro = {}
  for (const field of BLOCK_INTRO_FIELDS) {
    const value = intro[field]
    if (typeof value !== 'string') continue
    const text = normalizeField(field, value)
    if (text) normalized[field] = text
  }
  return Object.keys(normalized).length > 0 ? normalized : null
}

/**
 * The ` intro={{…}}` JSX attribute for a block's serialized MDX tag, with its
 * leading space, or `''` when the intro is empty. Values are JSON strings, so
 * quotes, backslashes, newlines and braces need no further escaping: MDX
 * parses the expression with acorn, which reads string literals.
 *
 * @example
 * serializeIntroProp({ heading: 'Our grants', subheading: null })
 * // → ' intro={{"heading":"Our grants"}}'
 */
export function serializeIntroProp(
  intro: BlockIntroInput | null | undefined
): string {
  const normalized = normalizeBlockIntro(intro)
  if (!normalized) return ''

  // normalizeBlockIntro adds the keys in BLOCK_INTRO_FIELDS order.
  return ` intro={${JSON.stringify(normalized)}}`
}
