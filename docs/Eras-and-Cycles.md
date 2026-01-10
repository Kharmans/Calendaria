# Eras and Cycles

## Eras

Eras define historical periods with custom year formatting. Configure eras in the **Calendar Editor > Eras** tab.

### Era Fields

| Field | Description |
|-------|-------------|
| Name | Full era name (e.g., "Dale Reckoning") |
| Abbreviation | Short form (e.g., "DR") |
| Start Year | First year of this era |
| End Year | Last year (leave empty if ongoing) |
| Format | Position of abbreviation: `prefix` or `suffix` |
| Template | Custom format template (overrides Format if set) |

### Era Resolution

When displaying a year, Calendaria finds the matching era by checking which era contains that year. The `yearInEra` is calculated as `displayYear - startYear + 1`.

### Era Templates

Custom templates use these placeholders:

| Placeholder | Description |
|-------------|-------------|
| `[year]` | Absolute display year |
| `[yearInEra]` | Year within the current era |
| `[eraAbbr]` | Era abbreviation |
| `[era]` | Full era name |

Examples:

- `[year] [eraAbbr]` produces "1492 DR"
- `[eraAbbr] [yearInEra]` produces "DR 5"
- `Year [yearInEra] of the [era]` produces "Year 5 of the Third Age"

When no template is set, the Format field controls output:

- `suffix`: "1492 DR"
- `prefix`: "DR 1492"

---

## Cycles

Cycles are repeating sequences (zodiac signs, elemental weeks, etc.). Configure cycles in the **Calendar Editor > Cycles** tab.

### Cycle Fields

| Field | Description |
|-------|-------------|
| Name | Cycle name (e.g., "Zodiac") |
| Length | How many units before advancing to next entry |
| Offset | Starting offset for calculation |
| Based On | Time unit driving the cycle |
| Entries | List of cycle entries with names |

### Based On Options

| Value | Description |
|-------|-------------|
| `year` | Calendar year |
| `eraYear` | Year within current era |
| `month` | Month index |
| `monthDay` | Day of month |
| `day` | Absolute day count from epoch |
| `yearDay` | Day of year |

### Display Format

The cycle format field controls how cycles appear in the UI. Use numbered placeholders for each cycle:

- `[1]`, `[2]`, etc. — Current entry name for each cycle
- `[n]` — Line break

Example: `[1] - Week of [2]` produces "Gemini - Week of Fire"

---

## Using Eras and Cycles in Format Strings

To display era and cycle information in date format strings, use the format tokens documented in [Settings > Formats](Settings#format-tokens).

Key tokens:

| Token | Description | Example |
|-------|-------------|---------|
| `GGGG` | Full era name | Dale Reckoning |
| `G` | Era abbreviation | DR |
| `[yearInEra]` | Year within era | 5 |
| `[cycleName]` | Current cycle entry | Gemini |
| `[cycle]` | Current cycle number | 3 |

---

## For Developers

See [API Reference](API-Reference#eras-and-cycles) for era and cycle methods.
