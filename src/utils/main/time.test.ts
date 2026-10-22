import { describe, expect, it, vi } from 'vitest'

// `./time` -> `./i18` -> `./locales` reaches into Astro's virtual modules for
// i18n config. Mock them with a minimal en/es setup (see breadcrumbs.test.ts).
vi.mock('astro:config/client', () => ({
  i18n: { locales: ['en', 'es'], defaultLocale: 'en' }
}))
vi.mock('astro:i18n', () => ({
  toCodes: (locales: string[]) => locales
}))
vi.mock('astro:content', async () => {
  const { z } = await import('zod')
  return { z }
})

const { formatAgendaDate } = await import('./time')

describe('formatAgendaDate', () => {
  it('formats a calendar day as weekday, month and day', () => {
    expect(formatAgendaDate('2026-10-16', 'en')).toBe('Friday, October 16')
    expect(formatAgendaDate('2026-10-16', 'es')).toBe('viernes, 16 de octubre')
  })

  it('keeps the day whatever the time zone, reading it as UTC', () => {
    // Midnight UTC on the 1st is still the 30th in the Americas.
    expect(formatAgendaDate('2026-11-01', 'en')).toBe('Sunday, November 1')
  })

  it('returns an empty string for a malformed or impossible date', () => {
    expect(formatAgendaDate('Friday October 16', 'en')).toBe('')
    expect(formatAgendaDate('2026-02-30', 'en')).toBe('')
    expect(formatAgendaDate('', 'en')).toBe('')
  })
})
