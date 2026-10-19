import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const PAGES_DIR = path.resolve(import.meta.dirname, '../../pages')
const CMS_BLOCKS_DIR = path.resolve(
  import.meta.dirname,
  '../../../cms/src/components/blocks'
)

/** Draft-preview routes that fetch a dynamic zone straight from Strapi. */
const PREVIEW_ROUTES = [
  'page-preview.astro',
  'preview/page-preview.astro',
  'preview/hackathon-preview.astro'
]

/** `blocks.*` uids whose Strapi schema has an `intro` field. */
function introBlockUids(): string[] {
  return readdirSync(CMS_BLOCKS_DIR)
    .filter((file) => file.endsWith('.json'))
    .filter((file) => {
      const schema = JSON.parse(
        readFileSync(path.join(CMS_BLOCKS_DIR, file), 'utf8')
      )
      return 'intro' in (schema.attributes ?? {})
    })
    .map((file) => `blocks.${path.basename(file, '.json')}`)
}

describe('preview routes', () => {
  const introBlocks = introBlockUids()

  it('finds the blocks that have an intro', () => {
    expect(introBlocks).toContain('blocks.card-grid')
  })

  it.each(PREVIEW_ROUTES)(
    '%s populates the intro of every intro block it lists',
    (route) => {
      // Strapi only returns a nested component that the query names, so a
      // block missing its intro here previews without its heading or top
      // spacing. `[populate]: '*'` names every first-level component.
      const source = readFileSync(path.join(PAGES_DIR, route), 'utf8')
      const listed = introBlocks.filter((uid) =>
        source.includes(`[on][${uid}]`)
      )
      const missing = listed.filter(
        (uid) =>
          !source.includes(
            `'populate[content][on][${uid}][populate][intro]'`
          ) &&
          !source.includes(`'populate[content][on][${uid}][populate]': '*'`)
      )
      expect(listed.length).toBeGreaterThan(0)
      expect(missing).toEqual([])
    }
  )
})
