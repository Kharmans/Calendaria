# Theming

Calendaria supports customizable color themes for all UI elements.

---

## Accessing Theme Settings

Open the settings panel and navigate to the **Appearance** tab.

---

## Color Categories

Themes are organized into categories:

### Background Colors

- **Primary Background** - Main widget background
- **Secondary Background** - Alternate/hover backgrounds
- **Tertiary Background** - Nested element backgrounds

### Text Colors

- **Primary Text** - Main text color
- **Secondary Text** - Muted/subtitle text
- **Accent Text** - Highlighted text

### Border Colors

- **Primary Border** - Main border color
- **Secondary Border** - Subtle borders

### Accent Colors

- **Primary Accent** - Main accent color (buttons, highlights)
- **Secondary Accent** - Alternate accent color

### Status Colors

- **Success** - Positive indicators
- **Warning** - Caution indicators
- **Error** - Error/danger indicators

---

## Customizing Colors

1. Click any color swatch to open the color picker
2. Choose a new color
3. Changes apply immediately to all Calendaria widgets
4. Colors are saved per-client

---

## Resetting Theme

Click **Reset All** in the Appearance tab to restore default colors.

---

## Exporting & Importing Themes

### Export

1. Open Appearance tab
2. Click **Export Theme**
3. Save the JSON file

### Import

1. Open Appearance tab
2. Click **Import Theme**
3. Select a previously exported JSON file
4. Colors update immediately

Theme files contain a `colors` object with all customizable color values.

---

## CSS Variables

Themes work by setting CSS custom properties on the Calendaria UI elements. Advanced users can inspect these in browser developer tools for additional customization via world scripts or custom CSS modules.
