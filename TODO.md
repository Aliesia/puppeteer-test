# puppeteer-test (clan-bot) — Project Notes & TODOs

## What this project does

A Telegram bot for a Clash Royale clan. It scrapes `royaleapi.com` with Puppeteer, parses HTML with
cheerio, and responds to Telegram commands with clan/war statistics (top players, inactive members,
donation rankings, etc.). Entry point is `helpers/telegram.js`; scraping is in `handlers/importSevice.js`;
filtering/ranking logic is in `handlers/filterService.js`.

Environment variables required (`.env`):
- `TELEGRAM_TOKEN` — Telegram bot token
- `CLAN_URL` — full URL to the clan page on royaleapi.com
- `CHROMEDRIVER_URL` — path to Chrome executable for Puppeteer

---

## Known issues (found in security review, July 2026)

### Critical

- **`helpers/telegram.js` line 13 — `warData` is a shared global; race condition on concurrent commands**
  Two simultaneous messages (e.g. `/update` and `/top`) can race: `/top` reads `warData` before
  `/update` reassigns it, receiving `undefined`. Every `FilterService.*` call then throws on
  `Object.entries(undefined)`. Fix: protect with a per-chat update lock or re-fetch on demand.

- **`helpers/telegram.js` lines 62–67 — `msg.text` is `undefined` for non-text messages (stickers,
  photos, voice notes)**
  `.toString()` on `undefined` returns `"undefined"` which accidentally matches nothing today, but
  the Telegram Bot API spec allows `null` for non-text updates — which throws `TypeError` and kills
  the polling loop. Fix: add `if (!msg.text) return;` at the top of the message handler.

- **`handlers/importSevice.js` line 91 — hardcoded clan tag and unvalidated `member.tag` in URL**
  `89VLQR0` is hardcoded instead of read from an env var. `member.tag` is appended to the URL without
  format validation. Tags should be validated against `/^[0-9A-Z]+$/` before use. Move the clan tag
  to a `CLAN_TAG` env var.

### Major

- **`helpers/telegram.js` — entire message handler has no `try/catch`**
  Any unhandled rejection from a scraping call, `sendMessage`, or presenter throws an unhandled
  promise rejection. Node 15+ terminates the process on unhandled rejections, silently killing the
  bot. Wrap the handler body in `try/catch` and send a user-facing error message without leaking
  internal details.

- **`models/member.js` `introduce` getter — no HTML escaping in Telegram HTML-mode messages**
  Player names and tags from scraped HTML are interpolated directly into messages sent with
  `parse_mode: "HTML"`. A name containing `<`, `>`, or `&` breaks Telegram message rendering and
  causes `sendMessage` to throw. Fix: escape these characters in `introduce` before interpolation.

- **`helpers/puppeteer.js` lines 10–11 — `--no-sandbox` without documentation or mitigation**
  Required to run Chrome in containers but removes OS-level process isolation. Document with a
  comment explaining the deployment constraint, and ensure the bot runs as a non-root user.

- **`handlers/importSevice.js` — `import * as cherio from 'cheerio'` preserves the old typo**
  Works correctly today but is a readability hazard. Switch to `import { load } from 'cheerio'`
  and call `load(content)` directly.

- **`node-telegram-bot-api` v1.x changed promise rejection behavior**
  The upgrade from v0.50 to v1.2.0 is a major bump. `sendMessage` now rejects on API errors rather
  than emitting error events. Combined with the missing try/catch, this expands the crash surface.
  Verify behavior end-to-end after the upgrade.

### Minor

- **`helpers/telegram.js` line 68 — `setMyCommands` called on every incoming message**
  This is a configuration API call; it should be called once at startup, not per-message.
  Repeated calls will trigger Telegram's rate limiter under any real traffic.

- **`helpers/puppeteer.js` line 44 — path traversal risk in `generatePDF` via `fileName`**
  `fileName` is inserted into a filesystem path without sanitization. Current callers pass string
  literals, but a future refactor that routes any external input here would be a path traversal
  vulnerability. Fix: wrap with `path.basename(fileName)`.

- **`helpers/puppeteer.js` line 46 — `path.dirname('')` is fragile**
  Resolves to `'.'` only when the process starts from the project root. Use
  `path.join(process.cwd(), 'data', getDateString())` for robustness.

- **`handlers/scrapper.js` lines 42–44 — `console.log(error)` may expose file paths/credentials**
  Full error objects in logs include stack traces that can contain env-derived values (e.g. Chrome
  path). Prefer `console.error(error.message)` for operational errors.

- **No startup validation for `TELEGRAM_TOKEN`**
  `new TelegramBot(undefined, {polling: true})` throws a non-obvious error. Add a guard:
  `if (!process.env.TELEGRAM_TOKEN) throw new Error('TELEGRAM_TOKEN is required');`

---

## Architecture notes

- **`userClanHistoryImporter` (importSevice.js lines 82–102)** launches a new Puppeteer browser
  per clan member to check join dates. For a 50-member clan this spawns 50 sequential browser
  instances. The month `06` is hardcoded in the date parsing — this logic only works in June.
  This function is effectively broken for most of the year.

- **`getData()` in scrapper.js** returns `undefined` on failure (the `catch` has no return statement).
  All callers receive `undefined` as `warData` and throw when passing it to `FilterService.*`. Error
  recovery should either re-throw or return a safe empty value.

- **`CLAN_URL + '/war/analytics'`** string concatenation is fragile if `CLAN_URL` has a trailing
  slash or query string. Use `new URL('/war/analytics', CLAN_URL).href` for safe composition.

- **No per-user rate limiting** on `/update`. Any user can spam the command to repeatedly launch
  Puppeteer and hammer royaleapi.com. Add a per-chat cooldown.

- **`importSevice.js` is misspelled** (`Sevice` instead of `Service`) — worth renaming in the next
  refactor window, updating all import sites.
