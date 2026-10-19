import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { SELF_SPACED_BLOCKS } from './dynamicZoneSpacing'

const PAGES_DIR = path.resolve(import.meta.dirname, '../../pages')

/** Draft-preview routes that fetch a dynamic zone straight from Strapi. */
const PREVIEW_ROUTES = [
  'page-preview.astro',
  'preview/page-preview.astro',
  'preview/hackathon-preview.astro'
]

describe('preview routes', () => {
  it.each(PREVIEW_ROUTES)(
    '%s populates the intro of every intro block it lists',
    (route) => {
      // Strapi only returns a nested component that the query names, so a
      // block missing its intro here previews without its heading or top
      // spacing. `[populate]: '*'` names every first-level component.
      const source = readFileSync(path.join(PAGES_DIR, route), 'utf8')
      const listed = [...SELF_SPACED_BLOCKS].filter((uid) =>
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
