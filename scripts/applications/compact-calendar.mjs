/**
 * Compact Calendar - All-in-one calendar widget with timekeeping.
 * Frameless, draggable, with persistent position and open state.
 *
 * @module Applications/CompactCalendar
 * @author Tyler
 */

import { MODULE, SETTINGS, TEMPLATES, HOOKS } from '../constants.mjs';
import CalendarManager from '../calendar/calendar-manager.mjs';
import TimeKeeper, { getTimeIncrements } from '../time/time-keeper.mjs';
import { dayOfWeek } from '../notes/utils/date-utils.mjs';
import { CalendarApplication } from './calendar-application.mjs';
import * as ViewUtils from './calendar-view-utils.mjs';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Compact calendar widget combining mini month view with time controls.
 */
export class CompactCalendar extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @type {CompactCalendar|null} Singleton instance */
  static _instance = null;

  /** @type {object|null} Currently selected date */
  _selectedDate = null;

  /** @type {object|null} Currently viewed month/year */
  _viewedDate = null;

  /** @type {number|null} Hook ID for updateWorldTime */
  #timeHookId = null;

  /** @type {Array} Hook references for cleanup */
  #hooks = [];

  /** @type {boolean} Whether time controls are locked visible */
  #controlsLocked = false;

  /** @type {number|null} Timeout ID for hiding controls */
  #hideTimeout = null;

  /** @type {number|null} Timeout ID for hiding sidebar */
  #sidebarTimeout = null;

  /** @type {number|null} Last rendered day (for change detection) */
  #lastDay = null;

  /** @type {boolean} Sidebar visibility state (survives re-render) */
  #sidebarVisible = false;

  /** @type {boolean} Time controls visibility state (survives re-render) */
  #controlsVisible = false;

  /** @override */
  static DEFAULT_OPTIONS = {
    id: 'compact-calendar',
    classes: ['compact-calendar'],
    position: {
      width: 'auto',
      height: 'auto',
      zIndex: 250
    },
    window: {
      frame: false,
      positioned: true
    },
    actions: {
      navigate: CompactCalendar._onNavigate,
      today: CompactCalendar._onToday,
      selectDay: CompactCalendar._onSelectDay,
      addNote: CompactCalendar._onAddNote,
      openFull: CompactCalendar._onOpenFull,
      close: CompactCalendar._onClose,
      toggle: CompactCalendar._onToggleClock,
      forward: CompactCalendar._onForward,
      forward5x: CompactCalendar._onForward5x,
      reverse: CompactCalendar._onReverse,
      reverse5x: CompactCalendar._onReverse5x,
      setCurrentDate: CompactCalendar._onSetCurrentDate,
      toggleLock: CompactCalendar._onToggleLock,
      toSunrise: CompactCalendar._onToSunrise,
      toMidday: CompactCalendar._onToMidday,
      toSunset: CompactCalendar._onToSunset,
      toMidnight: CompactCalendar._onToMidnight
    }
  };

  /** @override */
  static PARTS = {
    main: {
      template: TEMPLATES.COMPACT_CALENDAR
    }
  };

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Get the active calendar.
   * @returns {CalendariaCalendar}
   */
  get calendar() {
    return CalendarManager.getActiveCalendar();
  }

  /**
   * Get the date being viewed (month/year).
   * @returns {object}
   */
  get viewedDate() {
    if (this._viewedDate) return this._viewedDate;
    return ViewUtils.getCurrentViewedDate(this.calendar);
  }

  set viewedDate(date) {
    this._viewedDate = date;
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const calendar = this.calendar;
    const viewedDate = this.viewedDate;

    context.isGM = game.user.isGM;
    context.running = TimeKeeper.running;
    context.currentTime = TimeKeeper.getFormattedTime();
    context.currentDate = TimeKeeper.getFormattedDate();

    // Time increment dropdown
    context.increments = Object.entries(getTimeIncrements()).map(([key, seconds]) => ({
      key,
      label: this.#formatIncrement(key),
      seconds,
      selected: key === TimeKeeper.incrementKey
    }));

    if (calendar) {
      context.calendarData = this._generateMiniCalendarData(calendar, viewedDate);
    }

    // Show "Set Current Date" button if selected date differs from today (GM only)
    context.showSetCurrentDate = false;
    if (game.user.isGM && this._selectedDate) {
      const today = ViewUtils.getCurrentViewedDate(calendar);
      context.showSetCurrentDate =
        this._selectedDate.year !== today.year ||
        this._selectedDate.month !== today.month ||
        this._selectedDate.day !== today.day;
    }

    // Pass visibility states to template to prevent flicker on re-render
    context.sidebarVisible = this.#sidebarVisible;
    context.controlsVisible = this.#controlsVisible || this.#controlsLocked;
    context.controlsLocked = this.#controlsLocked;

    return context;
  }

  /**
   * Generate simplified calendar data for the mini month grid.
   * @param {CalendariaCalendar} calendar - The calendar
   * @param {object} date - The viewed date
   * @returns {object} Calendar grid data
   */
  _generateMiniCalendarData(calendar, date) {
    const { year, month } = date;
    const monthData = calendar.months?.values?.[month];

    if (!monthData) return null;

    const daysInMonth = monthData.days;
    const daysInWeek = calendar.days?.values?.length || 7;
    const weeks = [];
    let currentWeek = [];

    // Get visible notes using shared utility
    const allNotes = ViewUtils.getCalendarNotes();
    const visibleNotes = ViewUtils.getVisibleNotes(allNotes);

    // Calculate starting day of week
    const useFixedMonthStart = daysInWeek === 10 || calendar.years?.firstWeekday === 0;
    const startDayOfWeek = useFixedMonthStart ? 0 : dayOfWeek({ year, month, day: 1 });

    // Add empty cells before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ empty: true });
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      const hasNotes = ViewUtils.hasNotesOnDay(visibleNotes, year, month, day);
      const festivalDay = calendar.findFestivalDay({ year, month, dayOfMonth: day - 1 });

      // Get first moon phase only using shared utility
      const moonData = ViewUtils.getFirstMoonPhase(calendar, year, month, day);

      currentWeek.push({
        day,
        year,
        month,
        isToday: ViewUtils.isToday(year, month, day, calendar),
        isSelected: this._isSelected(year, month, day),
        hasNotes,
        isFestival: !!festivalDay,
        festivalName: festivalDay ? game.i18n.localize(festivalDay.name) : null,
        moonIcon: moonData?.icon ?? null,
        moonPhase: moonData?.tooltip ?? null
      });

      if (currentWeek.length === daysInWeek) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining empty cells
    while (currentWeek.length > 0 && currentWeek.length < daysInWeek) {
      currentWeek.push({ empty: true });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    // Get current season
    let season = null;
    const currentSeason = calendar.getCurrentSeason?.();
    if (currentSeason) {
      season = game.i18n.localize(currentSeason.name);
    }

    return {
      year,
      month,
      monthName: game.i18n.localize(monthData.name),
      yearDisplay: calendar.formatYearWithEra?.(year) ?? String(year),
      season,
      weeks,
      weekdays:
        calendar.days?.values?.map((wd) => {
          const name = game.i18n.localize(wd.name);
          return name.substring(0, 2); // First 2 chars for compact view
        }) || []
    };
  }

  /**
   * Check if a date is selected.
   * @param {number} year - Display year
   * @param {number} month - Month
   * @param {number} day - Day (1-indexed)
   * @returns {boolean}
   */
  _isSelected(year, month, day) {
    if (!this._selectedDate) return false;
    return this._selectedDate.year === year && this._selectedDate.month === month && this._selectedDate.day === day;
  }

  /* -------------------------------------------- */
  /*  Lifecycle                                   */
  /* -------------------------------------------- */

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);

    // Restore position
    this.#restorePosition();

    // Enable dragging
    this.#enableDragging();

    // Increment selector listener
    this.element.querySelector('[data-action="increment"]')?.addEventListener('change', (event) => {
      TimeKeeper.setIncrement(event.target.value);
    });

    // Set up time update hook
    if (!this.#timeHookId) {
      this.#timeHookId = Hooks.on('updateWorldTime', this.#onUpdateWorldTime.bind(this));
    }

    // Clock state hook
    Hooks.on(HOOKS.CLOCK_START_STOP, this.#onClockStateChange.bind(this));

    // Sidebar auto-hide
    const container = this.element.querySelector('.compact-calendar-container');
    const sidebar = this.element.querySelector('.compact-sidebar');
    if (container && sidebar) {
      container.addEventListener('mouseenter', () => {
        clearTimeout(this.#sidebarTimeout);
        this.#sidebarVisible = true;
        sidebar.classList.add('visible');
      });
      container.addEventListener('mouseleave', () => {
        const delay = game.settings.get(MODULE.ID, SETTINGS.COMPACT_CONTROLS_DELAY) * 1000;
        this.#sidebarTimeout = setTimeout(() => {
          this.#sidebarVisible = false;
          sidebar.classList.remove('visible');
        }, delay);
      });
    }

    // Time controls auto-hide (GM only)
    const timeDisplay = this.element.querySelector('.compact-time-display');
    const timeControls = this.element.querySelector('.compact-time-controls');
    if (timeDisplay && timeControls) {
      const showControls = () => {
        clearTimeout(this.#hideTimeout);
        this.#controlsVisible = true;
        timeControls.classList.add('visible');
      };
      const hideControls = () => {
        if (this.#controlsLocked) return;
        const delay = game.settings.get(MODULE.ID, SETTINGS.COMPACT_CONTROLS_DELAY) * 1000;
        this.#hideTimeout = setTimeout(() => {
          this.#controlsVisible = false;
          timeControls.classList.remove('visible');
        }, delay);
      };
      timeDisplay.addEventListener('mouseenter', showControls);
      timeDisplay.addEventListener('mouseleave', hideControls);
      timeControls.addEventListener('mouseenter', showControls);
      timeControls.addEventListener('mouseleave', hideControls);
    }
  }

  /** @override */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);

    // Initialize day tracking for re-render optimization
    this.#lastDay = ViewUtils.getCurrentViewedDate(this.calendar)?.day;

    // Set up context menu for day cells
    ViewUtils.setupDayContextMenu(this.element, '.compact-day:not(.empty)', this.calendar, {
      onSetDate: () => {
        this._selectedDate = null;
        this.render();
      },
      onCreateNote: () => this.render()
    });

    // Debounced render for note changes
    const debouncedRender = foundry.utils.debounce(() => this.render(), 100);

    this.#hooks.push({
      name: 'updateJournalEntryPage',
      id: Hooks.on('updateJournalEntryPage', (page) => {
        if (page.type === 'calendaria.calendarnote') debouncedRender();
      })
    });

    this.#hooks.push({
      name: 'createJournalEntryPage',
      id: Hooks.on('createJournalEntryPage', (page) => {
        if (page.type === 'calendaria.calendarnote') debouncedRender();
      })
    });

    this.#hooks.push({
      name: 'deleteJournalEntryPage',
      id: Hooks.on('deleteJournalEntryPage', (page) => {
        if (page.type === 'calendaria.calendarnote') debouncedRender();
      })
    });
  }

  /** @override */
  async _onClose(options) {
    // Save open state
    await game.settings.set(MODULE.ID, SETTINGS.COMPACT_CALENDAR_OPEN, false);

    // Cleanup hooks
    if (this.#timeHookId) {
      Hooks.off('updateWorldTime', this.#timeHookId);
      this.#timeHookId = null;
    }

    this.#hooks.forEach((hook) => Hooks.off(hook.name, hook.id));
    this.#hooks = [];

    await super._onClose(options);
  }

  /* -------------------------------------------- */
  /*  Position & Dragging                         */
  /* -------------------------------------------- */

  /**
   * Restore saved position from settings.
   */
  #restorePosition() {
    const savedPos = game.settings.get(MODULE.ID, SETTINGS.COMPACT_CALENDAR_POSITION);

    if (savedPos && typeof savedPos.top === 'number' && typeof savedPos.left === 'number') {
      // Use setPosition to properly update internal position state
      this.setPosition({ left: savedPos.left, top: savedPos.top });
    } else {
      // Default position: top right (calculate from viewport)
      const rect = this.element.getBoundingClientRect();
      const left = window.innerWidth - rect.width - 310;
      const top = 10;
      this.setPosition({ left, top });
    }
  }

  /**
   * Enable dragging on the top row.
   */
  #enableDragging() {
    const dragHandle = this.element.querySelector('.compact-top-row');
    if (!dragHandle) return;

    const drag = new foundry.applications.ux.Draggable.implementation(this, this.element, dragHandle, false);

    let dragStartX = 0;
    let dragStartY = 0;
    let elementStartLeft = 0;
    let elementStartTop = 0;

    const originalMouseDown = drag._onDragMouseDown.bind(drag);
    drag._onDragMouseDown = (event) => {
      const rect = this.element.getBoundingClientRect();
      elementStartLeft = rect.left;
      elementStartTop = rect.top;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      originalMouseDown(event);
    };

    drag._onDragMouseMove = (event) => {
      event.preventDefault();
      const now = Date.now();
      if (!drag._moveTime) drag._moveTime = 0;
      if (now - drag._moveTime < 1000 / 60) return;
      drag._moveTime = now;

      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      const rect = this.element.getBoundingClientRect();

      let newLeft = elementStartLeft + deltaX;
      let newTop = elementStartTop + deltaY;

      // Clamp to viewport
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

      // Use setPosition to properly update internal position state
      this.setPosition({ left: newLeft, top: newTop });
    };

    drag._onDragMouseUp = async (event) => {
      event.preventDefault();
      window.removeEventListener(...drag.handlers.dragMove);
      window.removeEventListener(...drag.handlers.dragUp);

      // Save position from internal state
      await game.settings.set(MODULE.ID, SETTINGS.COMPACT_CALENDAR_POSITION, {
        left: this.position.left,
        top: this.position.top
      });
    };
  }

  /* -------------------------------------------- */
  /*  Time Updates                                */
  /* -------------------------------------------- */

  /**
   * Handle world time updates.
   */
  #onUpdateWorldTime() {
    if (!this.rendered) return;

    const timeEl = this.element.querySelector('.time-value');
    const dateEl = this.element.querySelector('.date-value');

    if (timeEl) timeEl.textContent = TimeKeeper.getFormattedTime();
    if (dateEl) dateEl.textContent = TimeKeeper.getFormattedDate();

    // Only re-render if day changed (to update today highlight)
    const currentDay = ViewUtils.getCurrentViewedDate(this.calendar)?.day;
    if (currentDay !== this.#lastDay) {
      this.#lastDay = currentDay;
      this.render();
    }
  }

  /**
   * Handle clock state changes (from other sources like TimeKeeperHUD).
   */
  #onClockStateChange() {
    if (!this.rendered) return;
    const running = TimeKeeper.running;
    const tooltip = running
      ? game.i18n.localize('CALENDARIA.TimeKeeper.Stop')
      : game.i18n.localize('CALENDARIA.TimeKeeper.Start');

    // Update time-toggle in time-display
    const timeToggle = this.element.querySelector('.time-toggle');
    if (timeToggle) {
      timeToggle.classList.toggle('active', running);
      timeToggle.dataset.tooltip = tooltip;
      const icon = timeToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-play', !running);
        icon.classList.toggle('fa-pause', running);
      }
    }
  }

  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  static async _onNavigate(event, target) {
    const direction = target.dataset.direction === 'next' ? 1 : -1;
    const current = this.viewedDate;
    const calendar = this.calendar;

    let newMonth = current.month + direction;
    let newYear = current.year;

    if (newMonth >= calendar.months.values.length) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = calendar.months.values.length - 1;
      newYear--;
    }

    this.viewedDate = { year: newYear, month: newMonth, day: 1 };
    await this.render();
  }

  static async _onToday(event, target) {
    this._viewedDate = null;
    this._selectedDate = null;
    await this.render();
  }

  static async _onSelectDay(event, target) {
    // Check for double-click first (manual detection since re-render breaks native dblclick)
    const wasDoubleClick = await ViewUtils.handleDayClick(event, this.calendar, {
      onSetDate: () => {
        this._selectedDate = null;
        this.render();
      },
      onCreateNote: () => this.render()
    });
    if (wasDoubleClick) return;

    const day = parseInt(target.dataset.day);
    const month = parseInt(target.dataset.month);
    const year = parseInt(target.dataset.year);

    // Toggle selection
    if (this._selectedDate?.year === year && this._selectedDate?.month === month && this._selectedDate?.day === day) {
      this._selectedDate = null;
    } else {
      this._selectedDate = { year, month, day };
    }

    await this.render();
  }

  static async _onAddNote(event, target) {
    // Use selected date or today
    let day, month, year;

    if (this._selectedDate) {
      ({ day, month, year } = this._selectedDate);
    } else {
      const today = game.time.components;
      const calendar = this.calendar;
      const yearZero = calendar?.years?.yearZero ?? 0;
      year = today.year + yearZero;
      month = today.month;
      day = (today.dayOfMonth ?? 0) + 1;
    }

    const page = await NoteManager.createNote({
      name: 'New Note',
      noteData: {
        startDate: {
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
          hour: 12,
          minute: 0
        },
        endDate: {
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
          hour: 13,
          minute: 0
        }
      }
    });

    if (page) page.sheet.render(true, { mode: 'edit' });
  }

  static async _onOpenFull(event, target) {
    new CalendarApplication().render(true);
  }

  static async _onClose(event, target) {
    await this.close();
  }

  static _onToggleClock(event, target) {
    TimeKeeper.toggle();
    // Update time-toggle state directly without re-render
    const timeToggle = this.element.querySelector('.time-toggle');
    if (timeToggle) {
      timeToggle.classList.toggle('active', TimeKeeper.running);
      const icon = timeToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-play', !TimeKeeper.running);
        icon.classList.toggle('fa-pause', TimeKeeper.running);
      }
      timeToggle.dataset.tooltip = TimeKeeper.running
        ? game.i18n.localize('CALENDARIA.TimeKeeper.Stop')
        : game.i18n.localize('CALENDARIA.TimeKeeper.Start');
    }
  }

  static _onForward(event, target) {
    TimeKeeper.forward();
  }

  static _onForward5x(event, target) {
    TimeKeeper.forward(5);
  }

  static _onReverse(event, target) {
    TimeKeeper.reverse();
  }

  static _onReverse5x(event, target) {
    TimeKeeper.reverse(5);
  }

  static async _onSetCurrentDate(event, target) {
    if (!this._selectedDate) return;
    await ViewUtils.setDateTo(this._selectedDate.year, this._selectedDate.month, this._selectedDate.day, this.calendar);
    this._selectedDate = null;
    await this.render();
  }

  /**
   * Toggle time controls pin state.
   * @param {PointerEvent} event - Click event
   * @param {HTMLElement} target - Button element
   */
  static _onToggleLock(event, target) {
    this.#controlsLocked = !this.#controlsLocked;
    const pinBtn = this.element.querySelector('.pin-btn');
    const timeControls = this.element.querySelector('.compact-time-controls');

    if (this.#controlsLocked) {
      pinBtn?.classList.add('pinned');
      clearTimeout(this.#hideTimeout);
      // Show controls immediately when pinned
      timeControls?.classList.add('visible');
      this.#controlsVisible = true;
    } else {
      pinBtn?.classList.remove('pinned');
      // Start hide timer
      const delay = game.settings.get(MODULE.ID, SETTINGS.COMPACT_CONTROLS_DELAY) * 1000;
      this.#hideTimeout = setTimeout(() => {
        this.#controlsVisible = false;
        timeControls?.classList.remove('visible');
      }, delay);
    }
  }

  /**
   * Advance time to sunrise.
   */
  static async _onToSunrise() {
    const calendar = this.calendar;
    if (!calendar?.sunrise) return;
    const targetHour = calendar.sunrise();
    if (targetHour === null) return;
    await this.#advanceToHour(targetHour);
  }

  /**
   * Advance time to midday (half of hoursPerDay).
   */
  static async _onToMidday() {
    const hoursPerDay = game.time.calendar?.days?.hoursPerDay ?? 24;
    await this.#advanceToHour(hoursPerDay / 2);
  }

  /**
   * Advance time to sunset.
   */
  static async _onToSunset() {
    const calendar = this.calendar;
    if (!calendar?.sunset) return;
    const targetHour = calendar.sunset();
    if (targetHour === null) return;
    await this.#advanceToHour(targetHour);
  }

  /**
   * Advance time to midnight (0:00 next day).
   */
  static async _onToMidnight() {
    await this.#advanceToHour(0, true);
  }

  /**
   * Advance time to a specific hour of day.
   * @param {number} targetHour - Target hour (fractional, e.g. 6.5 = 6:30)
   * @param {boolean} [nextDay=false] - If true, always advance to next day
   */
  static async #advanceToHour(targetHour, nextDay = false) {
    if (!game.user.isGM) return;

    const cal = game.time.calendar;
    if (!cal) return;

    const days = cal.days ?? {};
    const secondsPerMinute = days.secondsPerMinute ?? 60;
    const minutesPerHour = days.minutesPerHour ?? 60;
    const hoursPerDay = days.hoursPerDay ?? 24;
    const secondsPerHour = secondsPerMinute * minutesPerHour;

    const components = game.time.components;
    const currentHour = components.hour + components.minute / minutesPerHour + components.second / secondsPerHour;

    let hoursUntil;
    if (nextDay || currentHour >= targetHour) {
      // Advance to target hour tomorrow
      hoursUntil = hoursPerDay - currentHour + targetHour;
    } else {
      // Advance to target hour today
      hoursUntil = targetHour - currentHour;
    }

    const secondsToAdvance = Math.round(hoursUntil * secondsPerHour);
    if (secondsToAdvance > 0) {
      await game.time.advance(secondsToAdvance);
    }
  }

  /* -------------------------------------------- */
  /*  Helper Methods                              */
  /* -------------------------------------------- */

  /**
   * Format increment key for display.
   * @param {string} key - Increment key
   * @returns {string} Formatted label
   */
  #formatIncrement(key) {
    const labels = {
      second: game.i18n.localize('CALENDARIA.TimeKeeper.Second'),
      round: game.i18n.localize('CALENDARIA.TimeKeeper.Round'),
      minute: game.i18n.localize('CALENDARIA.TimeKeeper.Minute'),
      hour: game.i18n.localize('CALENDARIA.TimeKeeper.Hour'),
      day: game.i18n.localize('CALENDARIA.TimeKeeper.Day'),
      week: game.i18n.localize('CALENDARIA.TimeKeeper.Week'),
      month: game.i18n.localize('CALENDARIA.TimeKeeper.Month'),
      season: game.i18n.localize('CALENDARIA.TimeKeeper.Season'),
      year: game.i18n.localize('CALENDARIA.TimeKeeper.Year')
    };
    return labels[key] || key;
  }

  /* -------------------------------------------- */
  /*  Static Methods                              */
  /* -------------------------------------------- */

  /**
   * Show the compact calendar singleton.
   * @returns {CompactCalendar}
   */
  static show() {
    if (!this._instance) {
      this._instance = new CompactCalendar();
    }
    this._instance.render(true);
    game.settings.set(MODULE.ID, SETTINGS.COMPACT_CALENDAR_OPEN, true);
    return this._instance;
  }

  /**
   * Hide the compact calendar.
   */
  static hide() {
    this._instance?.close();
  }

  /**
   * Toggle the compact calendar visibility.
   */
  static toggle() {
    if (this._instance?.rendered) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Get the singleton instance.
   * @returns {CompactCalendar|null}
   */
  static get instance() {
    return this._instance;
  }
}
