# Mailcheck-JS

A lightweight, immutable email validation library for JavaScript — browser-side companion to [Mailcheck-PHP](https://github.com/pedrohrigolin/Mailcheck-PHP).

---

## Overview

Mailcheck-JS exposes a single global object (`Mailcheck`) with a `check()` method and a set of built-in validation type aliases. The entire public API is deeply frozen via `Object.freeze()`, preventing accidental mutation at runtime.

The library is designed to be loaded as a plain `<script>` tag with zero dependencies.

---

## Installation

Download `mailcheck.js` (or `mailcheck.min.js`) and include it in your HTML:

```html
<script src="mailcheck.js"></script>
```

The script self-registers as `window.Mailcheck`. If `Mailcheck` is already defined when the script loads, it will emit a warning and abort silently — no overwrite occurs.

---

## API

### `Mailcheck.check(email, type?)`

Validates an email address against the specified rule set.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `email` | `string` | — | The email address to validate |
| `type` | `string` | `'ANY'` | Validation type. Use an alias from `Mailcheck.types` |

Returns `true` if the email passes validation, `false` otherwise.

On invalid input (wrong types, unknown `type` key), the function logs a descriptive error via `console.error` and returns `false`.

---

### `Mailcheck.types`

An immutable object containing the available validation type aliases. Always prefer these over raw strings.

| Alias | Value | Description |
|-------|-------|-------------|
| `Mailcheck.types.ANY` | `'ANY'` | Generic validation — any structurally valid email with a valid TLD |
| `Mailcheck.types.COMMON` | `'COMMON'` | Requires domain ending in `.com`, `.com.br`, or `.br` |
| `Mailcheck.types.POPULAR` | `'POPULAR'` | Allows only well-known consumer providers (Gmail, Outlook, Hotmail, etc.) |

---

## Usage

### Basic validation (default — `ANY`)

Validates that the email has a structurally valid format and a recognized TLD of at least 2 characters.

```js
Mailcheck.check('user@example.com');
// → true

Mailcheck.check('user@example.com', Mailcheck.types.ANY);
// → true (explicit, equivalent to above)

Mailcheck.check('not-an-email');
// → false
```

### Common domains (`COMMON`)

Restricts the domain to `.com`, `.com.br`, or `.br`. Subdomains before the suffix are allowed.

```js
Mailcheck.check('user@company.com.br', Mailcheck.types.COMMON);
// → true

Mailcheck.check('user@company.io', Mailcheck.types.COMMON);
// → false
```

### Popular providers (`POPULAR`)

Validates against a curated list of widely-used consumer email providers.

```js
Mailcheck.check('user@gmail.com', Mailcheck.types.POPULAR);
// → true

Mailcheck.check('user@outlook.com.br', Mailcheck.types.POPULAR);
// → true

Mailcheck.check('user@company.com', Mailcheck.types.POPULAR);
// → false
```

Accepted providers:

| Provider | Accepted domains |
|----------|-----------------|
| Gmail | `gmail.com` |
| Outlook | `outlook.com`, `outlook.com.br` |
| Hotmail | `hotmail.com`, `hotmail.com.br` |
| Live | `live.com`, `live.com.br` |
| Yahoo | `yahoo.com`, `yahoo.com.br` |
| Terra | `terra.com`, `terra.com.br` |
| iCloud | `icloud.com` |
| UOL | `uol.com.br` |
| myYahoo | `myyahoo.com`, `myyahoo.com.br` |

---

## Error handling

All validation errors are non-throwing — the function returns `false` and logs to `console.error`. This makes Mailcheck safe to use in any context without try/catch.

```js
Mailcheck.check(12345);
// console.error: "Invalid email provided to Mailcheck.check. Expected a string."
// → false

Mailcheck.check('user@gmail.com', 'UNKNOWN');
// console.error: "Invalid type provided to Mailcheck.check. Type does not exist in Mailcheck.types."
// → false

Mailcheck.check('user@gmail.com', 999);
// console.error: "Invalid type provided to Mailcheck.check. Expected a string. Recommended: use aliases from Mailcheck.types (e.g., Mailcheck.types.ANY)."
// → false
```

---

## Technical notes

**Immutability** — The `Mailcheck` object and all its nested properties (including `types` and the regex cache) are recursively frozen using a custom `objDeepFreeze` implementation. Attempts to mutate the API at runtime will fail silently in non-strict mode or throw a `TypeError` in strict mode.

**Conflict detection** — The IIFE checks for a pre-existing `window.Mailcheck` before self-registering. If a conflict is detected, initialization aborts and a `console.warn` is emitted.

**Regex cache** — All patterns are pre-compiled once at load time and stored in a frozen internal cache. No `RegExp` objects are created per-call.

**Non-enumerable global** — `Mailcheck` is registered via `Object.defineProperty` with `enumerable: false`, so it does not appear in `for...in` loops or `Object.keys(window)`.

**Local character support** — The local-part of all patterns includes `çÇ`, as these characters appear in Brazilian email addresses and are valid under RFC 6530 (internationalized email).

---

## Relation to Mailcheck-PHP

Mailcheck-JS was created as a browser-side companion to [Mailcheck-PHP](https://github.com/pedrohrigolin/Mailcheck-PHP), enabling consistent front-end and back-end email validation with aligned rule sets.

## Status

The current version covers the core validation use cases and is ready for production use. A full-featured version — with expanded rule sets and closer parity with Mailcheck-PHP — is planned but has no set release date. The current build is stable and actively maintained in the meantime.

---

## Author

**Pedro Rigolin**
