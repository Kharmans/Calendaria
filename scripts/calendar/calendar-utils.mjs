/**
 * Calendar Utility Functions
 * Helper functions for calendar data manipulation and conversion.
 *
 * @module Calendar/CalendarUtils
 * @author Tyler
 */

/**
 * Prelocalize a string value if it appears to be a localization key.
 * @param {string} value - The value to localize
 * @returns {string} Localized string or original value
 * @private
 */
function localizeIfKey(value) {
  if (typeof value !== 'string') return value;
  // Only localize if it looks like a localization key (contains dots and no spaces)
  if (value.includes('.') && !value.includes(' ')) {
    return game.i18n.localize(value);
  }
  return value;
}

/**
 * Prelocalize calendar configuration data.
 * Walks through the calendar definition and replaces localization keys with their localized values.
 *
 * @param {object} calendarData - Calendar definition object to prelocalize
 * @returns {object} The same calendar object with prelocalized strings
 */
export function preLocalizeCalendar(calendarData) {
  // Prelocalize calendar name
  if (calendarData.name) {
    calendarData.name = localizeIfKey(calendarData.name);
  }

  // Prelocalize month names and abbreviations
  if (calendarData.months?.values) {
    for (const month of calendarData.months.values) {
      if (month.name) month.name = localizeIfKey(month.name);
      if (month.abbreviation) month.abbreviation = localizeIfKey(month.abbreviation);
    }
  }

  // Prelocalize day/weekday names
  if (calendarData.days?.values) {
    for (const day of calendarData.days.values) {
      if (day.name) day.name = localizeIfKey(day.name);
    }
  }

  // Prelocalize season names
  if (calendarData.seasons?.values) {
    for (const season of calendarData.seasons.values) {
      if (season.name) season.name = localizeIfKey(season.name);
    }
  }

  // Prelocalize festival names (Calendaria-specific)
  if (calendarData.festivals) {
    for (const festival of calendarData.festivals) {
      if (festival.name) festival.name = localizeIfKey(festival.name);
    }
  }

  // Prelocalize moon names and phase names (Calendaria-specific)
  if (calendarData.moons) {
    for (const moon of calendarData.moons) {
      if (moon.name) moon.name = localizeIfKey(moon.name);
      if (moon.phases) {
        for (const phase of moon.phases) {
          if (phase.name) phase.name = localizeIfKey(phase.name);
        }
      }
    }
  }

  // Prelocalize metadata description
  if (calendarData.metadata?.description) {
    calendarData.metadata.description = localizeIfKey(calendarData.metadata.description);
  }

  return calendarData;
}

/**
 * Convert Calendaria calendar definition to D&D 5e-compatible format.
 * This strips out Calendaria-specific features (festivals, moons, metadata)
 * and creates a base CalendarData-compatible object.
 *
 * @param {object} calendariaDefinition - Calendar definition with Calendaria extensions
 * @returns {object} - Base CalendarData-compatible definition
 */
export function conformTo5eModel(calendariaDefinition) {
  const { festivals, moons, metadata, seasons, ...baseCalendar } = calendariaDefinition;

  // Return only the base CalendarData fields that D&D 5e understands
  return {
    name: baseCalendar.name,
    years: baseCalendar.years,
    months: baseCalendar.months,
    days: baseCalendar.days,
    // Include seasons if they exist and are in 5e format
    ...(seasons && { seasons })
  };
}

/**
 * Find festival day for a given date.
 * Works with any calendar that has a festivals array.
 *
 * @param {object} calendar - Calendar instance with festivals array
 * @param {number|object} time - Time to check (worldTime number or components object)
 * @returns {object|null} Festival object if found, null otherwise
 */
export function findFestivalDay(calendar, time = game.time.worldTime) {
  if (!calendar.festivals || calendar.festivals.length === 0) return null;

  const components = typeof time === 'number' ? calendar.timeToComponents(time) : time;
  return calendar.festivals.find(
    (f) => f.month === components.month + 1 && f.day === components.dayOfMonth + 1
  ) ?? null;
}

/**
 * Get month abbreviation with fallback to full name.
 * Ensures we always have a displayable month name even if abbreviation is undefined.
 *
 * @param {object} month - Month object from calendar definition
 * @returns {string} Month abbreviation or full name if abbreviation is undefined
 */
export function getMonthAbbreviation(month) {
  return month.abbreviation ?? month.name;
}

/**
 * Format a date as "Day Month" or festival name if applicable.
 * This is a reusable formatter for any calendar with festivals.
 *
 * @param {object} calendar - Calendar instance
 * @param {object} components - Date components
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatMonthDay(calendar, components, options = {}) {
  const festivalDay = findFestivalDay(calendar, components);
  if (festivalDay) {
    return game.i18n.localize(festivalDay.name);
  }

  // Use standard formatting if no festival
  // This calls the calendar's default formatter or constructs a basic format
  const day = components.dayOfMonth + 1;
  const month = calendar.months.values[components.month];
  const monthName = options.abbreviated ? getMonthAbbreviation(month) : month.name;

  return game.i18n.format('CALENDARIA.Formatters.DayMonth', {
    day,
    month: game.i18n.localize(monthName)
  });
}

/**
 * Format a date as "Day Month Year" or "Festival, Year" if applicable.
 * This is a reusable formatter for any calendar with festivals.
 *
 * @param {object} calendar - Calendar instance
 * @param {object} components - Date components
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatMonthDayYear(calendar, components, options = {}) {
  const festivalDay = findFestivalDay(calendar, components);
  if (festivalDay) {
    const year = components.year + (calendar.years?.yearZero ?? 0);
    return game.i18n.format('CALENDARIA.Formatters.FestivalDayYear', {
      day: game.i18n.localize(festivalDay.name),
      yyyy: year
    });
  }

  // Use standard formatting if no festival
  const day = components.dayOfMonth + 1;
  const month = calendar.months.values[components.month];
  const monthName = options.abbreviated ? getMonthAbbreviation(month) : month.name;
  const year = components.year + (calendar.years?.yearZero ?? 0);

  return game.i18n.format('CALENDARIA.Formatters.DayMonthYear', {
    day,
    month: game.i18n.localize(monthName),
    yyyy: year
  });
}
