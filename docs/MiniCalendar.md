# MiniCalendar

A compact month-view calendar widget with integrated time controls.

---

## Display

The MiniCalendar shows a monthly grid with the current date highlighted. For monthless calendars (like Traveller), it displays a 3-week view instead.

### Indicators

Below the navigation row, the MiniCalendar displays contextual indicators:

- **Weather** - Current weather with icon, label, and temperature. GM can click to open weather picker. Shows "click to generate" prompt when no weather is set.
- **Season** - Current season with icon and name
- **Era** - Current era indicator (if calendar has eras)
- **Cycle** - Current cycle values (if calendar has cycles configured)

### Navigation

- **Arrow buttons** - Previous/next month (or week for monthless calendars)
- **Today button** - Return to current date
- Click a day to select it
- Click a grayed-out day to navigate to that month

### Monthless Calendars

For calendars without months (like Traveller), the MiniCalendar shows a 3-week view:

- Previous week, current week, and next week
- Navigation moves by week instead of month
- Header displays "Week X, Year"

### Day Cells

Each day cell may show:

- Note count badge (if notes exist)
- Festival highlight
- Moon phase icon
- Today indicator
- Selected indicator

---

## Sidebar

Appears on hover over the calendar area (or always visible when sticky):

- **Close** - Close the MiniCalendar
- **Open Full Calendar** - Opens the full Calendar Application
- **Today** - Return to current date view
- **Set Current Date** - Set world time to selected date (GM only, appears when date selected)
- **Add Note** - Create a new note on selected/current date
- **Search Notes** - Open search panel
- **View Notes** - View notes on selected date (appears when notes exist)
- **Settings** - Open the settings panel

Right-click the MiniCalendar container for a context menu with a Close option.

### Notes Panel

Click "View Notes" to see all notes for the selected date:

- Notes sorted by time (all-day first)
- Click a note to open in view mode
- Click edit icon to open in edit mode (if owner)

---

## Time Display

Shows current time. GM can:

- Click to toggle time flow (play/pause)
- Hover to reveal time controls

### Time Controls (GM Only)

Revealed on hover over the time display:

| Button | Action |
|--------|--------|
| Sunrise | Advance to next sunrise |
| Midday | Advance to solar noon |
| Reverse 5x | Step backward by 5 increments |
| Reverse | Step backward by one increment |
| Increment selector | Set step size |
| Forward | Step forward by one increment |
| Forward 5x | Step forward by 5 increments |
| Sunset | Advance to next sunset |
| Midnight | Advance to next midnight |

---

## Double-Click Behavior

- Double-click MiniCalendar to open the full Calendar Application
- Double-click the full Calendar Application to return to MiniCalendar

---

## Settings

Configure via **Settings Panel > MiniCalendar** tab. See [Settings](Settings#minicalendar) for all options.
