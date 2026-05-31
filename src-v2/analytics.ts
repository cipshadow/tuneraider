/**
 * TuneRaider — PostHog product analytics.
 *
 * Config is injected at build time by Vite (`define` in vite.config.ts), which
 * sources the PostHog project API key + host from the Stripe Projects-managed
 * `.env`. The project API key is a public client-side key, safe to embed.
 *
 * If no key is configured (e.g. local dev without env), analytics is a no-op.
 */
import posthog from 'posthog-js';

declare const __POSTHOG_KEY__: string;
declare const __POSTHOG_HOST__: string;

const KEY = typeof __POSTHOG_KEY__ !== 'undefined' ? __POSTHOG_KEY__ : '';
const HOST = (typeof __POSTHOG_HOST__ !== 'undefined' && __POSTHOG_HOST__) || 'https://eu.i.posthog.com';

let enabled = false;

export function initAnalytics(): void {
  if (enabled || !KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: true,
    person_profiles: 'identified_only',
  });
  enabled = true;
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (!enabled) return;
  posthog.capture(event, props);
}
