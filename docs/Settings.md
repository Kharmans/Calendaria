# Settings

Calendaria settings are accessed via **Settings > Module Settings > Calendaria > Calendaria Settings**.

The settings panel is organized into tabs. GM-only tabs are marked below.

---

## Calendar (GM Only)

### Active Calendar

Select which calendar system to use. Changing this requires a world reload.

- Default: `gregorian`

### Open Calendar Editor

Button to launch the Calendar Editor for creating/modifying calendars.

### Import Calendar

Button to open the calendar importer for Simple Calendar, Fantasy Calendar, and other formats.

---

## Notes (GM Only)

### Custom Categories

Create custom note categories with:

- **Name**: Category display name
- **Color**: Category color (hex)
- **Icon**: FontAwesome icon class (e.g., `fas fa-bookmark`)

---

## Time (GM Only)

### Sync Scene Darkness

Automatically adjust scene darkness based on time of day.

- Default: `true`

### Advance Time on Rest

Advance world time when players take short/long rests.

- Default: `false`

### Real-Time Clock Speed

Configure how fast the in-game clock advances in real-time mode.

- **Multiplier**: How many units pass per real second (minimum 1)
- **Unit**: What time unit advances (second, round, minute, hour, day, week, month, season, year)
- Example: "10 minutes per second" means 1 real second = 10 in-game minutes
- Default: `1 second per second`

### Sync with Game Pause

Clock automatically stops when the game is paused. When enabled, the clock also pauses during active combat.

- Default: `false`

> [!NOTE]
> When sync is enabled and blocked (paused or in combat), manually starting the clock shows a warning notification.

### Sync Scene Ambience with Weather

Automatically update scene darkness and environment lighting based on current weather and climate zone.

- Default: `true`

---

## Moons (GM Only)

### Show Moon Phases

Display moon phase information in the calendar UI.

- Default: `true`

---

## Weather (GM Only)

### Temperature Unit

Choose temperature display format.

- Options: `Celsius`, `Fahrenheit`
- Default: `Celsius`

### Climate Zone

Select the active climate zone (if defined in the calendar).

### Custom Weather Presets

Create custom weather conditions with an inline editor UI:

- **Name**: Condition display name
- **Icon**: FontAwesome icon class
- **Color**: Condition color (hex)
- **Temperature Range**: Min/max temperature for this condition

Custom presets appear in the Calendar Editor Weather tab and Climate dialogs alongside built-in conditions.

### Brightness Multiplier

Global default brightness multiplier for scene ambience.

- Range: `0.5` to `1.5`
- Default: `1.0`

---

## Appearance

### Theme Mode

Select the visual theme for Calendaria UI components.

- Options: `Dark`, `High Contrast`, `Custom`
- Default: `Dark`

### Theme Colors

When Theme Mode is set to `Custom`, you can customize all UI colors. See [Theming](Theming) for details on color categories, export/import, and CSS variables.

### Enable Sticky Zones

Allow draggable windows (HUD, MiniCalendar, TimeKeeper) to snap to predefined positions.

- Default: `true`

---

## Formats (GM Only)

Configure date/time display formats for different UI locations. Each location supports separate GM and player formats.

### Locations

- **HUD Date**: Date display on Calendaria HUD
- **HUD Time**: Time display on Calendaria HUD
- **TimeKeeper Date**: Date display on TimeKeeper HUD (supports `Off` to hide)
- **TimeKeeper Time**: Time display on TimeKeeper HUD
- **MiniCalendar Header**: Header text on MiniCalendar
- **MiniCalendar Time**: Time display on MiniCalendar
- **Full Calendar Header**: Header on the full calendar view
- **Chat Timestamp**: In-game timestamps in chat

### Format Presets

- `calendarDefault`: Uses the active calendar's built-in format for that location
- `short`: Abbreviated format
- `long`: Standard format
- `full`: Complete format with all details
- `ordinal`: Day with ordinal suffix
- `fantasy`: Fantasy-style descriptive format
- `time`: 24-hour time
- `time12`: 12-hour time with AM/PM
- `approxTime`: Approximate time of day
- `approxDate`: Approximate date
- `datetime`: Date and time combined
- `datetime12`: Date and 12-hour time
- `custom`: User-defined format string
- `off`: Hide the element entirely (only available for specific locations)

### Format Tokens

#### Year

| Token | Description | Example |
|-------|-------------|---------|
| `YYYY` | 4-digit year | 1492 |
| `YY` | 2-digit year | 92 |
| `Y` | Unpadded year | 1492 |

#### Month

| Token | Description | Example |
|-------|-------------|---------|
| `MMMM` | Full month name | Flamerule |
| `MMM` | Abbreviated month name | Fla |
| `MM` | 2-digit month | 07 |
| `M` | Unpadded month | 7 |
| `Mo` | Month with ordinal | 7th |

#### Day

| Token | Description | Example |
|-------|-------------|---------|
| `DD` | 2-digit day | 05 |
| `D` | Unpadded day | 5 |
| `Do` | Day with ordinal | 5th |
| `DDD` | Day of year | 186 |

#### Weekday

| Token | Description | Example |
|-------|-------------|---------|
| `EEEE` | Full weekday name | Sunday |
| `EEE` | Abbreviated weekday | Sun |
| `E`, `EE` | Numeric weekday | 1 |
| `e` | Local numeric weekday | 0 |

#### Time

| Token | Description | Example |
|-------|-------------|---------|
| `HH`, `H` | 24-hour (padded/unpadded) | 14, 14 |
| `hh`, `h` | 12-hour (padded/unpadded) | 02, 2 |
| `mm`, `m` | Minutes (padded/unpadded) | 05, 5 |
| `ss`, `s` | Seconds (padded/unpadded) | 09, 9 |
| `A`, `a` | AM/PM (upper/lower) | PM, pm |

#### Era

| Token | Description | Example |
|-------|-------------|---------|
| `GGGG`, `GGG` | Full era name | Dale Reckoning |
| `GG` | Abbreviated era | DR |
| `G` | Narrow era | D |

#### Season

| Token | Description | Example |
|-------|-------------|---------|
| `QQQQ` | Full season name | Summer |
| `QQQ` | Abbreviated season | Sum |
| `QQ`, `Q` | Numeric season | 2 |

#### Week

| Token | Description | Example |
|-------|-------------|---------|
| `ww`, `w` | Week of year | 27, 27 |
| `W` | Week of month | 1 |

#### Climate Zone

| Token | Description | Example |
|-------|-------------|---------|
| `zzzz` | Full climate zone name | Temperate Forest |
| `z` | Abbreviated climate zone | Temp |

#### Fantasy

| Token | Description | Example |
|-------|-------------|---------|
| `[approxTime]` | Approximate time of day | Afternoon |
| `[approxDate]` | Approximate date | Midsummer |
| `[moon]` | Current moon phase | Full Moon |
| `[ch]` | Current canonical hour | Vespers |
| `[chAbbr]` | Abbreviated canonical hour | Ves |
| `[cycle]` | Current cycle value | 3 |
| `[cycleName]` | Current cycle entry name | Gemini |
| `[cycleRoman]` | Cycle value as roman numeral | III |
| `[yearInEra]` | Year within current era | 5 |

> [!NOTE]
> On intercalary days, `MMMM`/`MMM` return the festival name; `D`/`DD`/`Do`/`M`/`MM`/`Mo` return empty strings.

---

## Macros (GM Only)

### Global Triggers

Assign macros to run at specific times:

- **Dawn**: Sunrise
- **Dusk**: Sunset
- **Midday**: Noon
- **Midnight**: Midnight
- **New Day**: Day change

### Season Triggers

Assign macros to run when specific seasons begin. Supports "All Seasons" for any season change.

### Moon Phase Triggers

Assign macros to run on specific moon phases. Configure by moon and phase, or use "All Moons"/"All Phases" wildcards.

---

## Chat (GM Only)

### Chat Timestamp Mode

How to display in-game time on chat messages.

- `disabled`: No in-game timestamps
- `replace`: Replace real-world time with in-game time
- `augment`: Show both real and in-game time
- Default: `disabled`

### Show Time in Timestamps

Include hours/minutes in chat timestamps.

- Default: `true`

---

## Advanced

### Primary GM (GM Only)

Designate which GM controls time advancement in multi-GM games.

- Default: Auto (first active GM)

### Logging Level

Control console debug output. This is a per-user setting.

- `Off`: No logging
- `Errors`: Only errors
- `Warnings`: Errors and warnings
- `Verbose`: All debug information
- Default: `Warnings`

### Dev Mode (GM Only)

Enable developer features such as calendar journal deletion and sticky zone visualization.

- Default: `false`

---

## Calendaria HUD

### Show on World Load

Display the Calendaria HUD when the world loads.

- Default: `false`

### HUD Mode

- `Fullsize`: Full HUD display with dome/slice dial
- `Compact`: Condensed bar display (forces slice dial)
- Default: `fullsize`

### Width Scale

Scale HUD width from 0.5x to 2.0x (base 800px, range 400-1600px). Only applies in fullsize mode.

- Range: `0.5` to `2.0`
- Default: `1.0`

### Dial Style

Choose how the sun/moon are displayed:

- `Dome`: Semi-circular dome above the bar with sun/moon arc
- `Slice`: Horizontal strip in the bar with sun/moon traveling left-to-right
- Default: `dome`

### Compact During Combat

Automatically switch to slice style during combat to reduce screen space.

- Default: `true`

### Hide During Combat

Automatically hide the HUD during active combat. When enabled, disables auto-compact behavior.

- Default: `false`

### Block Visibility

Toggle visibility of indicator blocks in the HUD bar:

- **Show Weather**: Display weather indicator
- **Show Season**: Display season indicator
- **Show Era/Cycle**: Display era and cycle indicators

Hiding blocks automatically shrinks HUD width. Settings are user-scoped (each player can customize their view).

### Weather Display Mode

- `Full`: Icon + label + temperature
- `Icon + Temperature`: Icon and temp only
- `Icon Only`: Just the weather icon
- `Temperature Only`: Just the temperature
- Default: `full`

### Season Display Mode

- `Icon + Text`: Both icon and season name
- `Icon Only`: Just the season icon
- `Text Only`: Just the season name
- Default: `icon + text`

### Enable Sticky Zones

Allow HUD to snap to predefined positions when dragging:

- `top-center`: Centered at top of viewport
- `above-hotbar`: Above the macro hotbar
- `above-players`: Above the players list
- `below-controls`: Below the scene controls
- Default: `true`

### Custom Time Jumps

Configure custom time jump buttons per increment (e.g., skip 8 hours). Each increment can have its own jump values.

### Sticky Tray

Remember tray open/closed state between sessions.

- Default: `false`

### Tray Open Direction

Direction the time controls tray expands when opened.

- `Down`: Tray opens downward (default, for top-positioned HUD)
- `Up`: Tray opens upward (for bottom-positioned HUD)
- Default: `down`

### Auto-Fade

Enable opacity fade when mouse leaves the HUD.

- Default: `false`

### Idle Opacity

Opacity level when HUD is faded (when Auto-Fade is enabled).

- Range: `0` to `100` (percentage)
- Default: `40`

### Lock Position

Prevent dragging the HUD.

- Default: `false`

### Force HUD (GM Only)

Force HUD display for all connected clients.

- Default: `false`

### Reset Position

Button to reset HUD to default position.

---

## MiniCalendar

### Show on World Load

Display the MiniCalendar when the world loads.

- Default: `true`

### Show Toolbar Button (GM Only)

Show the Calendaria button in the scene controls toolbar.

- Default: `true`

### Controls Delay

Seconds before auto-hiding controls after hover.

- Range: 1-10 seconds
- Default: `3`

### Sticky Time Controls

Remember time controls visibility state.

- Default: `false`

### Sticky Sidebar

Remember sidebar visibility state.

- Default: `false`

### Lock Position

Prevent dragging the MiniCalendar.

- Default: `false`

### Auto-Fade

Enable opacity fade when mouse leaves the MiniCalendar.

- Default: `false`

### Idle Opacity

Opacity level when MiniCalendar is faded (when Auto-Fade is enabled).

- Range: `0` to `100` (percentage)
- Default: `40`

### Force MiniCalendar (GM Only)

Force MiniCalendar display for all connected clients.

- Default: `false`

### Reset Position

Button to reset position to default.

---

## TimeKeeper

### Show on World Load (GM Only)

Display the TimeKeeper HUD when the world loads.

- Default: `false`

### Custom Time Jumps

Configure custom time jump buttons per increment. Each increment can have its own forward/reverse jump values.

### Auto-Fade

Enable opacity fade when mouse leaves the TimeKeeper.

- Default: `true`

### Idle Opacity

Opacity level when TimeKeeper is faded (when Auto-Fade is enabled).

- Range: `0` to `100` (percentage)
- Default: `40`

### Reset Position

Button to reset position to default.

---

## Per-Scene Settings

Override global settings on individual scenes via **Scene Configuration > Ambiance**:

### Darkness Sync Override

- `Use Global`: Follow the module setting
- `Enabled`: Always sync this scene
- `Disabled`: Never sync this scene

### Brightness Multiplier

Override the global brightness multiplier for this specific scene.

- Range: `0.5` to `1.5`
- Default: Uses global setting
