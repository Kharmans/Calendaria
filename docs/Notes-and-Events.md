# Notes and Events

Calendar notes are journal entry pages that attach to specific dates. Notes support rich text content, custom icons, recurrence patterns, categories, and macro triggers.

## Note Storage

Notes are stored as individual `JournalEntry` documents within a dedicated folder per calendar. Each note contains a single `JournalEntryPage` of type `calendaria.calendarnote`.

### Folder Structure

```
📁 [Calendar Name] Notes (hidden from sidebar)
  📄 Note 1 (JournalEntry)
  📄 Note 2 (JournalEntry)
  ...
```

Calendar infrastructure folders are hidden from the Journal sidebar to reduce clutter. Access notes through the calendar UI instead.

### Migration

Existing worlds with the legacy journal-based storage (single JournalEntry with pages) are automatically migrated to the folder-based system on world load. The migration:

- Creates a folder for each calendar with existing notes
- Converts each note page to its own JournalEntry
- Preserves all note data and ownership
- Cleans up orphaned legacy journals

## Creating a Note

### From the Calendar UI

1. Click a date on the calendar grid
2. Click **Add Note** to open the note editor
3. Configure title, icon, dates, times, and content
4. Click **Save & Close**

### From the API

```javascript
await CALENDARIA.api.createNote({
  name: "Council Meeting",
  content: "<p>Meeting with the Lords' Alliance</p>",
  startDate: { year: 1492, month: 5, day: 15, hour: 14, minute: 0 },
  allDay: false,
  categories: ["meeting"]
});
```

## Note Properties

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Note title |
| `text.content` | HTML | Rich text content (ProseMirror) |
| `startDate` | Object | `{year, month, day, hour, minute}` |
| `endDate` | Object | Optional end date/time |
| `allDay` | Boolean | Ignores time fields when true |
| `repeat` | String | Recurrence pattern |
| `maxOccurrences` | Number | Limit total recurrences (0 = unlimited) |
| `categories` | String[] | Category IDs |
| `color` | Hex | Display color |
| `icon` | String | FontAwesome class or image path |
| `iconType` | String | `fontawesome` or `image` |
| `gmOnly` | Boolean | Visible only to GMs |
| `silent` | Boolean | Suppresses reminders and announcements |
| `macro` | String | Macro ID to execute on trigger |

## Editing and Deleting

### Edit a Note

1. Click the note to open it in view mode
2. Click the pencil icon in the header to switch to edit mode
3. Make changes
4. Click the save icon or close the window

### Delete a Note

1. Open the note in edit mode
2. Click the trash icon in the header
3. Confirm deletion

## Recurrence Patterns

Set the **Repeat** dropdown to enable recurrence. Available patterns:

| Pattern | Description |
|---------|-------------|
| `never` | One-time event (default) |
| `daily` | Every N days |
| `weekly` | Same weekday every N weeks |
| `monthly` | Same day of month every N months |
| `yearly` | Same month/day every N years |
| `weekOfMonth` | Ordinal weekday (e.g., "2nd Tuesday") |
| `seasonal` | Based on season boundaries |
| `moon` | Based on moon phase conditions |
| `random` | Probability-based with seeded randomness |
| `range` | Pattern matching on year/month/day values |
| `linked` | Relative to another note's occurrences |
| `computed` | Complex moveable feast calculations |

### Repeat Options

- **Max Occurrences**: Limits total recurrences (0 = unlimited)
- **Repeat End Date**: Stop repeating after this date

**Note:** For monthless calendars (e.g., Traveller), the `monthly` and `weekOfMonth` patterns are hidden since they don't apply.

### Week of Month

Schedule events like "Second Tuesday of each month":

1. Set Repeat to **weekOfMonth**
2. Choose the occurrence (1st through 5th, or Last / 2nd Last)
3. Choose the weekday

### Seasonal

Events tied to seasons:

1. Set Repeat to **seasonal**
2. Select the season
3. Choose trigger: **Entire Season**, **First Day**, or **Last Day**

### Moon Phase

Events triggered by moon phases:

1. Set Repeat to **moon**
2. Add moon conditions by selecting a moon and phase
3. Multiple conditions can be added (any match triggers)

Moon conditions specify a phase range (0-1 position in cycle).

### Random Events

Probability-based occurrence:

1. Set Repeat to **random**
2. Configure probability (0-100%)
3. Set check interval: daily, weekly, or monthly
4. Seed value ensures deterministic randomness across clients

Random occurrences are pre-generated and cached to ensure consistency.

### Linked Events

Events relative to another note:

1. Set Repeat to **linked**
2. Select the parent note
3. Set offset in days (negative = before, positive = after)

Example: "-3" offset creates an event 3 days before each occurrence of the linked event.

### Range Pattern

Match dates using exact values, ranges, or wildcards:

1. Set Repeat to **range**
2. For each component (year, month, day), choose:
   - **Any**: Matches all values
   - **Exact**: Matches a specific value
   - **Range**: Matches a min-max range

### Advanced Conditions

Additional filters applied on top of recurrence patterns. All conditions must pass (AND logic).

Available condition fields:

| Category | Fields |
|----------|--------|
| Date | year, month, day, dayOfYear, daysBeforeMonthEnd |
| Weekday | weekday, weekNumberInMonth, inverseWeekNumber |
| Week | weekInMonth, weekInYear, totalWeek, weeksBeforeMonthEnd, weeksBeforeYearEnd |
| Season | season, seasonPercent, seasonDay, isLongestDay, isShortestDay, isSpringEquinox, isAutumnEquinox |
| Moon | moonPhaseIndex, moonPhaseCountMonth, moonPhaseCountYear |
| Cycle | cycle (if calendar has cycles) |
| Era | era, yearInEra (if calendar has eras) |
| Other | intercalary (for intercalary days) |

Operators: `==`, `!=`, `>=`, `<=`, `>`, `<`, `%` (modulo)

## Categories

Predefined categories:

| ID | Label |
|----|-------|
| `holiday` | Holiday |
| `festival` | Festival |
| `quest` | Quest |
| `session` | Session |
| `combat` | Combat |
| `meeting` | Meeting |
| `birthday` | Birthday |
| `deadline` | Deadline |
| `reminder` | Reminder |
| `other` | Other |

### Custom Categories

1. Type a category name in the input field next to the multi-select
2. Click the + button to create
3. Right-click a custom category tag to delete it

Custom categories are stored in world settings and available to all notes.

## Icons

Notes support two icon types:

- **FontAwesome**: Enter a class like `fas fa-dragon`
- **Image**: Select an image file via file picker

Right-click the icon picker to switch between modes. The icon color is controlled by the color picker.

## Visibility

- **GM Only**: Note is only visible to GMs (uses Foundry ownership system)
- **Silent**: Suppresses reminders and event announcements

## Player Permissions

Players can create, edit, and delete their own notes. Ownership is determined by standard Foundry document permissions.

### What Players Can Do

- **Create notes**: Using the Add Note button on calendar UI
- **Edit own notes**: Notes they created (Owner permission)
- **Delete own notes**: Notes they created
- **View shared notes**: Notes with appropriate permissions

### What Players Cannot Do

- **View GM-only notes**: Hidden via ownership settings
- **Edit others' notes**: Unless given explicit permission
- **Modify time/date**: All time controls are GM-only
- **Change weather**: Weather picker is GM-only

### Note Ownership

When a player creates a note:

1. The JournalEntry is created with the player as owner
2. Other players see it based on default permissions
3. GM always has full access

When a GM creates a note:

1. "GM Only" checkbox controls player visibility
2. If checked, ownership is set to GM-only
3. If unchecked, default permissions apply

## Macro Triggers

Select a macro from the dropdown to execute when the event triggers. Macros run when the event scheduler detects the event has started.

## API Examples

### Get Notes for a Date

```javascript
const notes = CALENDARIA.api.getNotesForDate(1492, 5, 15);
```

### Get Notes in a Range

```javascript
const notes = CALENDARIA.api.getNotesInRange(
  { year: 1492, month: 5, day: 1 },
  { year: 1492, month: 5, day: 31 }
);
```

### Get Notes by Category

```javascript
const meetings = CALENDARIA.api.getNotesByCategory("meeting");
```

### Update a Note

```javascript
await CALENDARIA.api.updateNote(pageId, {
  name: "Updated Title",
  categories: ["quest", "deadline"]
});
```

### Delete a Note

```javascript
await CALENDARIA.api.deleteNote(pageId);
```

### Search Notes

```javascript
const results = CALENDARIA.api.searchNotes("dragon", {
  categories: ["quest"]
});
```

## Relevant Files

- `scripts/notes/note-manager.mjs` - CRUD operations and indexing
- `scripts/notes/note-data.mjs` - Data validation and categories
- `scripts/notes/utils/recurrence.mjs` - Recurrence pattern matching
- `scripts/sheets/calendar-note-sheet.mjs` - Note editor UI
- `scripts/sheets/calendar-note-data-model.mjs` - Data schema
- `templates/sheets/calendar-note-form.hbs` - Editor form template
