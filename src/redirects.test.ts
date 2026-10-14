import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { redirects } from '../redirects'
import redirectConfigJson from './config/redirects.json'
import redirectSchema from '../cms/src/api/redirect/content-types/redirect/schema.json'
import { parseRedirectConfig } from './utils/shared/redirects'
import { REDIRECT_CATEGORIES, type RedirectConfig } from './types/redirects'
import {
  FIRST_ERROR_STATUS,
  parseNetlifyRedirectRules,
  parseRedirectsFile
} from './integrations/validate-internal-links'

const config = parseRedirectConfig(redirectConfigJson) as RedirectConfig
const rules = REDIRECT_CATEGORIES.flatMap((category) => config[category])
const enabledRules = rules.filter((rule) => rule.enabled !== false)

describe('src/config/redirects.json', () => {
  // Parsing also enforces the rules Strapi applies on save (literal sources,
  // / or https:// destinations, unique sources, no self-redirects or chains),
  // and the build fails on any of them; see src/utils/shared/redirects.test.ts.
  it('parses', () => {
    expect(parseRedirectConfig(redirectConfigJson)).not.toBeInstanceOf(Error)
  })

  it('reaches Astro as one entry per enabled rule', () => {
    expect(Object.keys(redirects)).toHaveLength(enabledRules.length)
  })
})

describe('Strapi redirect schema', () => {
  it('offers exactly the categories the JSON is grouped by', () => {
    expect(redirectSchema.attributes.category.enum).toEqual([
      ...REDIRECT_CATEGORIES
    ])
  })
})

// Netlify serves every page at /path/, so a slashless destination costs a
// second 301 hop.
describe('hand-written redirect destinations', () => {
  const readRepoFile = (file: string) =>
    readFileSync(path.resolve(__dirname, '..', file), 'utf8')
  // Except `:splat`: it already holds the request's trailing slash
  // (`/all/x/2/` gives `2/`), so `:splat/` would redirect to `…/2//`.
  const misSlashed = (destinations: string[]) =>
    destinations.filter(
      (to) =>
        to.endsWith(':splat/') || !(to.endsWith('/') || to.endsWith(':splat'))
    )

  it('end in a slash, or bare :splat, in public/_redirects', () => {
    const destinations = parseRedirectsFile(readRepoFile('public/_redirects'))
      // Error-status rules serve /404.html, a file rather than a page.
      .filter(({ status }) => status < FIRST_ERROR_STATUS)
      .map(({ to }) => to)
    expect(destinations.length).toBeGreaterThan(0)
    expect(misSlashed(destinations)).toEqual([])
  })

  it('end in a slash, or bare :splat, in netlify.toml', () => {
    const destinations = parseNetlifyRedirectRules(
      readRepoFile('netlify.toml')
    ).map(({ to }) => to)
    expect(destinations.length).toBeGreaterThan(0)
    expect(misSlashed(destinations)).toEqual([])
  })
})
